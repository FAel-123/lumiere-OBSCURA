import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { 
  RefreshCw, Leaf, ArrowRight, Globe, Mail, Lock, LayoutDashboard, History, Gift, 
  LogOut, Plus, Bell, Package, CheckCircle, XCircle, MapPin, Loader2, Search, 
  Megaphone, Trash2, PlusCircle, ArrowLeft, Zap, Smile, CircuitBoard,
  Fish, CloudRain, Wind, Trophy, ClipboardList, Users, ChevronDown,
  FileText, Smartphone, Coffee, Database, BarChart3, Settings, 
  Ticket, ShoppingBag, Shirt, Utensils
} from 'lucide-react';

// --- DATABASE BAHASA ---
const t = {
  en: {
    appName: "SisaSync", slogan: "Synchronize Waste. Sustain Life.",
    heroTitle: "SISASYNC", heroSubtitle: "NETWORK",
    heroDesc: "The integrated engineering solution for campus waste management. Sync your recycling data directly to the cloud.",
    getStarted: "Get Started", login: "Login", welcomeBack: "Welcome Back,",
    dashboard: "Main Hub", history: "History", rewards: "Redeem", logout: "Log Out",
    newRequest: "New Request", totalPoints: "Eco-Credits", recentActivity: "Recent Activity",
    status: "Status", wasteType: "Select Material", locationLabel: "Location",
    weightKg: "Weight (kg)", submit: "Submit", studentTab: "Student",
    adminTab: "Admin", pending: "Pending", approved: "Completed", rejected: "Rejected",
    newsFeed: "System Updates", manageReq: "Manage Requests", announcements: "Announcements",
    postNews: "Post Update", titlePlaceholder: "Subject...", contentPlaceholder: "Message...",
    postBtn: "Post", back: "Back", goHome: "RETURN TO HUB",
    notFoundDesc: "ERROR 404: PAGE NOT FOUND.",
    impactTitle: "My Eco-Impact", impactCO2: "CO2 Reduced", impactAnimals: "Life Saved",
    impactEnergy: "Energy Saved", ptsPerKg: "pts/kg",
    aboutTitle: "About SisaSync", aboutDesc: "SisaSync bridges the gap between environmental responsibility and smart engineering.",
    redeemTitle: "Rewards", redeemDesc: "Items unlock when you have enough points.",
    notEnough: "Insufficient Points", redeemSuccess: "Redeem Success!",
    confirmRedeem: "Redeem", selectItem: "Select Available Item"
  },
  ms: {
    appName: "SisaSync", slogan: "Menyegerakkan Sisa. Melestarikan Alam.",
    heroTitle: "SISASYNC", heroSubtitle: "JARINGAN",
    heroDesc: "Solusi kitar semula kampus. Segerakkan data kitar semula anda terus ke awan.",
    getStarted: "Mula Sekarang", login: "Log Masuk", welcomeBack: "Selamat Kembali,",
    dashboard: "Utama", history: "Sejarah", rewards: "Tebus", logout: "Keluar",
    newRequest: "Permintaan Baru", totalPoints: "Kredit Eco", recentActivity: "Aktiviti Terkini",
    status: "Status", wasteType: "Pilih Bahan", locationLabel: "Lokasi",
    weightKg: "Berat (kg)", submit: "Hantar", studentTab: "Pelajar",
    adminTab: "Admin", pending: "Menunggu", approved: "Selesai", rejected: "Ditolak",
    newsFeed: "Berita Sistem", manageReq: "Urus Permintaan", announcements: "Pengumuman",
    postNews: "Hantar Berita", titlePlaceholder: "Tajuk...", contentPlaceholder: "Mesej...",
    postBtn: "Hantar", back: "Kembali", goHome: "BALIK UTAMA",
    notFoundDesc: "RALAT 404: HALAMAN TIADA.",
    impactTitle: "Impak Eco", impactCO2: "Kurang CO2", impactAnimals: "Hidupan",
    impactEnergy: "Tenaga", ptsPerKg: "mata/kg",
    aboutTitle: "Tentang SisaSync", aboutDesc: "SisaSync merapatkan jurang antara tanggungjawab alam sekitar dan kejuruteraan pintar.",
    redeemTitle: "Ganjaran", redeemDesc: "Item dibuka bila mata mencukupi.",
    notEnough: "Mata Tak Cukup", redeemSuccess: "Berjaya Tebus!",
    confirmRedeem: "Tebus", selectItem: "Pilih Item Tersedia"
  }
};

