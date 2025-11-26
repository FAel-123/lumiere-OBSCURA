import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, BookOpen, X, Loader2, Save, Upload, 
  Lock, Eye, Trash2, Edit3, Sparkles, LogOut, ArrowRight,
  Maximize, Minimize, ChevronLeft, ChevronRight, Image as ImageIcon, Layout,
  Search, Heart, Settings, Grid, Smartphone, Wifi, Bell, Check
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import HTMLFlipBook from 'react-pageflip';

// --- 🔴 PENTING: PASTE CONFIG FIREBASE AWAK DI SINI ---
const firebaseConfig = { 
    apiKey: "AIzaSyDWYur0LAZpRgqKchb44hxSBh3BVAp-QB4",
  authDomain: "lumiere-os.firebaseapp.com",
  databaseURL: "https://lumiere-os-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lumiere-os",
  storageBucket: "lumiere-os.firebasestorage.app",
  messagingSenderId: "688991040684",
  appId: "1:688991040684:web:3f96e2c3b48e8cb9d95b09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================================================================
// --- SECTION 1: UTILITIES & HELPERS ---
// ============================================================================

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1600; 
        const scaleSize = MAX_WIDTH / img.width;
        const finalScale = scaleSize < 1 ? scaleSize : 1;
        canvas.width = img.width * finalScale;
        canvas.height = img.height * finalScale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.95)); 
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const Page = React.forwardRef((props, ref) => {
  return (
    <div 
        className="page-content bg-[#1a1a1a] overflow-hidden relative" 
        ref={ref} 
        style={{ ...props.style, width: '100%', height: '100%' }}
        data-density={props.isCover ? 'hard' : 'soft'}
    >
      <div className="w-full h-full relative flex items-center justify-center">
        {props.url ? (
             <img src={props.url} alt={`Page ${props.pageNum}`} className="w-full h-full object-cover" loading="eager" />
        ) : (
            <div className="w-full h-full bg-[#111] flex items-center justify-center border-l border-white/5">
                <span className="text-white/20 text-xs tracking-widest uppercase">End of Book</span>
            </div>
        )}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        {!props.isCover && props.pageNum && (
            <div className="absolute bottom-4 right-4 text-[9px] text-white/70 font-sans tracking-widest drop-shadow-md">{props.pageNum}</div>
        )}
        {props.children}
      </div>
    </div>
  );
});

// ============================================================================
// --- SECTION 2: FLIP VIEW ---
// ============================================================================

