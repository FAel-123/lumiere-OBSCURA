import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, BookOpen, X, Loader2, Save, Upload, 
  Lock, Eye, Trash2, Edit3, Sparkles, LogOut, ArrowRight,
  Maximize, Minimize, ChevronLeft, ChevronRight, Image as ImageIcon, Layout,
  Search, Heart, Settings, Grid, Smartphone, Wifi, Bell, Check, Shield, User, AlertCircle, Unlock, Sun
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import HTMLFlipBook from 'react-pageflip';

// --- 🔴 CONFIG FIREBASE ---
const firebaseConfig = { 
    apiKey: "AIzaSyDWYur0LAZpRgqKchb44hxSBh3BVAp-QB4",
    authDomain: "lumiere-os.firebaseapp.com",
    databaseURL: "https://lumiere-os-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lumiere-os",
    storageBucket: "lumiere-os.firebasestorage.app",
    messagingSenderId: "688991040684",
    appId: "1:688991040684:web:3f96e2c3b48e8cb9d95b09"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================================================================
// --- SECTION 1: UTILITIES & PAGE ---
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
        const MAX_WIDTH = 1200; 
        const scaleSize = MAX_WIDTH / img.width;
        const finalScale = scaleSize < 1 ? scaleSize : 1;
        canvas.width = img.width * finalScale;
        canvas.height = img.height * finalScale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.90)); 
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page-content bg-white overflow-hidden relative border-l border-stone-100 shadow-sm" ref={ref} style={{ ...props.style, width: '100%', height: '100%' }} data-density={props.isCover ? 'hard' : 'soft'}>
      <div className="w-full h-full relative flex items-center justify-center">
        {props.url ? (<img src={props.url} alt={`Page ${props.pageNum}`} className="w-full h-full object-cover" loading="eager" />) : (<div className="w-full h-full bg-stone-50 flex items-center justify-center border-2 border-dashed border-stone-200 m-4 rounded-lg"><span className="text-stone-300 text-xs tracking-widest uppercase font-bold">Page {props.pageNum}</span></div>)}
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-stone-200/50 to-transparent pointer-events-none mix-blend-multiply" />
        {!props.isCover && props.pageNum && (<div className="absolute bottom-6 right-6 text-[10px] text-stone-400 font-bold tracking-widest">{props.pageNum}</div>)}
        {props.children}
      </div>
    </div>
  );
});