const REWARDS_DATA = [
  { id: 'r1', name: "RM5 Cafe Voucher", cost: 500, icon: Utensils },
  { id: 'r2', name: "RM10 Cafe Voucher", cost: 900, icon: Ticket },
  { id: 'r3', name: "SisaSync T-Shirt", cost: 2500, icon: Shirt },
  { id: 'r4', name: "Metal Straw Set", cost: 1200, icon: Leaf },
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentUser, setCurrentUser] = useState(null);
  const txt = t[lang];
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ms' : 'en');

  return (
    <Router>
      <AppRoutes lang={lang} toggleLang={toggleLang} txt={txt} currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </Router>
  );
}

function AppRoutes({ lang, toggleLang, txt, currentUser, setCurrentUser }) {
  const [dbRequests, setDbRequests] = useState([
    { id: 101, student: 'Ahmad Nurez', type: 'Plastic', location: 'Block A', weight: '2.5kg', date: '2023-12-20', status: 'Pending', points: 50 },
    { id: 102, student: 'Sarah Lee', type: 'E-Waste', location: 'Library', weight: '1.2kg', date: '2023-12-19', status: 'Approved', points: 100 },
  ]);
  const [newsList, setNewsList] = useState([
    { id: 1, title: 'Server Maintenance', content: 'Physical collection trucks will arrive at 10 AM Saturday.', date: '2023-12-25' },
    { id: 2, title: 'Algorithm Update', content: 'Plastic recycling points multiplier increased to 1.5x.', date: '2023-12-24' },
  ]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage lang={lang} toggleLang={toggleLang} txt={txt} />} />
      <Route path="/login" element={<LoginPage txt={txt} setCurrentUser={setCurrentUser} />} />
      <Route path="/student-dashboard" element={<StudentDashboard txt={txt} currentUser={currentUser} setCurrentUser={setCurrentUser} dbRequests={dbRequests} setDbRequests={setDbRequests} newsList={newsList} />} />
      <Route path="/admin-dashboard" element={<AdminDashboard txt={txt} currentUser={currentUser} dbRequests={dbRequests} setDbRequests={setDbRequests} newsList={newsList} setNewsList={setNewsList} />} />
      <Route path="*" element={<NotFoundPage txt={txt} />} />
    </Routes>
  );
}

// 1. LANDING PAGE
function LandingPage({ lang, toggleLang, txt }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToAbout = () => { document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="font-sans bg-white text-slate-800">
       <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent'}`}>
         <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-white"><RefreshCw className="text-emerald-400 animate-spin-slow" size={28} /> {txt.appName}</div>
         <div className="flex gap-3">
            <button onClick={toggleLang} className="px-4 py-2 font-bold text-xs bg-white/10 border border-white/30 text-white rounded-full hover:bg-white hover:text-emerald-900 uppercase backdrop-blur-sm transition-all active:scale-95">{lang}</button>
            <button onClick={() => navigate('/login')} className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-400 shadow-lg transition-all active:scale-95 active:shadow-inner">{txt.login}</button>
         </div>
       </nav>
       <header className="relative h-screen flex flex-col items-center justify-center text-center px-6">
         <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Green Forest"/>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
         </div>
         <div className="relative z-10 max-w-5xl space-y-6 animate-fade-in-up mt-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/50 rounded-full text-emerald-300 font-bold text-xs uppercase tracking-widest shadow-lg backdrop-blur-md"><Zap size={14} fill="currentColor"/> {txt.slogan}</div>
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">{txt.heroTitle}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 tracking-normal">{txt.heroSubtitle}</span></h1>
           <p className="text-lg md:text-2xl text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">{txt.heroDesc}</p>
           <button onClick={() => navigate('/login')} className="group px-12 py-6 bg-white text-emerald-900 font-black rounded-full text-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all active:scale-95 active:bg-emerald-100 flex items-center gap-3 mx-auto">{txt.getStarted} <ArrowRight className="group-hover:translate-x-1 transition-transform"/></button>
         </div>
         <button onClick={scrollToAbout} className="absolute bottom-10 z-10 text-white animate-bounce opacity-70 hover:opacity-100 transition-opacity flex flex-col items-center gap-2"><span className="text-xs uppercase tracking-widest font-bold">Scroll Down</span><ChevronDown size={32} /></button>
       </header>
       <section id="about-section" className="bg-[#0f172a] py-24 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8"><h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Engineering <span className="text-emerald-400">Nature's</span><br/>Comeback.</h2><p className="text-slate-400 text-lg leading-relaxed">{txt.aboutDesc}</p><div className="grid grid-cols-2 gap-6 pt-4"><div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><Leaf className="text-emerald-400 mb-3" size={32} /><h4 className="font-bold text-white mb-1">Eco-Friendly</h4><p className="text-sm text-slate-400">Reducing carbon footprint.</p></div><div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><CircuitBoard className="text-blue-400 mb-3" size={32} /><h4 className="font-bold text-white mb-1">Smart Systems</h4><p className="text-sm text-slate-400">Automated tracking & rewards.</p></div></div></div>
                <div className="relative"><div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] opacity-30 blur-lg"></div><img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop" alt="About SisaSync" className="relative rounded-[2.5rem] shadow-2xl border border-slate-700 w-full object-cover h-[500px]"/></div>
             </div>
          </div>
       </section>
       <footer className="bg-[#020617] py-8 text-center text-slate-500 text-xs border-t border-slate-800"><p>© 2025 SisaSync Systems. <Link to="/test-404" className="hover:text-emerald-400 underline font-bold ml-2">System Diagnostics</Link></p></footer>
    </div>
  );
}

