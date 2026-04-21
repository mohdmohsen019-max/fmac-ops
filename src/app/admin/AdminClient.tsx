"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { LogOut, ArrowRight, Inbox, HelpCircle, AlertTriangle, Lightbulb, Users, Phone, Wrench, Trash2, Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import { RequestType, useRequestStore } from "@/store/requestStore";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";

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
  const [showSingleDeleteConfirm, setShowSingleDeleteConfirm] = useState(false);
  const [reqToDelete, setReqToDelete] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { language } = useRequestStore();

  const activeTabLabel = activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  const handleExport = async (format: 'excel' | 'pdf', exportData?: any[], customLabel?: string) => {
    const data = exportData || (activeTab === 'all' ? requests : requests.filter(r => r.type === activeTab));
    const label = customLabel || activeTabLabel;
    
    if (data.length === 0 || isExporting) return;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      if (format === 'excel') {
        exportToExcel(data, activeTab, label);
      } else {
        await exportToPDF(data, activeTab, label);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

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

  const deleteSingleRequest = async () => {
    if (!db || !user || !reqToDelete || user.email !== 'fmacoperations@gmail.com') return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, "requests", reqToDelete.id));
      setReqToDelete(null);
    } catch (err) {
      console.error("Deletion error:", err);
      alert("Error deleting request.");
    }
    setLoading(false);
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
            <h1 className="text-2xl font-black text-[var(--color-espresso)] text-center tracking-tighter uppercase">Unified Console</h1>
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
      <tr className="bg-[var(--color-espresso)]/5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
        {allCols.map(c => <th key={c} className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100">{c}</th>)}
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
        <td className="px-3 md:px-6 py-3 md:py-5 font-black text-[var(--color-espresso)] text-sm tracking-tight">{req.ticketNumber}</td>
        {midData.map((d, i) => <td key={i} className="px-3 md:px-6 py-3 md:py-5 text-center">{d}</td>)}
        <td className="px-3 md:px-6 py-3 md:py-5">
          <span className={`inline-block px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider ${
            req.status === 'new' ? 'bg-red-50 text-red-700 border border-red-100' :
            req.status === 'in_progress' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
            'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {req.status}
          </span>
        </td>
        <td className="px-3 md:px-6 py-3 md:py-5 text-gray-400 text-[10px] md:text-xs font-bold text-center">
          {req.createdAt?.toDate ? new Date(req.createdAt.toDate()).toLocaleDateString() : 'N/A'}
        </td>
        <td className="px-3 md:px-6 py-3 md:py-5 text-center">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Link href={`/admin/requests/${req.id}`} className="text-[var(--color-terracotta)] hover:text-[var(--color-espresso)] transition-colors inline-flex items-center gap-1.5 font-black text-[9px] md:text-[10px] uppercase tracking-widest">
              {language === 'ar' ? 'تفاصيل' : 'Details'} <ArrowRight className="w-3 h-3" />
            </Link>
            
            {user?.email === 'fmacoperations@gmail.com' && (
              <button 
                onClick={() => {
                  setReqToDelete(req);
                  setShowSingleDeleteConfirm(true);
                }}
                className="p-1.5 md:p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
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
             <span className="text-[9px] font-bold text-[var(--color-terracotta)] uppercase tracking-tight">Unified Console</span>
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

      <ConfirmationModal 
        isOpen={showSingleDeleteConfirm}
        onClose={() => {
          setShowSingleDeleteConfirm(false);
          setReqToDelete(null);
        }}
        onConfirm={deleteSingleRequest}
        isDanger={true}
        title={language === 'ar' ? 'حذف الطلب' : 'Delete Request'}
        message={language === 'ar'
          ? `هل أنت متأكد من رغبتك في حذف الطلب ${reqToDelete?.ticketNumber}؟ لا يمكن التراجع عن هذا الإجراء.`
          : `Are you sure you want to delete request ${reqToDelete?.ticketNumber}? This action cannot be undone.`}
        confirmText={language === 'ar' ? 'حذف' : 'Delete'}
        cancelText={language === 'ar' ? 'إلغاء' : 'Cancel'}
      />

      <main className="lg:pl-64 flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <header className="mb-6 flex items-center justify-between">
            <div className="text-start font-display">
              <h1 className="text-xl md:text-2xl font-black text-[var(--color-espresso)] tracking-tighter">Fujairah Martial Arts Club</h1>
              <p className="text-[var(--color-terracotta)] text-[10px] md:text-sm font-bold uppercase tracking-widest mt-0.5">Unified Console</p>
            </div>
            
            <div className="flex gap-2 md:gap-3 items-center">
              <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 md:gap-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[9px] md:text-xs font-black text-[var(--color-espresso)] uppercase tracking-wider">Live Sync</span>
              </div>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(v => !v)}
                  disabled={isExporting || filteredRequests.length === 0}
                  className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-[var(--color-espresso)] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-[var(--color-beige)] rounded-xl border border-transparent shadow-sm transition-all text-[9px] md:text-xs font-black uppercase tracking-wider"
                >
                  {isExporting ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <Download className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  )}
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-[2rem] border border-gray-100 shadow-2xl shadow-orange-900/20 z-50 overflow-hidden divide-y divide-gray-50 animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* Section 1: Active View */}
                      <div className="p-5">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta)]"></div>
                          Active Workspace (${activeTabLabel})
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExport('excel')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-2xl hover:bg-green-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider shadow-sm"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" /> XLSX
                          </button>
                          <button
                            onClick={() => handleExport('pdf')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-700 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" /> PDF
                          </button>
                        </div>
                      </div>

                      {/* Section 2: Categories & Full Export */}
                      <div className="p-5">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Targeted Reports</p>
                        <div className="space-y-1">
                          {tabs.map(tab => (
                            <div key={tab.id} className="flex items-center justify-between p-2 hover:bg-[var(--color-beige)]/30 rounded-xl transition-colors group">
                              <div className="flex items-center gap-3">
                                <tab.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--color-espresso)]" />
                                <span className={`text-[11px] font-bold ${tab.id === 'all' ? 'text-[var(--color-espresso)]' : 'text-gray-500'} group-hover:text-[var(--color-espresso)]`}>
                                  {tab.id === 'all' ? (language === 'ar' ? 'جميع السجلات' : 'Full Database') : tab.label}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleExport('excel', tab.id === 'all' ? requests : requests.filter(r => r.type === tab.id), tab.label)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                  title={`Export ${tab.label} as Excel`}
                                >
                                  <FileSpreadsheet className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleExport('pdf', tab.id === 'all' ? requests : requests.filter(r => r.type === tab.id), tab.label)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                  title={`Export ${tab.label} as PDF`}
                                >
                                  <FileText className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="lg:hidden w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile Category Switcher */}
          <nav className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 mb-8 pb-2 -mx-2 px-2 scroll-smooth snap-x">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const count = tab.id === 'all' ? requests.length : statsByType[tab.id as Exclude<RequestType, null>];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-none snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all border ${
                    isActive 
                      ? 'bg-[var(--color-espresso)] text-[var(--color-beige)] border-[var(--color-espresso)] shadow-lg shadow-orange-900/10' 
                      : 'bg-white text-gray-400 border-gray-100 hover:text-[var(--color-espresso)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{tab.label}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-3 md:p-8 border border-white shadow-xl shadow-orange-900/5 text-center md:text-left">
              <div className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-3">Total</div>
              <div className="text-xl md:text-5xl font-black text-[var(--color-espresso)]">{filteredRequests.length}</div>
            </div>
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-3 md:p-8 border border-white shadow-xl shadow-orange-900/5 text-center md:text-left">
              <div className="text-[8px] md:text-[10px] font-black text-[var(--color-terracotta)] uppercase tracking-widest mb-1 md:mb-3">New</div>
              <div className="text-xl md:text-5xl font-black text-[var(--color-terracotta)]">{filteredRequests.filter(r => r.status === 'new').length}</div>
            </div>
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-3 md:p-8 border border-white shadow-xl shadow-orange-900/5 text-center md:text-left">
              <div className="text-[8px] md:text-[10px] font-black text-[var(--color-olive)] uppercase tracking-widest mb-1 md:mb-3">Done</div>
              <div className="text-xl md:text-5xl font-black text-[var(--color-olive)]">{filteredRequests.filter(r => r.status === 'closed').length}</div>
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

          {user?.email === 'fmacoperations@gmail.com' && requests.length > 0 && (
            <div className="mt-12 flex lg:hidden flex-col items-center">
              <div className="text-[10px] font-black text-red-800/30 uppercase mb-4 tracking-widest">Master Admin Tools</div>
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-red-100"
              >
                <Trash2 className="w-4 h-4" /> Clear All Data
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