const FlipView = ({ pages, coverUrl, backCoverUrl, onClose, title }) => {
  const bookRef = useRef();
  const [isReady, setIsReady] = useState(false);

  let finalPages = [ { url: coverUrl, isCover: true }, ...pages ];
  if (finalPages.length % 2 !== 0) { finalPages.push({ url: backCoverUrl || null, isCover: true }); } 
  else { finalPages.push({ url: null, isCover: false }); finalPages.push({ url: backCoverUrl || null, isCover: true }); }

  useEffect(() => {
      const timer = setTimeout(() => setIsReady(true), 300);
      return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center bg-[#0f172a]/95 backdrop-blur-xl overflow-hidden animate-fade-in">
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[60]">
            <div className="px-6 py-2 rounded-full bg-slate-900/50 border border-white/10 text-white shadow-xl backdrop-blur-md">
                <h2 className="font-sans font-bold text-sm tracking-wide uppercase">{title}</h2>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-900/50 hover:bg-red-500/20 text-white hover:text-red-400 flex items-center justify-center border border-white/10 backdrop-blur-md transition-colors"><X size={20}/></button>
        </div>
        <div className="flex-1 w-full flex items-center justify-center p-4">
            {!isReady && (<div className="flex flex-col items-center gap-4 animate-pulse"><Loader2 className="animate-spin text-white/50" size={40} /><span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Opening Album</span></div>)}
            {isReady && (
                <HTMLFlipBook 
                    width={450} height={600} size="fixed" minWidth={300} maxWidth={500} minHeight={400} maxHeight={700}
                    maxShadowOpacity={0.5} showCover={true} mobileScrollSupport={true}
                    className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-scale-up"
                    ref={bookRef} flippingTime={1000} usePortrait={true} startZIndex={0} autoSize={true}
                    clickEventForward={true} useMouseEvents={true} swipeDistance={30} showPageCorners={true} disableFlipByClick={false}
                >
                    {finalPages.map((page, index) => (
                        <Page key={index} url={page.url} pageNum={index} isCover={page.isCover} />
                    ))}
                </HTMLFlipBook>
            )}
        </div>
    </div>
  );
}

// ============================================================================
// --- SECTION 3: STUDIO EDITOR ---
// ============================================================================

const CreateStudio = ({ onClose, title, setTitle, audio, setAudio, pages, setPages, cover, setCover, backCover, setBackCover, onUploadPages, onUploadCover, onUploadBackCover, onPublish, isSaving, statusMsg }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-white font-sans animate-slide-up flex flex-col h-[100dvh]">
      <div className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]/90 backdrop-blur-md z-20"><div className="flex items-center gap-4"><button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><X size={24}/></button><h1 className="text-xl font-serif italic text-slate-200">Studio Editor</h1></div><button onClick={onPublish} disabled={isSaving} className="text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-medium rounded-lg text-sm px-6 py-2.5 text-center flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">{isSaving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18}/> Publish</>}</button></div>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative"><div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-white/5 bg-[#1e293b]/50 flex flex-col z-10 shrink-0 backdrop-blur-sm"><div className="flex-1 overflow-y-auto p-6 scrollbar-hide"><h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 sticky top-0 py-2 z-10"><Edit3 size={14}/> Book Details</h2><div className="space-y-6 pb-10"><div><label className="block mb-2 text-sm font-bold text-slate-400">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="Untitled Album" /></div><div className="grid grid-cols-2 gap-4">{[{label: "Front", img: cover, func: onUploadCover}, {label: "Back", img: backCover, func: onUploadBackCover}].map((item, idx) => (<div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-white/5"><label className="block mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</label><div className="relative aspect-[3/4] bg-[#0f172a] rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden group hover:border-slate-500 transition-colors">{item.img ? <img src={item.img} className="w-full h-full object-cover" /> : <div className="text-center text-slate-600"><ImageIcon size={20} className="mx-auto mb-1" /></div>}<label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={item.func} /><Plus className="text-white bg-white/20 rounded-full p-1" size={24}/></label></div></div>))}</div><div><label className="block mb-2 text-sm font-bold text-slate-400">Audio URL</label><input type="url" value={audio} onChange={(e) => setAudio(e.target.value)} className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="https://..." /></div>{statusMsg && <div className="p-3 mb-4 text-xs text-cyan-200 rounded-lg bg-cyan-900/20 border border-cyan-800 flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> {statusMsg}</div>}</div></div></div><div className="flex-1 bg-[#0f172a] relative flex flex-col min-h-0"><div className="flex-1 overflow-y-auto p-8 pb-32"><div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-[#0f172a]/90 backdrop-blur-md py-4 border-b border-white/5"><h3 className="text-xl font-bold text-slate-200">Pages Gallery</h3><label className="cursor-pointer bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"><Plus size={16}/> Add Photos<input type="file" multiple accept="image/*" className="hidden" onChange={onUploadPages} /></label></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{pages.map((page, idx) => (<div key={idx} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-white/5 bg-slate-800 shadow-xl hover:ring-2 hover:ring-indigo-500 transition-all duration-300"><img src={page.url} className="w-full h-full object-cover" alt={`Page ${idx}`} /><button onClick={() => setPages(p => p.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg transform translate-y-2 group-hover:translate-y-0"><Trash2 size={14}/></button></div>))}</div></div></div></div></div>
  );
};

// ============================================================================
// --- SECTION 4: CAROUSEL ---
// ============================================================================

const Carousel3D = ({ books, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % books.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'ArrowRight') nextSlide(); if (e.key === 'ArrowLeft') prevSlide(); if (e.key === 'Enter') onSelect(books[activeIndex]); };
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, books]);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none"><h1 className="text-[15vw] font-black tracking-tighter text-white/5 leading-none">LIBRARY</h1></div>
        <div className="relative w-full max-w-[1400px] h-[600px] flex items-center justify-center perspective-camera z-10 mt-10">
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {books.map((book, index) => {
              let offset = index - activeIndex;
              if (offset < -2) offset += books.length; if (offset > 2) offset -= books.length;
              const isActive = offset === 0;
              return (
                <div key={book.id} className={`absolute w-[350px] aspect-[4/5] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`} style={{ transform: `translateX(${offset * 380}px) translateZ(${isActive ? 200 : -300}px) rotateY(${offset * -20}deg)`, zIndex: isActive ? 50 : 20 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} onClick={() => isActive ? onSelect(book) : (offset > 0 ? nextSlide() : prevSlide())}>
                  <div className={`w-full h-full bg-[#1e293b] rounded-xl overflow-hidden relative shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)] border border-white/10 transition-all duration-500 ${isActive ? 'brightness-105 scale-100 ring-1 ring-white/30' : 'brightness-50 grayscale scale-90'}`}><img src={book.coverUrl} className="w-full h-full object-cover" /><div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"><h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight drop-shadow-lg">{book.title}</h3><p className="text-xs text-indigo-300 uppercase tracking-[0.2em] font-medium">{book.pageCount} Pages</p></div></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-8 mt-12 z-50"><button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all shadow-lg hover:scale-110"><ChevronLeft size={24}/></button><button onClick={nextSlide} className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all shadow-lg hover:scale-110"><ChevronRight size={24}/></button></div>
    </div>
  );
};

// ============================================================================
// --- SECTION 5: SETTINGS & SIDEBAR ---
// ============================================================================

const SettingsModal = ({ isOpen, onClose, securityEnabled, setSecurityEnabled }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="bg-[#1e293b] w-96 p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6"><h3 className="text-white font-bold flex items-center gap-2"><Settings size={18}/> System Settings</h3><button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18}/></button></div>
                <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 mb-4"><div className="flex justify-between items-center"><div><p className="text-sm font-bold text-white mb-1">Visitor Remote Approval</p><p className="text-[10px] text-slate-400">Allow access via phone notification</p></div>
                <button onClick={() => setSecurityEnabled(!securityEnabled)} className={`w-12 h-6 rounded-full transition-colors relative ${securityEnabled ? 'bg-indigo-500' : 'bg-slate-600'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${securityEnabled ? 'left-7' : 'left-1'}`} /></button></div></div>
                <p className="text-[10px] text-slate-500 text-center">Lumière OS v2.5 (Strict Mode)</p>
            </div>
        </div>
    )
}

const Sidebar = ({ userRole, onLogout, onStudio, openSettings, approveVisitor, visitorRequest }) => {
    const menuItems = [ { icon: BookOpen, label: 'Library', active: true }, { icon: Heart, label: 'Favorites', active: false }, { icon: Grid, label: 'Collections', active: false } ];
    return (
        <div className="w-[90px] h-screen bg-[#1e293b]/30 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50 shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg shadow-pink-500/20 animate-pulse-slow"><Camera size={24} strokeWidth={2.5}/></div>
            
            {/* EDITOR APPROVAL BUTTON (BELL) */}
            {visitorRequest && userRole === 'editor' && (
                <button onClick={approveVisitor} className="relative w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white animate-bounce shadow-lg shadow-red-500/50 mb-4">
                    <Bell size={24} />
                    <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">1</span>
                </button>
            )}

            <div className="flex flex-col gap-6 w-full px-3">{menuItems.map((item, idx) => (<button key={idx} className={`group relative flex items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 ${item.active ? 'bg-white text-slate-900 shadow-lg shadow-white/10' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}><item.icon size={22} strokeWidth={item.active ? 2.5 : 2} /><span className="absolute left-16 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">{item.label}</span></button>))}</div>
            <div className="mt-auto flex flex-col gap-6 w-full px-3">{userRole === 'editor' && (<><button onClick={onStudio} className="group w-full aspect-square rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"><Plus size={24} /><span className="absolute left-16 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">Create</span></button><button onClick={openSettings} className="group w-full aspect-square rounded-2xl text-slate-400 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all"><Settings size={22} /><span className="absolute left-16 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">Config</span></button></>)}<button onClick={onLogout} className="w-full aspect-square rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-all"><LogOut size={22} /></button></div>
        </div>
    )
}

// ============================================================================
// --- SECTION 6: LANDING SCREEN (STRICT NO-PIN MODE) ---
// ============================================================================

const LandingScreen = ({ onEnter, securityEnabled }) => {
  const [pinMode, setPinMode] = useState(false); 
  const [isRequesting, setIsRequesting] = useState(false); 
  const [requestStatus, setRequestStatus] = useState("idle"); 
  
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [successMode, setSuccessMode] = useState(false); 
  
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (requestStatus === "waiting") {
        const statusRef = ref(db, 'access/status');
        const unsubscribe = onValue(statusRef, (snapshot) => {
            const val = snapshot.val();
            if (val === "approved") {
                onEnter('visitor'); 
                set(ref(db, 'access/status'), "locked"); 
            }
        });
        return () => unsubscribe();
    }
  }, [requestStatus]);

  const sendAccessRequest = async () => {
      setIsRequesting(true); 
      setRequestStatus("waiting");
      set(ref(db, 'access/status'), "pending");
      
      try {
        await fetch('https://ntfy.sh/lumiere_admin_access_6011', {
            method: 'POST',
            body: '🔔 Visitor waiting! Tap to open dashboard.',
            headers: { 
                'Title': 'Access Request', 
                'Priority': 'high',
                'Click': 'https://lumiere-os.vercel.app' // TAP NOTIFICATION -> BUKA APP
            }
        });
      } catch(e) { console.log("Notify failed", e) }
  };

  const startPress = () => {
      setIsPressing(true);
      let start = Date.now();
      const animate = () => {
          let now = Date.now();
          let p = Math.min((now - start) / 1500 * 100, 100); 
          setProgress(p);
          if (p < 100) {
              animationRef.current = requestAnimationFrame(animate);
          } else {
              sendAccessRequest();
          }
      };
      animationRef.current = requestAnimationFrame(animate);
  }

  const cancelPress = () => {
      setIsPressing(false);
      setProgress(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }

  const handleEditorLogin = (inputPin) => { 
      if (inputPin === "767707") { 
          setError(false); setPinMode(false); setSuccessMode(true);
      } else { 
          setError(true); setTimeout(() => { setError(false); setPin(""); }, 500); 
      } 
  };

  const handleLogout = () => { setSuccessMode(false); setPinMode(false); setPin(""); }

  return (
    <div className="fixed inset-0 bg-[#f0f2f5] flex flex-col items-center justify-center font-sans select-none">
      <div className="absolute inset-0 overflow-hidden pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300/40 rounded-full blur-[100px]" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-300/40 rounded-full blur-[80px] translate-y-20" /></div>
      
      <div className="z-10 relative flex flex-col items-center w-full max-w-md">
        
        {/* LOGO */}
        {!successMode && !isRequesting && !pinMode && (
             <div className="mb-10 animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-violet-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-pink-500/20 mx-auto mb-6">
                    <Camera className="text-white" size={32} strokeWidth={2.5} />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Lumière OS</h1>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">Select Your Journey</p>
                </div>
            </div>
        )}

        {/* MAIN BUTTONS */}
        {!pinMode && !successMode && !isRequesting && (
          <div className="flex gap-6 animate-slide-up">
            <button onClick={() => setPinMode(true)} className="group w-36 h-44 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-white/60 hover:scale-105 transition-all duration-300 shadow-xl shadow-slate-200/50">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all"><Lock className="text-white" size={20} /></div>
                <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Editor</span>
            </button>
            
            <button 
                onMouseDown={securityEnabled ? startPress : () => onEnter('visitor')} 
                onMouseUp={securityEnabled ? cancelPress : null}
                onMouseLeave={securityEnabled ? cancelPress : null}
                onTouchStart={securityEnabled ? startPress : () => onEnter('visitor')}
                onTouchEnd={securityEnabled ? cancelPress : null}
                className="group relative w-36 h-44 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-white/60 hover:scale-105 transition-all duration-300 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
                <div className="absolute bottom-0 left-0 right-0 bg-violet-500/10 transition-all duration-75" style={{ height: `${progress}%` }} />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all relative z-10"><Eye className="text-white" size={20} /></div>
                <div className="flex flex-col items-center z-10">
                    <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Visitor</span>
                    {securityEnabled && <span className="text-[8px] text-slate-400 uppercase mt-1">{progress > 0 ? "Hold..." : "Hold to Request"}</span>}
                </div>
            </button>
          </div>
        )}

        {/* WAITING SCREEN (NO MANUAL PIN OPTION) */}
        {isRequesting && (
          <div className="flex flex-col items-center animate-slide-up bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full mx-4 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-violet-100 border-t-violet-500 animate-spin" />
                <Smartphone size={24} className="text-slate-400"/>
            </div>
            <h3 className="text-slate-800 text-xl font-black mb-2">Approval Required</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">Notification sent to Owner.<br/>Waiting for remote unlock...</p>
            <div className="flex flex-col gap-3 w-full">
                <button onClick={() => {setIsRequesting(false); setRequestStatus("idle");}} className="text-xs text-slate-400 font-bold tracking-widest uppercase hover:text-slate-600 py-2">Cancel</button>
            </div>
          </div>
        )}

        {/* EDITOR PIN ENTRY */}
        {pinMode && !successMode && (
          <div className="flex flex-col items-center animate-slide-up bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full mx-4">
            <h3 className="text-slate-800 text-xl font-bold mb-1">Editor Access</h3>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-8">Enter Passcode</p>
            <div className="flex gap-3 mb-10">{[0,1,2,3,4,5].map((_, i) => (<div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-gradient-to-br from-pink-500 to-rose-600 scale-125' : 'bg-slate-300'}`} />))}</div>
            <input autoFocus type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={pin} onChange={(e) => { const val = e.target.value; if (!/^\d*$/.test(val)) return; setPin(val); if(val.length === 6) handleEditorLogin(val); }} className="opacity-0 absolute inset-0 cursor-pointer h-full w-full z-50" />
            {error && <p className="text-rose-500 text-xs font-bold uppercase animate-pulse mb-4">Incorrect PIN</p>}
            <button onClick={() => {setPinMode(false); setPin("");}} className="mt-2 px-6 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-400 hover:text-slate-800 hover:bg-white uppercase tracking-widest transition-all z-50">Cancel</button>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {successMode && (
          <div className="flex flex-col items-center animate-scale-up text-center bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-violet-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-pink-500/30 mb-8"><Camera className="text-white" size={40} strokeWidth={2.5} /></div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome, Editor</h1>
            <p className="text-sm text-slate-500 font-medium mb-12">You are now inside the Lumière System.</p>
            <div className="flex flex-col gap-4 w-64"><button onClick={() => onEnter('editor')} className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-xs tracking-[0.2em] hover:bg-black hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 uppercase">Enter System <ArrowRight size={14}/></button><button onClick={handleLogout} className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm uppercase">Log Out</button></div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// --- SECTION 7: MAIN APP (CONNECTED) ---
// ============================================================================

export default function LumierePro() {
  const [books, setBooks] = useState([{ id: '1', title: 'Graduation Day', coverUrl: 'https://picsum.photos/400/520?random=1', pageCount: 12 }, { id: '2', title: 'Japan Trip', coverUrl: 'https://picsum.photos/400/520?random=2', pageCount: 8 }, { id: '3', title: 'Wedding', coverUrl: 'https://picsum.photos/400/520?random=3', pageCount: 24 }]);
  const [view, setView] = useState('landing'); 
  const [userRole, setUserRole] = useState('visitor'); 
  const [currentBook, setCurrentBook] = useState(null);
  const [securityEnabled, setSecurityEnabled] = useState(true); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [visitorWaiting, setVisitorWaiting] = useState(false);

  // FIREBASE LISTENER FOR EDITOR
  useEffect(() => {
      if (userRole === 'editor') {
          const statusRef = ref(db, 'access/status');
          const unsubscribe = onValue(statusRef, (snapshot) => {
              const val = snapshot.val();
              setVisitorWaiting(val === "pending");
          });
          return () => unsubscribe();
      }
  }, [userRole]);

  const handleApproveVisitor = () => {
      set(ref(db, 'access/status'), "approved");
      setVisitorWaiting(false);
  }

  const [studioTitle, setStudioTitle] = useState(''); const [studioAudio, setStudioAudio] = useState(''); const [studioCover, setStudioCover] = useState(null); const [studioBackCover, setStudioBackCover] = useState(null); const [studioPages, setStudioPages] = useState([]); const [isSaving, setIsSaving] = useState(false); const [statusMsg, setStatusMsg] = useState("");
  const handleLogin = (role) => { setUserRole(role); setView('dashboard'); };
  const handleOpenStudio = (book) => { if (book) { setStudioTitle(book.title); setStudioCover(book.coverUrl); setStudioBackCover(book.backCoverUrl); setStudioPages(book.pages || []); } else { setStudioTitle(''); setStudioCover(null); setStudioBackCover(null); setStudioPages([]); } setCurrentBook(book); setView('studio'); };
  const handleUploadCover = async (event) => { const file = event.target.files[0]; if(!file) return; const url = await compressImage(file); setStudioCover(url); }
  const handleUploadBackCover = async (event) => { const file = event.target.files[0]; if(!file) return; const url = await compressImage(file); setStudioBackCover(url); }
  const handleUploadPages = async (event) => { const files = Array.from(event.target.files); setStatusMsg('Compressing...'); setIsSaving(true); const uploaded = []; for (const file of files) { const url = await compressImage(file); uploaded.push({ url, caption: file.name }); } setStudioPages(p => [...p, ...uploaded]); setStatusMsg('Ready'); setIsSaving(false); };
  const handlePublish = () => { setIsSaving(true); setTimeout(() => { const newBook = { id: Date.now().toString(), title: studioTitle || 'Untitled', coverUrl: studioCover || 'https://picsum.photos/400/520?random=9', backCoverUrl: studioBackCover, audioUrl: studioAudio, pageCount: studioPages.length, pages: studioPages }; setBooks(prev => [newBook, ...prev]); setIsSaving(false); setView('dashboard'); }, 1000); };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden h-screen w-screen selection:bg-indigo-500/30">
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} securityEnabled={securityEnabled} setSecurityEnabled={setSecurityEnabled} />
      {view === 'landing' && <LandingScreen onEnter={handleLogin} securityEnabled={securityEnabled} />}
      {view === 'reader' && currentBook && ( <FlipView pages={currentBook.pages || []} coverUrl={currentBook.coverUrl} backCoverUrl={currentBook.backCoverUrl} title={currentBook.title} onClose={() => setView('dashboard')} /> )}
      {view === 'studio' && ( <CreateStudio onClose={() => setView('dashboard')} title={studioTitle} setTitle={setStudioTitle} audio={studioAudio} setAudio={setStudioAudio} cover={studioCover} setCover={setStudioCover} backCover={studioBackCover} setBackCover={setStudioBackCover} pages={studioPages} setPages={setStudioPages} onUploadCover={handleUploadCover} onUploadBackCover={handleUploadBackCover} onUploadPages={handleUploadPages} onPublish={handlePublish} isSaving={isSaving} statusMsg={statusMsg} /> )}
      {view === 'dashboard' && (
        <div className="flex h-screen w-full overflow-hidden">
             <Sidebar userRole={userRole} onLogout={() => setView('landing')} onStudio={() => handleOpenStudio(null)} openSettings={() => setIsSettingsOpen(true)} visitorRequest={visitorWaiting} approveVisitor={handleApproveVisitor} />
            <div className="flex-1 h-full overflow-hidden bg-[#0f172a] relative flex flex-col min-h-0">
                <div className="flex-1 relative min-h-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 via-transparent to-transparent pointer-events-none z-0"/>
                    {userRole === 'visitor' || userRole === 'editor' ? ( <Carousel3D books={books} onSelect={(book) => { setCurrentBook(book); setView('reader'); }} /> ) : null}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}