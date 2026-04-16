"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { LogOut, ArrowRight, Clock, Inbox, HelpCircle, AlertTriangle, Lightbulb, Users, Phone, Wrench, Trash2 } from "lucide-react";
import Link from "next/link";
import { RequestType, useRequestStore } from "@/store/requestStore";
import { ConfirmationModal } from "@/components/ConfirmationModal";

type TabType = "all" | Exclude<RequestType, null>;

export default function AdminClient() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { language } = useRequestStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !mounted || !db) return;
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(docObj => ({ id: docObj.id, ...docObj.data() }));
      setRequests(data);
    });
    return () => unsubscribe();
  }, [user, mounted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
  };

  const clearAllRequests = async () => {
    if (!db || !user || user.email !== 'fmacoperations@gmail.com') return;
    
    setLoading(true);
    try {
      for (const req of requests) {
        await deleteDoc(doc(db, "requests", req.id));
      }
    } catch (err) {
      console.error("Cleanup error:", err);
      alert("Error clearing requests. Check console.");
    }
    setLoading(false);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-beige)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--color-terracotta)]"></div>
      </div>
    );
  }

  if (!auth || !db) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)] px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-red-100 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-black text-[var(--color-espresso)] mb-2">Configuration Missing</h1>
          <p className="text-gray-500 text-sm mb-6">Database keys are missing in Vercel. Please check your Project Settings.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-[var(--color-espresso)] text-white font-bold rounded-xl text-sm">Return Home</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)] px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-white">
          <div className="mb-10 font-display">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-gray-100 mx-auto mb-6 flex items-center justify-center p-3 animate-in zoom-in-50 duration-500">
              <img src="/fmac-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black text-[var(--color-espresso)] text-center tracking-tighter uppercase">Admin Console</h1>
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest text-center mt-1">Fujairah Martial Arts Club</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
              <input 
                required
                type="email"
                placeholder="admin@fmac.gov"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[var(--color-terracotta)] focus:border-transparent outline-none text-left font-semibold bg-gray-50"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input 
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[var(--color-terracotta)] focus:border-transparent outline-none text-left font-semibold bg-gray-50"
                dir="ltr"
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button className="w-full py-4 bg-[var(--color-espresso)] hover:bg-black text-[var(--color-beige)] font-black rounded-2xl mt-4 transition-all shadow-xl shadow-orange-900/10 uppercase tracking-widest">
              LOG IN
            </button>
            <div className="text-center mt-6">
              <Link href="/" className="text-sm font-bold text-gray-400 hover:text-[var(--color-terracotta)] transition-colors">Return to Public Portal</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const statsByType = {
    inquiry: requests.filter(r => r.type === 'inquiry').length,
    complaint: requests.filter(r => r.type === 'complaint').length,
    suggestion: requests.filter(r => r.type === 'suggestion').length,
    meeting: requests.filter(r => r.type === 'meeting').length,
    call: requests.filter(r => r.type === 'call').length,
    maintenance: requests.filter(r => r.type === 'maintenance').length,
  };

  const filteredRequests = activeTab === 'all' ? requests : requests.filter(r => r.type === activeTab);

  const tabs: {id: TabType, label: string, icon: any}[] = [
    { id: 'all', label: 'All', icon: Inbox },
    { id: 'inquiry', label: 'Inquiries', icon: HelpCircle },
    { id: 'complaint', label: 'Complaints', icon: AlertTriangle },
    { id: 'suggestion', label: 'Suggestions', icon: Lightbulb },
    { id: 'meeting', label: 'Meetings', icon: Users },
    { id: 'call', label: 'Calls', icon: Phone },
    { id: 'maintenance', label: 'Maint.', icon: Wrench },
  ];

  const renderTableHeader = () => {
    const baseCols = ["Ticket ID", "Status", "Date", "Action"];
    let midCols: string[] = [];

    switch(activeTab) {
      case 'all': midCols = ["Type", "Submitter", "Branch"]; break;
      case 'inquiry': midCols = ["Submitter", "Categories", "Branch"]; break;
      case 'complaint': midCols = ["Against (Type)", "Target Name", "Submitter"]; break;
      case 'suggestion': midCols = ["Department", "Priority", "Submitter"]; break;
      case 'meeting': midCols = ["Official", "Admin Name", "Submitter"]; break;
      case 'call': midCols = ["Role", "Subject", "Submitter"]; break;
      case 'maintenance': midCols = ["Target", "Type/ID", "Branch"]; break;
    }

    const allCols = [baseCols[0], ...midCols, ...baseCols.slice(1)];

    return (
      <tr className="bg-[var(--color-espresso)]/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {allCols.map(c => <th key={c} className="px-6 py-4 border-b border-gray-100">{c}</th>)}
      </tr>
    );
  };

  const renderRow = (req: any) => {
    const s = req.serviceDetails || {};
    const u = req.userInfo || {};
    
    let midData: React.ReactNode[] = [];

    switch(activeTab) {
      case 'all': midData = [
        <span key="1" className="capitalize font-bold text-[var(--color-espresso)]">{req.type}</span>,
        <span key="2" className="text-gray-600 font-medium">{u.name}</span>,
        <span key="3" className="text-gray-400 text-xs font-bold">{u.branch}</span>
      ]; break;
      case 'inquiry': midData = [
        <span key="1" className="text-gray-600 font-medium">{u.name}</span>,
        <span key="2" className="text-xs font-bold text-[var(--color-terracotta)]">{s.inquiryCategories?.join(', ')}</span>,
        <span key="3" className="text-gray-400 text-xs font-bold">{u.branch}</span>
      ]; break;
      case 'complaint': midData = [
        <span key="1" className="capitalize font-bold text-red-700 underline decoration-red-200 underline-offset-4">{s.complaintType}</span>,
        <span key="2" className="text-[var(--color-espresso)] font-bold">{s.againstName || s.busNumber || '-'}</span>,
        <span key="3" className="text-gray-400 text-xs">{u.name}</span>
      ]; break;
      case 'suggestion': midData = [
        <span key="1" className="capitalize font-bold text-[var(--color-olive)]">{s.suggestionDept}</span>,
        <span key="2" className={`text-xs font-black uppercase ${s.suggestionPriority === 'high' ? 'text-red-600' : 'text-gray-400'}`}>{s.suggestionPriority}</span>,
        <span key="3" className="text-gray-400 text-xs">{u.name}</span>
      ]; break;
      case 'meeting': midData = [
        <span key="1" className="capitalize font-bold text-[var(--color-terracotta)]">{s.meetingPersonId}</span>,
        <span key="2" className="text-[var(--color-espresso)] font-bold">{s.meetingAdminName || 'Any'}</span>,
        <span key="3" className="text-gray-400 text-xs">{u.name}</span>
      ]; break;
      case 'call': midData = [
        <span key="1" className="capitalize font-bold text-[var(--color-espresso)]">{s.callerRole}</span>,
        <span key="2" className="text-gray-600 font-medium truncate max-w-[150px]">{s.callSubject}</span>,
        <span key="3" className="text-gray-400 text-xs">{u.name}</span>
      ]; break;
      case 'maintenance': midData = [
        <span key="1" className="capitalize font-bold text-[var(--color-olive)]">{s.maintenanceTarget}</span>,
        <span key="2" className="text-[var(--color-espresso)] font-bold">{s.maintenanceBusNo || s.maintenanceCategories?.join(', ')}</span>,
        <span key="3" className="text-gray-400 text-xs font-bold">{u.branch}</span>
      ]; break;
    }

    return (
      <tr key={req.id} className="hover:bg-[var(--color-beige)]/30 border-b border-gray-100 last:border-none transition-colors">
        <td className="px-6 py-5 font-black text-[var(--color-espresso)] text-sm tracking-tight">{req.ticketNumber}</td>
        {midData.map((d, i) => <td key={i} className="px-6 py-5">{d}</td>)}
        <td className="px-6 py-5">
          <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            req.status === 'new' ? 'bg-red-50 text-red-700 border border-red-100' :
            req.status === 'in_progress' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
            'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {req.status}
          </span>
        </td>
        <td className="px-6 py-5 text-gray-400 text-xs font-bold">
          {req.createdAt?.toDate ? new Date(req.createdAt.toDate()).toLocaleDateString() : 'N/A'}
        </td>
        <td className="px-6 py-5">
          <Link href={`/admin/requests/${req.id}`} className="text-[var(--color-terracotta)] hover:text-[var(--color-espresso)] transition-colors inline-flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest">
            Details <ArrowRight className="w-3 h-3" />
          </Link>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-beige)] flex flex-col" dir="ltr">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 z-40">
        <div className="flex items-center gap-3 mb-10 px-2">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm border border-gray-100 overflow-hidden">
             <img src="/fmac-logo.png" alt="Logo" className="w-full h-full object-contain" />
           </div>
           <div className="flex flex-col font-display">
             <span className="text-[11px] font-black text-[var(--color-espresso)] uppercase leading-none tracking-tighter">Fujairah Martial Arts Club</span>
             <span className="text-[9px] font-bold text-[var(--color-terracotta)] uppercase tracking-tight">Operations Console</span>
           </div>
        </div>

        <nav className="flex-1 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'all' ? requests.length : statsByType[tab.id as Exclude<RequestType, null>];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--color-espresso)] text-[var(--color-beige)] shadow-xl shadow-orange-900/20' 
                    : 'text-gray-400 hover:text-[var(--color-espresso)] hover:bg-[var(--color-beige)]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-bold">{tab.label}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="px-4 mb-4">
            <div className="text-[10px] font-black text-gray-300 uppercase mb-1 tracking-widest">Admin</div>
            <div className="text-[11px] font-bold text-gray-400 truncate">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>

          {user?.email === 'fmacoperations@gmail.com' && (
            <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="text-[10px] font-black text-red-800 uppercase mb-2 tracking-widest">Master Controls</div>
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/10"
              >
                <Trash2 className="w-4 h-4" /> Clear All Requests
              </button>
            </div>
          )}
        </div>
      </aside>

      <ConfirmationModal 
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearAllRequests}
        isDanger={true}
        title={language === 'ar' ? 'تأكيد الحذف النهائي' : 'Confirm Master Clear'}
        message={language === 'ar' 
          ? 'هل أنت متأكد من رغبتك في حذف جميع الطلبات بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.' 
          : 'Are you absolutely sure you want to PERMANENTLY delete ALL requests? This action cannot be undone.'}
        confirmText={language === 'ar' ? 'نعم، احذف الكل' : 'Yes, Delete Everything'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
      />

      <main className="lg:pl-64 flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <header className="mb-10 flex items-center justify-between">
            <div className="text-start font-display">
              <h1 className="text-2xl font-black text-[var(--color-espresso)] tracking-tighter">Fujairah Martial Arts Club</h1>
              <p className="text-[var(--color-terracotta)] text-sm font-bold uppercase tracking-widest mt-1">Operations Console</p>
            </div>
            
            <div className="hidden sm:flex gap-3">
              <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-black text-[var(--color-espresso)] uppercase tracking-wider">Live Sync Active</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-[2rem] p-8 border border-white shadow-xl shadow-orange-900/5">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Total Volume</div>
              <div className="text-5xl font-black text-[var(--color-espresso)]">{filteredRequests.length}</div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 border border-white shadow-xl shadow-orange-900/5">
              <div className="text-[10px] font-black text-[var(--color-terracotta)] uppercase tracking-widest mb-3">Awaiting Action</div>
              <div className="text-5xl font-black text-[var(--color-terracotta)]">{filteredRequests.filter(r => r.status === 'new').length}</div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 border border-white shadow-xl shadow-orange-900/5">
              <div className="text-[10px] font-black text-[var(--color-olive)] uppercase tracking-widest mb-3">Completed</div>
              <div className="text-5xl font-black text-[var(--color-olive)]">{filteredRequests.filter(r => r.status === 'closed').length}</div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-white shadow-2xl shadow-orange-900/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>{renderTableHeader()}</thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-24 text-center">
                        <Inbox className="w-16 h-16 text-[var(--color-beige)] mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No entries found</p>
                      </td>
                    </tr>
                  )}
                  {filteredRequests.map(req => renderRow(req))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