// ============================================================================
// --- SECTION 2: FLIP VIEW (CREAM BACKGROUND + HARD MASKING FIX) ---
// ============================================================================
const FlipView = ({ pages, coverUrl, backCoverUrl, onClose, title }) => {
  const bookRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [bookState, setBookState] = useState('closed'); 
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 }); 
  const [isMobile, setIsMobile] = useState(false);

  let finalPages = [ { url: coverUrl, isCover: true }, ...pages ];
  if (finalPages.length % 2 !== 0) { finalPages.push({ url: backCoverUrl || null, isCover: true }); } 
  else { finalPages.push({ url: null, isCover: false }); finalPages.push({ url: backCoverUrl || null, isCover: true }); }

  useEffect(() => {
      const handleResize = () => {
          const w = window.innerWidth;
          if (w < 640) { setIsMobile(true); setDimensions({ width: w - 20, height: (w - 20) * 1.45 }); } 
          else if (w < 1024) { setIsMobile(false); setDimensions({ width: 350, height: 500 }); } 
          else { setIsMobile(false); setDimensions({ width: 420, height: 600 }); }
      };
      handleResize(); window.addEventListener('resize', handleResize);
      const timer = setTimeout(() => setIsReady(true), 300); 
      return () => { window.removeEventListener('resize', handleResize); clearTimeout(timer); }
  }, []);

  const onFlip = (e) => {
      const index = e.data;
      setBookState(index === 0 ? 'closed' : 'open');
  };

  return (
    // BG: CREAM LEMBUT (#F2F0EB) - Tak sakit mata, tapi masih cerah
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center bg-[#F2F0EB] overflow-hidden animate-fade-in touch-none overscroll-none">
        
        {/* CALM MOTIF */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[60]">
            {/* UI Orange/White */}
            <div className="px-6 py-2 rounded-full bg-white border border-orange-100 text-stone-800 shadow-sm"><h2 className="font-sans font-black text-xs md:text-sm tracking-widest uppercase truncate max-w-[200px] md:max-w-none text-orange-500">{title}</h2></div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-white hover:bg-orange-50 text-stone-600 hover:text-orange-500 flex items-center justify-center border border-orange-100 transition-colors shadow-sm"><X size={20}/></button>
        </div>
        
        <div className="flex-1 w-full flex items-center justify-center p-2 md:p-4 overflow-hidden touch-none relative z-10 perspective-[1500px]">
            {!isReady && (<div className="flex flex-col items-center gap-4 animate-pulse"><Loader2 className="animate-spin text-orange-400" size={30} /><span className="text-orange-400 text-[10px] tracking-[0.2em] uppercase">Opening...</span></div>)}
            
            {isReady && (
                // HARD MASKING LOGIC (Untuk Cover Center)
                <div 
                    className={`transition-all duration-700 ease-in-out flex ${bookState === 'closed' && !isMobile ? 'justify-end' : 'justify-center'}`}
                    style={{ 
                        width: (!isMobile && bookState === 'closed') ? dimensions.width : dimensions.width * 2, 
                        height: dimensions.height, 
                        overflow: 'hidden' 
                    }}
                >
                    <div style={{ flexShrink: 0 }}> 
                        <HTMLFlipBook width={dimensions.width} height={dimensions.height} size="fixed" minWidth={300} maxWidth={600} minHeight={400} maxHeight={800} maxShadowOpacity={0.2} showCover={true} startPage={0} mobileScrollSupport={false} useMouseEvents={true} swipeDistance={10} clickEventForward={true} usePortrait={isMobile} onFlip={onFlip} className="" ref={bookRef} flippingTime={1000} startZIndex={0} autoSize={true} showPageCorners={false} disableFlipByClick={false}>
                            {finalPages.map((page, index) => (<Page key={index} url={page.url} pageNum={index} isCover={page.isCover} />))}
                        </HTMLFlipBook>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

// ============================================================================
// --- SECTION 3: LANDING SCREEN (HAPPY THEME + SCROLL) ---
// ============================================================================
const LandingScreen = ({ onEnter, securityEnabled }) => {
  const [pinMode, setPinMode] = useState(false); 
  const [isRequesting, setIsRequesting] = useState(false); 
  const [requestStatus, setRequestStatus] = useState("idle"); 
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const profileSectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (requestStatus === "waiting" && securityEnabled) {
        const statusRef = ref(db, 'access/status');
        const unsubscribe = onValue(statusRef, (snapshot) => {
            const val = snapshot.val();
            if (val === "approved") { onEnter('visitor'); set(ref(db, 'access/status'), "locked"); } 
            else if (val === "denied") { setIsRequesting(false); setRequestStatus("denied"); setTimeout(() => { setRequestStatus("idle"); set(ref(db, 'access/status'), "locked"); }, 4000); }
        });
        return () => unsubscribe();
    }
  }, [requestStatus, securityEnabled]);

  const startExperience = () => {
      setHasEntered(true);
      setTimeout(() => { profileSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  }

  const sendAccessRequest = async () => {
      setIsRequesting(true); setRequestStatus("waiting"); set(ref(db, 'access/status'), "pending");
      const myVercelLink = "https://lumiere-obscura.vercel.app"; 
      try { await fetch('https://ntfy.sh/lumiere_admin_access_6011', { method: 'POST', body: '🔔 Visitor waiting!', headers: { 'Title': 'Access Request', 'Priority': 'high', 'Click': myVercelLink } }); } catch(e) {}
  };

  const startPress = () => {
      if (!securityEnabled) return; 
      setIsPressing(true); let start = Date.now();
      const animate = () => { let now = Date.now(); let p = Math.min((now - start) / 1500 * 100, 100); setProgress(p); if (p < 100) { animationRef.current = requestAnimationFrame(animate); } else { sendAccessRequest(); } };
      animationRef.current = requestAnimationFrame(animate);
  }
  const cancelPress = () => { setIsPressing(false); setProgress(0); if (animationRef.current) cancelAnimationFrame(animationRef.current); }
  const handleVisitorClick = () => { if (securityEnabled === false) { onEnter('visitor'); } }
  const handleEditorLogin = (inputPin) => { if (inputPin === "767707") { setError(false); setPinMode(false); onEnter('editor'); } else { setError(true); setTimeout(() => { setError(false); setPin(""); }, 500); } };

  const bgImage = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2940&auto=format&fit=crop"; // Happy Field

  return (
    <div className="relative w-full h-screen bg-[#FAF9F6] text-stone-800 font-sans overflow-y-auto scroll-smooth selection:bg-orange-200">
        
        {/* --- HERO: HAPPY THEME --- */}
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden snap-start">
             <div className="absolute inset-0 z-0">
                 <img src={bgImage} className="w-full h-full object-cover opacity-30 saturate-150" alt="Happy" />
                 <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-[#FAF9F6]" />
             </div>
             
             <div className="relative z-10 text-center px-4 animate-fade-in-up">
                 <div className="inline-block mb-4 px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold tracking-widest uppercase border border-orange-200">
                     v6.0 Happiness Edition
                 </div>
                 {/* FONT MODERN: SANS-SERIF BOLD */}
                 <h1 className="text-7xl md:text-[10rem] font-sans font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-600 drop-shadow-sm leading-none">
                     OBSCURA
                 </h1>
                 <p className="text-sm md:text-lg text-stone-600 max-w-md mx-auto font-medium tracking-[0.3em] uppercase mb-12">
                     Collect Your Joy
                 </p>
                 
                 <button onClick={startExperience} className="group relative px-10 py-4 bg-stone-900 text-white rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:scale-105 hover:bg-orange-500 transition-all shadow-xl">
                    <span className="relative z-10">Get Started</span>
                 </button>
             </div>
             
             <div className="absolute bottom-10 animate-bounce text-stone-400">
                 <p className="text-[9px] tracking-[0.3em] uppercase mb-2 text-center">Scroll Down</p>
                 <ChevronRight size={24} className="rotate-90 mx-auto"/>
             </div>
        </div>

        {/* --- PROFILE SELECTION --- */}
        <div id="profile-section" ref={profileSectionRef} className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6] snap-start overflow-hidden">
            
            {/* IDENTITY TEXT: 3D BLACK (Light Mode Version) */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
                <h1 
                    className="text-[18vw] font-black tracking-tighter leading-none text-stone-900 opacity-5 md:opacity-10"
                    style={{ textShadow: '1px 1px 0 #e7e5e4, 2px 2px 0 #d6d3d1, 3px 3px 0 #a8a29e' }}
                >
                    IDENTITY
                </h1>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/50 rounded-full blur-[150px] pointer-events-none" />
            
            <h2 className="text-xs font-black tracking-[0.3em] text-stone-900 uppercase mb-16 z-10">Who Are You?</h2>

            {!pinMode && !isRequesting && requestStatus !== "denied" && (
                <div className="flex flex-col md:flex-row gap-8 z-10">
                    {/* BUTTONS: WHITE GLASS STYLE */}
                    <button onClick={() => setPinMode(true)} className="group w-44 h-56 bg-white border border-stone-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:shadow-orange-200/50 hover:scale-105 transition-all duration-500">
                        <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-colors"><Lock size={24} /></div>
                        <span className="text-[11px] font-bold text-stone-500 tracking-widest uppercase group-hover:text-stone-900">Editor</span>
                    </button>

                    <button onClick={handleVisitorClick} onMouseDown={securityEnabled ? startPress : null} onMouseUp={securityEnabled ? cancelPress : null} onMouseLeave={securityEnabled ? cancelPress : null} onTouchStart={securityEnabled ? startPress : null} onTouchEnd={securityEnabled ? cancelPress : null} className={`group relative w-44 h-56 bg-white border border-stone-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:shadow-orange-200/50 hover:scale-105 transition-all duration-500 overflow-hidden`}>
                        {securityEnabled && <div className="absolute bottom-0 left-0 right-0 bg-orange-400 transition-all duration-75" style={{ height: `${progress}%` }} />}
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center relative z-10 transition-colors ${securityEnabled ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-500'}`}>
                            {securityEnabled ? <Eye size={24} /> : <Unlock size={24} />}
                        </div>
                        <div className="flex flex-col items-center z-10">
                            <span className="text-[11px] font-bold text-stone-500 tracking-widest uppercase group-hover:text-stone-900">Visitor</span>
                            <span className={`text-[8px] uppercase mt-2 font-bold tracking-wide ${securityEnabled ? 'text-stone-400' : 'text-green-500'}`}>{securityEnabled ? (progress > 0 ? "Hold..." : "Hold to Request") : "Unlocked"}</span>
                        </div>
                    </button>
                </div>
            )}

            {isRequesting && requestStatus === "waiting" && (<div className="flex flex-col items-center z-10 animate-slide-up bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-xl text-center"><div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-pulse text-orange-500"><Smartphone size={24}/></div><p className="text-sm text-stone-500 mb-8 font-medium">Calling HQ...<br/>Wait a moment.</p><button onClick={() => {setIsRequesting(false); setRequestStatus("idle");}} className="text-[10px] text-stone-400 hover:text-stone-800 font-bold tracking-widest uppercase border-b border-stone-200 pb-1 transition-colors">Cancel</button></div>)}
            {pinMode && (<div className="flex flex-col items-center z-10 animate-slide-up bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-xl"><h3 className="text-stone-800 text-lg font-bold mb-8 font-sans">Editor Access</h3><div className="flex gap-3 mb-8">{[0,1,2,3,4,5].map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full transition-all ${pin.length > i ? 'bg-stone-800 scale-150' : 'bg-stone-200'}`} />))}</div><input autoFocus type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={pin} onChange={(e) => { const val = e.target.value; if (!/^\d*$/.test(val)) return; setPin(val); if(val.length === 6) handleEditorLogin(val); }} className="opacity-0 absolute inset-0 cursor-pointer h-full w-full z-50" />{error && <p className="text-red-500 text-[10px] font-bold uppercase animate-pulse mb-6">Wrong Code</p>}<button onClick={() => {setPinMode(false); setPin("");}} className="text-[10px] text-stone-400 hover:text-stone-800 font-bold tracking-widest uppercase transition-colors">Cancel</button></div>)}
        </div>
    </div>
  );
};

// ============================================================================
// --- SECTION 4: LIBRARY (LIGHT THEME) ---
// ============================================================================
const Carousel3D = ({ books, onSelect, onDelete, userRole }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % books.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'ArrowRight') nextSlide(); if (e.key === 'ArrowLeft') prevSlide(); if (e.key === 'Enter') onSelect(books[activeIndex]); };
    const handleWheel = (e) => { if (Math.abs(e.deltaY) > 20) e.deltaY > 0 ? nextSlide() : prevSlide(); }; 
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, books]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); }
  const onTouchMove = (e) => { setTouchEnd(e.targetTouches[0].clientX); }
  const onTouchEnd = () => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; if (distance > 50) nextSlide(); if (distance < -50) prevSlide(); }

  // EMPTY STATE (Light Mode)
  if (!books || books.length === 0) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 animate-fade-in">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-200"><BookOpen size={32} className="opacity-50 text-stone-400"/></div>
              <h2 className="text-xl font-sans font-bold text-stone-600">Archives Empty</h2>
              <p className="text-[10px] uppercase tracking-widest mt-2 text-stone-400">Waiting for new entry...</p>
          </div>
      );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onWheel={(e) => { if(Math.abs(e.deltaY) > 20) e.deltaY > 0 ? nextSlide() : prevSlide() }}>
        <div className="absolute inset-0 bg-[#FAF9F6]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none"><h1 className="text-[18vw] font-black tracking-tighter text-stone-100 leading-none" style={{textShadow: '1px 1px 0 #e7e5e4, 2px 2px 0 #d6d3d1'}}>LIBRARY</h1></div>
        
        <div className="relative w-full max-w-[1400px] h-[600px] flex items-center justify-center perspective-camera z-10 mt-10">
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {books.map((book, index) => {
              let offset = index - activeIndex;
              if (offset < -1.5) offset += books.length; if (offset > 1.5) offset -= books.length;
              const isActive = offset === 0;
              return (
                <div key={book.id} className={`absolute w-[280px] md:w-[350px] aspect-[4/5] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`} style={{ transform: `translateX(${offset * (window.innerWidth < 640 ? 280 : 380)}px) translateZ(${isActive ? 200 : -300}px) rotateY(${offset * -20}deg)`, zIndex: isActive ? 50 : 20 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} onClick={() => isActive ? onSelect(book) : (offset > 0 ? nextSlide() : prevSlide())}>
                  <div className={`w-full h-full bg-white rounded-xl overflow-hidden relative shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] border border-stone-100 transition-all duration-500 ${isActive ? 'brightness-100 scale-100 ring-4 ring-white' : 'brightness-90 grayscale scale-90'}`}>
                      <img src={book.coverUrl} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 bg-gradient-to-t from-white via-white/90 to-transparent">
                          <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-1 md:mb-2">{book.title}</h3>
                          <p className="text-[10px] md:text-xs text-stone-400 uppercase tracking-[0.2em] font-bold">{book.pageCount} Pages</p>
                      </div>
                      {isActive && userRole === 'editor' && (<button onClick={(e) => { e.stopPropagation(); onDelete(book.id); }} className="absolute top-4 right-4 w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border border-red-100"><Trash2 size={16}/></button>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-20 opacity-30 text-stone-400 text-[10px] uppercase tracking-widest animate-pulse pointer-events-none">Swipe or Scroll</div>
    </div>
  );
};

// --- SECTION 5 & 6: UI (LIGHT GLASS) ---

const SettingsModal = ({ isOpen, onClose, securityEnabled, toggleSecurity }) => {if (!isOpen) return null;return (<div className="fixed inset-0 z-[200] bg-stone-900/20 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4"><div className="bg-white w-full max-w-sm md:w-96 p-6 rounded-3xl border border-white shadow-2xl"><div className="flex justify-between items-center mb-6"><h3 className="text-stone-800 font-bold flex items-center gap-2"><Settings size={18}/> Settings</h3><button onClick={onClose} className="text-stone-400 hover:text-red-500"><X size={18}/></button></div><div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-4"><div className="flex justify-between items-center"><div><p className="text-sm font-bold text-stone-700 mb-1">Remote Approval</p><p className="text-[10px] text-stone-400">Control access via phone</p></div><button onClick={toggleSecurity} className={`w-12 h-6 rounded-full transition-colors relative ${securityEnabled ? 'bg-orange-500' : 'bg-stone-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full transition-all bg-white ${securityEnabled ? 'left-7' : 'left-1'}`} /></button></div></div><p className="text-[10px] text-stone-400 text-center">Lumière OS v6.0</p></div></div>)}
const Sidebar = ({ userRole, onLogout, onStudio, openSettings, visitorRequest, openRequests }) => {const menuItems = [ { icon: BookOpen, label: 'Library', active: true }, { icon: Heart, label: 'Favorites', active: false }, { icon: Grid, label: 'Collections', active: false } ];return (<div className="fixed bottom-0 inset-x-0 h-20 md:h-screen md:w-[90px] md:static bg-white/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-stone-100 flex flex-row md:flex-col items-center justify-between md:justify-start px-6 md:px-0 md:py-8 gap-0 md:gap-8 z-50 shrink-0"><div className="hidden md:flex w-12 h-12 bg-stone-900 rounded-2xl items-center justify-center text-white mb-2 shadow-lg animate-pulse-slow"><Camera size={24} strokeWidth={2.5}/></div><div className="flex flex-row md:flex-col gap-6 md:gap-6 w-full md:px-3 justify-center md:justify-start">{menuItems.map((item, idx) => (<button key={idx} className={`group relative flex items-center justify-center w-10 h-10 md:w-full md:aspect-square rounded-2xl transition-all duration-300 ${item.active ? 'bg-stone-100 text-stone-900 shadow-sm' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'}`}><item.icon size={20} md:size={22} strokeWidth={item.active ? 2.5 : 2} /></button>))}{userRole === 'editor' && (<button onClick={openRequests} className={`group relative flex items-center justify-center w-10 h-10 md:w-full md:aspect-square rounded-2xl transition-all duration-300 ${visitorRequest ? 'bg-red-50 text-red-500 animate-pulse border border-red-100' : 'text-stone-400 hover:text-stone-600'}`}><Shield size={20} md:size={22} />{visitorRequest && <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">1</span>}</button>)}</div><div className="flex flex-row md:flex-col gap-4 md:gap-6 md:w-full md:px-3">{userRole === 'editor' && (<><button onClick={onStudio} className="hidden md:flex group w-full aspect-square rounded-2xl bg-stone-900 text-white items-center justify-center shadow-lg hover:scale-105 transition-all"><Plus size={24} /></button><button onClick={openSettings} className="hidden md:flex group w-full aspect-square rounded-2xl text-stone-500 hover:bg-stone-50 hover:text-stone-600 items-center justify-center transition-all"><Settings size={22} /></button></>)}<button onClick={onLogout} className="w-10 h-10 md:w-full md:aspect-square rounded-2xl text-stone-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"><LogOut size={20} md:size={22} /></button></div></div>)}
const RequestsModal = ({ isOpen, onClose, visitorRequest, onApprove, onDeny }) => {if (!isOpen) return null;return (<div className="fixed inset-0 z-[9999] bg-stone-900/20 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4"><div className="bg-white w-full max-w-sm p-6 rounded-3xl border border-white shadow-2xl scale-100 animate-scale-up"><div className="flex justify-between items-center mb-6"><h3 className="text-stone-800 font-bold flex items-center gap-2"><Shield size={18}/> Requests</h3><button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18}/></button></div>{!visitorRequest ? (<div className="flex flex-col items-center py-10 text-stone-400 border-2 border-dashed border-stone-100 rounded-2xl"><Shield size={40} className="mb-4 opacity-20"/><p className="text-sm font-medium">No pending requests</p></div>) : (<div className="bg-stone-50 p-6 rounded-2xl border border-red-100 flex flex-col gap-4 animate-slide-up"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-stone-500 shadow-sm"><User size={24}/></div><div><p className="text-lg font-bold text-stone-800">Visitor</p><p className="text-xs text-red-500 font-bold animate-pulse uppercase tracking-wider">Action Required</p></div></div><div className="flex gap-3 mt-2"><button onClick={onDeny} className="flex-1 h-12 rounded-xl bg-white text-red-500 border border-red-100 font-bold text-sm hover:bg-red-50">Deny</button><button onClick={onApprove} className="flex-1 h-12 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-black shadow-lg">Approve</button></div></div>)}</div></div>)}
const CreateStudio = ({ onClose, title, setTitle, audio, setAudio, pages, setPages, cover, setCover, backCover, setBackCover, onUploadPages, onUploadCover, onUploadBackCover, onPublish, isSaving, statusMsg }) => {return (<div className="fixed inset-0 z-50 bg-[#FAF9F6] text-stone-800 font-sans animate-slide-up flex flex-col h-[100dvh]"><div className="h-16 md:h-20 shrink-0 border-b border-stone-200 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md z-20"><div className="flex items-center gap-3 md:gap-4"><button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors"><X size={20} md:size={24}/></button><h1 className="text-lg md:text-xl font-serif italic text-stone-800">Studio</h1></div><button onClick={onPublish} disabled={isSaving} className="text-white bg-stone-900 hover:bg-black font-medium rounded-lg text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 text-center flex items-center gap-2 transition-all shadow-lg">{isSaving ? <Loader2 className="animate-spin" size={16}/> : <><Save size={16} className="hidden md:block"/> Publish</>}</button></div><div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative"><div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-stone-200 bg-white/50 flex flex-col z-10 shrink-0 backdrop-blur-sm h-1/3 md:h-auto"><div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide"><h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 md:mb-6 flex items-center gap-2 sticky top-0 py-2 z-10"><Edit3 size={14}/> Details</h2><div className="space-y-4 md:space-y-6 pb-10"><div><label className="block mb-2 text-xs md:text-sm font-bold text-stone-500">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white border border-stone-200 text-stone-900 text-xs md:text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2.5" placeholder="Untitled Album" /></div><div className="grid grid-cols-2 gap-3 md:gap-4">{[{label: "Front", img: cover, func: onUploadCover}, {label: "Back", img: backCover, func: onUploadBackCover}].map((item, idx) => (<div key={idx} className="bg-white p-2 md:p-3 rounded-xl border border-stone-200"><label className="block mb-2 text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-wider">{item.label}</label><div className="relative aspect-[3/4] bg-stone-50 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden group hover:border-stone-400 transition-colors">{item.img ? <img src={item.img} className="w-full h-full object-cover" /> : <div className="text-center text-stone-300"><ImageIcon size={16} md:size={20} className="mx-auto mb-1" /></div>}<label className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={item.func} /><Plus className="text-stone-900 bg-white rounded-full p-2 shadow-lg" size={20}/></label></div></div>))}</div><div><label className="block mb-2 text-xs md:text-sm font-bold text-stone-500">Audio URL</label><input type="url" value={audio} onChange={(e) => setAudio(e.target.value)} className="bg-white border border-stone-200 text-stone-900 text-xs md:text-sm rounded-lg focus:ring-stone-500 focus:border-stone-500 block w-full p-2.5" placeholder="https://..." /></div>{statusMsg && <div className="p-3 mb-4 text-xs text-stone-600 rounded-lg bg-stone-100 border border-stone-200 flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> {statusMsg}</div>}</div></div></div><div className="flex-1 bg-[#FAF9F6] relative flex flex-col min-h-0"><div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32"><div className="flex justify-between items-center mb-4 md:mb-6 sticky top-0 z-10 bg-[#FAF9F6]/90 backdrop-blur-md py-4 border-b border-stone-200"><h3 className="text-lg md:text-xl font-bold text-stone-800">Pages</h3><label className="cursor-pointer bg-stone-900 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"><Plus size={14} md:size={16}/> Add Photos<input type="file" multiple accept="image/*" className="hidden" onChange={onUploadPages} /></label></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{pages.map((page, idx) => (<div key={idx} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-stone-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"><img src={page.url} className="w-full h-full object-cover" alt={`Page ${idx}`} /><button onClick={() => setPages(p => p.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1.5 md:p-2 bg-white rounded-full text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-lg"><Trash2 size={12} md:size={14}/></button></div>))}</div></div></div></div></div>);};

// --- SECTION 7: MAIN APP ---
export default function LumierePro() {
  const [books, setBooks] = useState([]); 
  const [view, setView] = useState('landing'); 
  const [userRole, setUserRole] = useState('visitor'); 
  const [currentBook, setCurrentBook] = useState(null);
  const [securityEnabled, setSecurityEnabled] = useState(true); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [visitorWaiting, setVisitorWaiting] = useState(false);

  useEffect(() => {
      const booksRef = ref(db, 'books');
      const unsubscribe = onValue(booksRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
              const loadedBooks = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse(); 
              setBooks(loadedBooks);
          } else { setBooks([]); }
      });
      return () => unsubscribe();
  }, []);

  useEffect(() => {
      const securityRef = ref(db, 'access/settings/securityEnabled');
      const unsubSecurity = onValue(securityRef, (snapshot) => {
          const val = snapshot.val();
          setSecurityEnabled(val !== false);
      });
      let unsubStatus;
      if (userRole === 'editor') {
          const statusRef = ref(db, 'access/status');
          unsubStatus = onValue(statusRef, (snapshot) => {
              const val = snapshot.val();
              setVisitorWaiting(val === "pending");
              if (val === "pending") setIsRequestsOpen(true);
          });
      }
      return () => { unsubSecurity(); if (unsubStatus) unsubStatus(); }
  }, [userRole]);

  const handleToggleSecurity = () => { const newValue = !securityEnabled; set(ref(db, 'access/settings/securityEnabled'), newValue); };
  const handleApprove = () => { set(ref(db, 'access/status'), "approved"); setVisitorWaiting(false); setIsRequestsOpen(false); };
  const handleDeny = () => { set(ref(db, 'access/status'), "denied"); setVisitorWaiting(false); setIsRequestsOpen(false); };
  const handleDeleteBook = (bookId) => { if (window.confirm("Delete this book permanently?")) { remove(ref(db, `books/${bookId}`)); } }

  const [studioTitle, setStudioTitle] = useState(''); const [studioAudio, setStudioAudio] = useState(''); const [studioCover, setStudioCover] = useState(null); const [studioBackCover, setStudioBackCover] = useState(null); const [studioPages, setStudioPages] = useState([]); const [isSaving, setIsSaving] = useState(false); const [statusMsg, setStatusMsg] = useState("");
  const handleLogin = (role) => { setUserRole(role); setView('dashboard'); };
  const handleOpenStudio = (book) => { if (book) { setStudioTitle(book.title); setStudioCover(book.coverUrl); setStudioBackCover(book.backCoverUrl); setStudioPages(book.pages || []); } else { setStudioTitle(''); setStudioCover(null); setStudioBackCover(null); setStudioPages([]); } setCurrentBook(book); setView('studio'); };
  const handleUploadCover = async (event) => { const file = event.target.files[0]; if(!file) return; const url = await compressImage(file); setStudioCover(url); };
  const handleUploadBackCover = async (event) => { const file = event.target.files[0]; if(!file) return; const url = await compressImage(file); setStudioBackCover(url); };
  const handleUploadPages = async (event) => { const files = Array.from(event.target.files); setStatusMsg('Compressing...'); setIsSaving(true); const uploaded = []; for (const file of files) { const url = await compressImage(file); uploaded.push({ url, caption: file.name }); } setStudioPages(p => [...p, ...uploaded]); setStatusMsg('Ready'); setIsSaving(false); };
  
  const handlePublish = () => {
      if (!studioTitle || !studioCover) { setStatusMsg("Please add Title & Cover!"); setIsSaving(false); return; } 
      setIsSaving(true); 
      const newBook = { title: studioTitle, coverUrl: studioCover, backCoverUrl: studioBackCover, audioUrl: studioAudio, pageCount: studioPages.length, pages: studioPages, createdAt: Date.now() };
      const booksRef = ref(db, 'books');
      push(booksRef, newBook).then(() => { setIsSaving(false); setView('dashboard'); }).catch((err) => { setStatusMsg("Error saving!"); setIsSaving(false); });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans overflow-hidden h-screen w-screen selection:bg-orange-200">
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} securityEnabled={securityEnabled} toggleSecurity={handleToggleSecurity} />
        <RequestsModal isOpen={isRequestsOpen} onClose={() => setIsRequestsOpen(false)} visitorRequest={visitorWaiting} onApprove={handleApprove} onDeny={handleDeny} />
        {view === 'landing' && <LandingScreen onEnter={handleLogin} securityEnabled={securityEnabled} />}
        {view === 'reader' && currentBook && ( <FlipView pages={currentBook.pages || []} coverUrl={currentBook.coverUrl} backCoverUrl={currentBook.backCoverUrl} title={currentBook.title} onClose={() => setView('dashboard')} /> )}
        {view === 'studio' && ( <CreateStudio onClose={() => setView('dashboard')} title={studioTitle} setTitle={setStudioTitle} audio={studioAudio} setAudio={setStudioAudio} cover={studioCover} setCover={setStudioCover} backCover={studioBackCover} setBackCover={setStudioBackCover} pages={studioPages} setPages={setStudioPages} onUploadCover={handleUploadCover} onUploadBackCover={handleUploadBackCover} onUploadPages={handleUploadPages} onPublish={handlePublish} isSaving={isSaving} statusMsg={statusMsg} /> )}
        {view === 'dashboard' && (<div className="flex flex-col md:flex-row h-screen w-full overflow-hidden"><Sidebar userRole={userRole} onLogout={() => setView('landing')} onStudio={() => handleOpenStudio(null)} openSettings={() => setIsSettingsOpen(true)} openRequests={() => setIsRequestsOpen(true)} visitorRequest={visitorWaiting} /><div className="flex-1 h-full overflow-hidden bg-[#FAF9F6] relative flex flex-col min-h-0"><div className="flex-1 relative min-h-0"><div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none z-0"/>{userRole === 'visitor' || userRole === 'editor' ? ( <Carousel3D books={books} onSelect={(book) => { setCurrentBook(book); setView('reader'); }} onDelete={handleDeleteBook} userRole={userRole} /> ) : null}</div></div></div>)}
    </div>
  );
}