// 2. LOGIN PAGE
function LoginPage({ txt, setCurrentUser }) {
  const navigate = useNavigate();
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isLoginAdmin) {
        setCurrentUser({ name: 'Admin Staff', role: 'admin' });
        navigate('/admin-dashboard');
      } else {
        setCurrentUser({ name: 'Ahmad Nurez', role: 'student', points: 1500 });
        navigate('/student-dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex font-sans">
       <div className="hidden lg:flex flex-1 relative bg-emerald-900 overflow-hidden"><img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Recycle"/><div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"/><div className="absolute bottom-20 left-20 z-10 max-w-lg"><h1 className="text-5xl font-black text-white mb-4">Sync Your Waste.<br/>Save The Planet.</h1><p className="text-emerald-200 text-lg">Powered by SisaSync Technology.</p></div></div>
       <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white relative"><button onClick={() => navigate('/')} className="absolute top-8 left-8 text-slate-400 hover:text-slate-800 transition-colors flex gap-2 font-bold group"><ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform"/> {txt.back}</button><div className="w-full max-w-sm"><div className="mb-10"><div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><RefreshCw size={32}/></div><h2 className="text-4xl font-black text-slate-800 mb-2">{txt.login}</h2><p className="text-slate-500">Access your SisaSync account.</p></div><div className="bg-slate-100 p-1 rounded-xl flex mb-6"><button onClick={() => setIsLoginAdmin(false)} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all active:scale-95 ${!isLoginAdmin ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{txt.studentTab}</button><button onClick={() => setIsLoginAdmin(true)} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all active:scale-95 ${isLoginAdmin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{txt.adminTab}</button></div><form onSubmit={handleLogin} className="space-y-4"><div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">User ID</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all"/></div><div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Passcode</label><input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 transition-all"/></div><button disabled={isLoading} className={`w-full py-4 rounded-xl font-black text-white shadow-lg mt-4 transition-all active:scale-95 active:shadow-inner ${isLoginAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{isLoading ? <Loader2 className="animate-spin mx-auto"/> : txt.login}</button></form></div></div>
    </div>
  );
}

// 3. STUDENT DASHBOARD
function StudentDashboard({ txt, currentUser, setCurrentUser, dbRequests, setDbRequests, newsList }) {
  const navigate = useNavigate();
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['Plastic']);

  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600"/></div>;

  const points = currentUser.points || 0;
  const co2Saved = (points * 0.15).toFixed(1); 
  const marineSaved = Math.floor(points / 200); 
  const energySaved = (points * 0.5).toFixed(0); 
  const safeName = currentUser.name ? currentUser.name.split(' ')[0] : 'User';

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if(selectedTypes.length === 0) { alert("Please select at least one material."); return; }
    setIsLoading(true);
    const typeString = selectedTypes.join(', ');
    const newRequest = { id: Math.floor(Math.random() * 10000), student: currentUser.name, type: typeString, location: e.target.location.value, weight: e.target.weight.value + 'kg', date: new Date().toISOString().split('T')[0], status: 'Pending', points: 0 };
    setTimeout(() => { setDbRequests([newRequest, ...dbRequests]); setIsLoading(false); setShowRecycleModal(false); alert("SisaSync: Upload Complete"); }, 1000);
  };

  const toggleSelection = (id) => {
    if (selectedTypes.includes(id)) { setSelectedTypes(selectedTypes.filter(t => t !== id)); } 
    else { setSelectedTypes([...selectedTypes, id]); }
  };

  const wasteOptions = [
    { id: 'Plastic', label: 'Plastic', icon: Coffee, points: '10', color: 'text-blue-500 bg-blue-50' },
    { id: 'Paper', label: 'Paper', icon: FileText, points: '5', color: 'text-yellow-600 bg-yellow-50' },
    { id: 'Tin', label: 'Metal/Tin', icon: Database, points: '15', color: 'text-gray-600 bg-gray-50' },
    { id: 'E-Waste', label: 'Electronics', icon: Smartphone, points: '50', color: 'text-purple-600 bg-purple-50' },
  ];

  const RecycleModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-900/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white border-4 border-emerald-100 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative">
        <button onClick={() => setShowRecycleModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 bg-slate-50 p-1 rounded-full active:scale-90 transition-transform"><XCircle size={24} /></button>
        <div className="text-center mb-6"><div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><RefreshCw size={32}/></div><h2 className="text-2xl font-black text-emerald-950">{txt.newRequest}</h2></div>
        <form onSubmit={handleSubmitRequest} className="space-y-6">
          <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block text-center">{txt.wasteType}</label><div className="grid grid-cols-2 gap-3">{wasteOptions.map((option) => { const isSelected = selectedTypes.includes(option.id); return (<div key={option.id} onClick={() => toggleSelection(option.id)} className={`cursor-pointer rounded-2xl p-4 border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${isSelected ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}><div className={`p-3 rounded-full ${option.color} group-hover:scale-110 transition-transform`}><option.icon size={28} /></div><div className="text-center"><span className={`block font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>{option.label}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{option.points} {txt.ptsPerKg}</span></div>{isSelected && <div className="absolute top-2 right-2 text-emerald-500"><CheckCircle size={16} fill="currentColor" className="text-white"/></div>}</div>); })}</div></div>
          <div className="space-y-4"><div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{txt.locationLabel}</label><select name="location" className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"><option value="Block A">Block A (Engineering)</option><option value="Block B">Block B (Science)</option><option value="Library">Library</option><option value="Cafeteria">Cafeteria</option></select></div><div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block ml-2">{txt.weightKg}</label><input name="weight" type="number" step="0.1" placeholder="2.5" required className="w-full bg-white border-2 border-slate-100 rounded-2xl p-3 font-bold text-slate-700 outline-none focus:border-emerald-400"/></div></div>
          <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg mt-2 flex justify-center items-center gap-2 transition-all active:scale-95 active:shadow-inner">{isLoading ? <Loader2 className="animate-spin"/> : <>{txt.submit} <CheckCircle size={20}/></>}</button>
        </form>
      </div>
    </div>
  );

  const RedeemModal = () => {
    const [selectedId, setSelectedId] = useState(null);
    const confirmRedeem = () => {
      const selectedItem = REWARDS_DATA.find(r => r.id === selectedId);
      if (!selectedItem) return;
      if (!window.confirm(`Confirm redeem ${selectedItem.name}?`)) return;
      if (points >= selectedItem.cost) {
        setCurrentUser({ ...currentUser, points: points - selectedItem.cost });
        alert(`${txt.redeemSuccess} You got: ${selectedItem.name}`);
        setSelectedId(null);
      } else {
        alert(txt.notEnough);
      }
    };
    const activeItem = REWARDS_DATA.find(r => r.id === selectedId);

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-emerald-900/40 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white border-4 border-emerald-100 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col max-h-[85vh]">
          <button onClick={() => setShowRedeemModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 bg-slate-50 p-1 rounded-full active:scale-90 transition-transform z-20"><XCircle size={24} /></button>
          <div className="text-center mb-6 flex-shrink-0">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><Gift size={32}/></div>
            <h2 className="text-2xl font-black text-emerald-950">{txt.redeemTitle}</h2>
            <p className="text-slate-500 text-sm mt-1">{txt.redeemDesc}</p>
            <div className="mt-4 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full inline-block font-bold text-sm">Balance: {points} pts</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
            {REWARDS_DATA.map(item => {
              const canAfford = points >= item.cost;
              const isSelected = selectedId === item.id;
              return (
                <div key={item.id} onClick={() => { if (canAfford) setSelectedId(item.id); }} className={`border-2 rounded-2xl p-4 flex flex-col items-center text-center transition-all relative ${canAfford ? 'cursor-pointer active:scale-95 hover:border-emerald-300' : 'cursor-not-allowed opacity-40 grayscale bg-slate-50'} ${isSelected ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100'}`}>
                  <div className={`p-3 rounded-full mb-2 ${isSelected ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}><item.icon size={24}/></div>
                  <h4 className="font-bold text-sm text-slate-800 leading-tight">{item.name}</h4>
                  <p className={`font-black text-xs mt-1 ${canAfford ? 'text-emerald-600' : 'text-slate-400'}`}>{item.cost} pts</p>
                  {!canAfford && <div className="absolute top-2 right-2 text-slate-400"><Lock size={14}/></div>}
                  {isSelected && <div className="absolute top-2 right-2 text-white bg-emerald-500 rounded-full p-1 shadow-md"><CheckCircle size={16} fill="currentColor"/></div>}
                </div>
              );
            })}
          </div>
          <button onClick={confirmRedeem} disabled={!activeItem} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 relative z-30 ${!activeItem ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 active:shadow-inner'}`}>
            {activeItem ? `${txt.confirmRedeem} ${activeItem.name}` : txt.selectItem}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-800 font-sans">
      {showRecycleModal && <RecycleModal />}
      {showRedeemModal && <RedeemModal />}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-2 text-emerald-600 font-black text-xl cursor-pointer" onClick={() => navigate('/')}><RefreshCw size={24}/> {txt.appName}</div>
         <div className="flex gap-2">
           <button onClick={() => navigate('/')} className="text-slate-400 hover:text-red-500 p-2 active:scale-90 transition-transform"><LogOut size={20}/></button>
         </div>
      </nav>
      <main className="pt-24 px-6 md:px-10 max-w-6xl mx-auto pb-20">
        <header className="mb-10 flex justify-between items-end">
           <div><h1 className="text-4xl font-black text-slate-800 mb-1">{txt.welcomeBack} {safeName} 👋</h1><p className="text-slate-500 font-medium">{txt.slogan}</p></div>
           <button onClick={() => setShowRecycleModal(true)} className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg items-center gap-2 active:scale-95 active:shadow-inner transition-all"><Plus size={24}/> {txt.newRequest}</button>
        </header>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
           <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-3 lg:col-span-1">
              <RefreshCw className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-45 pointer-events-none"/>
              <p className="font-bold text-emerald-100 uppercase tracking-widest text-sm mb-2">{txt.totalPoints}</p>
              <h2 className="text-6xl font-black mb-6">{points} <span className="text-2xl font-medium">pts</span></h2>
              <button onClick={() => setShowRedeemModal(true)} className="relative z-10 w-full bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 active:shadow-inner"><Gift size={18}/> {txt.rewards}</button>
           </div>
           <div className="col-span-1 md:col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[2.5rem] p-6 border-4 border-emerald-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors"><div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><CloudRain size={24}/></div><h3 className="text-2xl font-black text-slate-800">{co2Saved} kg</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{txt.impactCO2}</p></div>
              <div className="bg-white rounded-[2.5rem] p-6 border-4 border-emerald-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors"><div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Fish size={24}/></div><h3 className="text-2xl font-black text-slate-800">{marineSaved}</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{txt.impactAnimals}</p></div>
              <div className="bg-white rounded-[2.5rem] p-6 border-4 border-emerald-50 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors"><div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Zap size={24}/></div><h3 className="text-2xl font-black text-slate-800">{energySaved} kWh</h3><p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{txt.impactEnergy}</p></div>
           </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><History className="text-emerald-500"/> {txt.recentActivity}</h3>
              <div className="space-y-4">
                {dbRequests.filter(r => r.student === currentUser.name).length === 0 ? (
                   <p className="text-slate-400 text-center py-10 border-2 border-dashed border-emerald-100 rounded-3xl">No activity yet. Start syncing!</p>
                ) : (
                  dbRequests.filter(r => r.student === currentUser.name).map((req) => (
                    <div key={req.id} className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-400'}`}>{req.status === 'Approved' ? <Smile size={28}/> : <Loader2 size={28} className="animate-spin"/>}</div>
                        <div><h4 className="font-bold text-lg text-slate-800">{req.type}</h4><p className="text-slate-400 text-sm font-medium flex items-center gap-1"><MapPin size={12}/> {req.location}</p></div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-500'}`}>{req.status === 'Approved' ? txt.approved : txt.pending}</span>
                    </div>
                  ))
                )}
              </div>
           </div>
           <div>
              <div className="bg-white rounded-[2.5rem] p-8 border-4 border-emerald-50 shadow-sm relative overflow-hidden h-full">
                <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold uppercase text-xs tracking-wider"><Megaphone size={16}/> {txt.newsFeed}</div>
                <div className="space-y-6">
                  {newsList.map(n => (
                    <div key={n.id} className="bg-blue-50 p-5 rounded-3xl border border-blue-100 relative group">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full"></div>
                      <h4 className="font-bold text-blue-900 text-sm leading-tight mb-2">{n.title}</h4>
                      <p className="text-xs text-blue-600 leading-relaxed">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </main>
      <button onClick={() => setShowRecycleModal(true)} className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform"><Plus size={32}/></button>
    </div>
  );
}

// 4. ADMIN DASHBOARD
function AdminDashboard({ txt, currentUser, dbRequests, setDbRequests, newsList, setNewsList }) {
  const navigate = useNavigate();
  const [adminSection, setAdminSection] = useState('requests');
  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);
  if (!currentUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600"/></div>;
  const handleAdminAction = (id, action) => setDbRequests(dbRequests.map(req => req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req));
  const handlePostNews = (e) => { e.preventDefault(); const newPost = { id: Date.now(), title: e.target.title.value, content: e.target.content.value, date: new Date().toISOString().split('T')[0] }; setNewsList([newPost, ...newsList]); e.target.reset(); };
  const handleDeleteNews = (id) => setNewsList(newsList.filter(n => n.id !== id));
  const bgPattern = `radial-gradient(#cbd5e1 1px, transparent 1px)`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex relative overflow-hidden" style={{ backgroundImage: bgPattern, backgroundSize: '20px 20px' }}>
      <aside className="hidden md:flex w-72 flex-col p-6 bg-[#0f172a] border-r border-slate-800 sticky top-0 h-screen z-20 shadow-2xl relative overflow-hidden">
        <CircuitBoard className="absolute -bottom-10 -right-10 text-slate-800 w-64 h-64 opacity-50 pointer-events-none" />
        <div className="flex items-center gap-3 text-emerald-400 font-black text-xl mb-10 tracking-tight z-10"><div className="p-2 bg-emerald-500/20 rounded-lg"><LayoutDashboard size={20}/></div>COMMAND CENTER</div>
        <nav className="space-y-2 flex-1 z-10">
          <button onClick={() => setAdminSection('requests')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all active:scale-95 ${adminSection === 'requests' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><ClipboardList size={20}/> {txt.manageReq}</button>
          <button onClick={() => setAdminSection('news')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all active:scale-95 ${adminSection === 'news' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Megaphone size={20}/> {txt.announcements}</button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-red-400 hover:bg-red-900/20 p-4 rounded-xl font-bold transition-all z-10 active:scale-95"><LogOut size={20}/> {txt.logout}</button>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6 mb-10">
           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24}/></div><div><h4 className="text-3xl font-black text-slate-800">1,240</h4><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p></div></div>
           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-full"><Package size={24}/></div><div><h4 className="text-3xl font-black text-slate-800">450kg</h4><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recycled Mass</p></div></div>
           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"><div className="p-3 bg-purple-100 text-purple-600 rounded-full"><BarChart3 size={24}/></div><div><h4 className="text-3xl font-black text-slate-800">98%</h4><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efficiency</p></div></div>
        </div>
        {adminSection === 'requests' && (
          <>
            <div className="flex justify-between items-end mb-6"><h1 className="text-4xl font-black text-slate-800 tracking-tight">{txt.manageReq}</h1><div className="bg-white border border-slate-200 p-2 rounded-full flex items-center gap-2 px-4 w-72 shadow-sm"><Search size={18} className="text-slate-400"/><input type="text" placeholder="Search ID..." className="bg-transparent outline-none text-sm w-full font-medium"/></div></div>
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold tracking-wider"><tr><th className="p-6">User / Student</th><th className="p-6">Waste Data</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {dbRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{req.student.charAt(0)}</div><div><span className="block font-bold text-slate-800">{req.student}</span><span className="text-xs text-slate-400">ID: #{req.id}</span></div></div></td>
                      <td className="p-6"><span className="block font-bold text-slate-700">{req.type}</span><span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1 inline-block mr-2">{req.location}</span><span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1 inline-block">{req.weight}</span></td>
                      <td className="p-6"><span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{req.status === 'Approved' ? txt.approved : req.status === 'Pending' ? txt.pending : txt.rejected}</span></td>
                      <td className="p-6 text-right space-x-2">{req.status === 'Pending' && (<><button onClick={() => handleAdminAction(req.id, 'reject')} className="p-2 bg-white border border-red-200 text-red-500 rounded-xl hover:bg-red-50 hover:shadow-md transition-all active:scale-95"><XCircle size={20}/></button><button onClick={() => handleAdminAction(req.id, 'approve')} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 hover:shadow-lg shadow-emerald-200 transition-all active:scale-95"><CheckCircle size={20}/></button></>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {adminSection === 'news' && (
          <div className="max-w-4xl">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-8">{txt.announcements}</h1>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Megaphone size={100} /></div>
              <h3 className="font-bold text-blue-600 mb-6 flex items-center gap-2 text-lg"><PlusCircle size={24}/> {txt.postNews}</h3>
              <form onSubmit={handlePostNews} className="space-y-6 relative z-10">
                <input name="title" required type="text" placeholder={txt.titlePlaceholder} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 font-bold text-lg outline-none focus:border-blue-400 transition-colors"/>
                <textarea name="content" required placeholder={txt.contentPlaceholder} rows="3" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 font-medium outline-none focus:border-blue-400 transition-colors"></textarea>
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all active:scale-95">{txt.postBtn}</button>
              </form>
            </div>
            <div className="space-y-4">
              {newsList.map(news => (
                <div key={news.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex justify-between items-start shadow-sm hover:shadow-md transition-all">
                  <div><h4 className="font-bold text-xl text-slate-800 mb-1">{news.title}</h4><p className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> {news.date}</p><p className="text-slate-600">{news.content}</p></div>
                  <button onClick={() => handleDeleteNews(news.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors active:scale-95"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// 5. NOT FOUND PAGE
function NotFoundPage({ txt }) {
  const navigate = useNavigate();
  const marqueeStyle = `
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .animate-marquee { display: flex; white-space: nowrap; animation: marquee 20s linear infinite; }
  `;
  return (
    <div className="min-h-screen bg-[#F0FDF4] text-emerald-900 font-mono flex flex-col relative overflow-hidden">
      <style>{marqueeStyle}</style>
      <div className="absolute top-0 left-0 w-full bg-emerald-600 text-white py-2 overflow-hidden z-10 border-b-4 border-emerald-800">
         <div className="animate-marquee font-black text-sm uppercase tracking-widest">
            {[...Array(20)].map((_, i) => <span key={i} className="mx-4">SisaSync SYSTEM FAILURE /// ERROR 404 /// PAGE NOT FOUND ///</span>)}
         </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative z-20">
         <h1 className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter text-emerald-200 select-none opacity-50 mix-blend-multiply">404</h1>
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-white/80 backdrop-blur-sm p-10 border-4 border-emerald-600 rounded-3xl shadow-[8px_8px_0px_0px_rgba(5,150,105,1)]">
              <p className="text-emerald-700 font-bold uppercase tracking-[0.5em] mb-4">SisaSync Error</p>
              <p className="text-emerald-950 text-xl md:text-3xl font-black max-w-lg leading-relaxed mb-8">{txt.notFoundDesc}</p>
              <button onClick={() => navigate('/')} className="pointer-events-auto px-10 py-4 bg-emerald-600 text-white font-black hover:bg-emerald-700 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest text-lg border-2 border-emerald-800 shadow-[4px_4px_0px_0px_rgba(6,95,70,1)] rounded-xl active:scale-95">{txt.goHome}</button>
            </div>
         </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t-4 border-emerald-200 py-4 overflow-hidden z-10 bg-white">
         <div className="animate-marquee font-black text-emerald-100 text-6xl uppercase">
            {[...Array(10)].map((_, i) => <span key={i} className="mx-8">NOT FOUND</span>)}
         </div>
      </div>
    </div>
  );
}