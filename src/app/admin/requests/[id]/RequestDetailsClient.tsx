"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Shield, UploadCloud, MessageSquare, Tag, User as UserIcon, ChevronDown, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function RequestDetailsClient() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);
  const [newNote, setNewNote] = useState("");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser && mounted) router.push('/admin');
    });
    return () => unsubAuth();
  }, [router, mounted]);

  useEffect(() => {
    if (!user || !id || !mounted || !db) return;
    const unsubDoc = onSnapshot(doc(db, "requests", id), (docObj) => {
      if (docObj.exists()) {
        setRequest({ id: docObj.id, ...docObj.data() });
        setLoading(false);
      } else {
        router.push('/admin');
      }
    });
    return () => unsubDoc();
  }, [id, user, router, mounted]);

  const updateStatus = async (status: string) => {
    if (!db) return;
    const ref = doc(db, "requests", id);
    await updateDoc(ref, { status });
  };

  const addNote = async () => {
    if (!newNote.trim() || !db) return;
    const ref = doc(db, "requests", id);
    await updateDoc(ref, {
      "admin.internalNotes": arrayUnion({
        text: newNote,
        author: user?.email,
        timestamp: new Date().toISOString()
      })
    });
    setNewNote("");
  };

  const renderServiceDetail = (label: string, value: any) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-[var(--color-espresso)]">
          {Array.isArray(value) ? value.join(', ') : value}
        </span>
      </div>
    );
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
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-black text-[var(--color-espresso)] mb-2">Configuration Missing</h1>
          <p className="text-gray-500 text-sm mb-6">Database keys are missing in Vercel. Please check your Project Settings.</p>
          <Link href="/admin" className="inline-block px-6 py-3 bg-[var(--color-espresso)] text-white font-bold rounded-xl text-sm">Return to Admin</Link>
        </div>
      </div>
    );
  }

  if (!user || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-beige)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--color-terracotta)]"></div>
      </div>
    );
  }

  const s = request.serviceDetails || {};

  return (
    <div className="min-h-screen bg-[var(--color-beige)]" dir="ltr">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-[var(--color-beige)]/50 rounded-lg text-gray-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="font-black text-lg text-[var(--color-espresso)] tracking-tighter">Ticket {request.ticketNumber}</div>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-[var(--color-beige)] rounded-full text-[10px] font-black text-[var(--color-terracotta)] uppercase tracking-widest">
               ID: {request.id.slice(0, 8)}...
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Info */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-orange-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-beige)]/20 rounded-full -mr-24 -mt-24 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-1.5 bg-[var(--color-espresso)] text-[var(--color-beige)] text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {request.type}
                </div>
                <div className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest ${
                  request.status === 'new' ? 'bg-red-50 text-red-700' :
                  request.status === 'in_progress' ? 'bg-orange-50 text-orange-700' :
                  'bg-green-50 text-green-700'
                }`}>
                  {request.status.replace('_', ' ')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Requester
                  </h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-[var(--color-espresso)] tracking-tight">{request.userInfo?.name}</div>
                    <div className="text-sm font-bold text-gray-500">{request.userInfo?.phone} &bull; {request.userInfo?.email || 'No Email'}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-[var(--color-beige)] text-[var(--color-terracotta)] text-[10px] font-black rounded-md uppercase tracking-widest">{request.userInfo?.branch} Branch</span>
                      {request.userInfo?.sport && (
                        <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-md uppercase tracking-widest">{request.userInfo?.sport}</span>
                      )}
                      {request.userInfo?.playerName && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-md uppercase tracking-widest">Player: {request.userInfo?.playerName}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Service specifics
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    {request.type === 'inquiry' && renderServiceDetail('Inquiry Categories', s.inquiryCategories)}
                    
                    {request.type === 'complaint' && (
                      <>
                        {renderServiceDetail('Against/Type', s.complaintType)}
                        {renderServiceDetail('Target Name', s.againstName)}
                        {renderServiceDetail('Bus Number', s.busNumber)}
                      </>
                    )}

                    {request.type === 'suggestion' && (
                      <>
                        {renderServiceDetail('Department', s.suggestionDept)}
                        {renderServiceDetail('Priority', s.suggestionPriority)}
                      </>
                    )}

                    {request.type === 'meeting' && (
                      <>
                        {renderServiceDetail('Official', s.meetingPersonId)}
                        {renderServiceDetail('Admin Name', s.meetingAdminName)}
                      </>
                    )}

                    {request.type === 'call' && (
                      <>
                        {renderServiceDetail('Caller Role', s.callerRole)}
                        {renderServiceDetail('Subject', s.callSubject)}
                      </>
                    )}

                    {request.type === 'maintenance' && (
                      <>
                        {renderServiceDetail('Maint. Target', s.maintenanceTarget)}
                        {renderServiceDetail('Maint. Type', s.maintenanceCategories)}
                        {renderServiceDetail('Bus #', s.maintenanceBusNo)}
                        {renderServiceDetail('Urgency', s.maintenanceUrgency)}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Application Content</h3>
                <div className="bg-[var(--color-beige)]/30 p-8 rounded-[1.5rem] border border-gray-100 text-sm font-semibold leading-relaxed text-[var(--color-espresso)] whitespace-pre-wrap">
                  {request.content?.description}
                </div>
                {s.suggestionExpected && (
                  <div className="mt-6 p-4 border-l-4 border-[var(--color-olive)] bg-green-50/30">
                    <span className="text-[10px] font-black text-[var(--color-olive)] uppercase tracking-widest block mb-1">Expected Outcome</span>
                    <p className="text-sm font-bold text-gray-600 italic">"{s.suggestionExpected}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {request.content?.attachments && request.content.attachments.length > 0 && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-orange-900/5">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Supporting Materials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {request.content.attachments.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-5 bg-[var(--color-beige)]/20 rounded-[1.5rem] border border-transparent hover:border-[var(--color-terracotta)] hover:bg-white transition-all shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[var(--color-terracotta)]" />
                    </div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Document #{i+1}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-orange-900/5">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Operations Team Logs
            </h3>
            <div className="space-y-4 mb-8">
              {(!request.admin?.internalNotes || request.admin.internalNotes.length === 0) ? (
                <div className="text-xs font-bold text-gray-300 py-10 text-center border-4 border-dashed border-[var(--color-beige)] rounded-[2rem] uppercase tracking-widest">No internal activity logged</div>
              ) : (
                request.admin.internalNotes.map((note: any, i: number) => (
                  <div key={i} className="bg-[var(--color-beige)]/20 p-6 rounded-[1.5rem] border border-gray-100 relative">
                    <p className="text-sm font-bold text-[var(--color-espresso)] mb-4">{note.text}</p>
                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                      <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center font-black text-[var(--color-terracotta)] shadow-sm">
                        {note.author?.[0]?.toUpperCase() || 'A'}
                      </div>
                      {note.author || 'System'} &bull; {note.timestamp ? new Date(note.timestamp).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-4">
              <input 
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Log internal update..."
                className="flex-1 px-6 py-4 bg-[var(--color-beige)]/30 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-[var(--color-terracotta)] outline-none text-sm font-bold placeholder:text-gray-300 transition-all"
              />
              <button onClick={addNote} className="px-10 py-4 bg-[var(--color-espresso)] text-[var(--color-beige)] font-black rounded-[1.5rem] hover:bg-black shadow-lg shadow-orange-900/10 transition-all uppercase text-xs tracking-widest">Post Log</button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-orange-900/5">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Execution Status</h3>
            <div className="space-y-4">
            <div className="relative">
               <button
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={`w-full px-6 py-5 bg-white border-2 border-gray-100 rounded-[1.5rem] flex items-center justify-between transition-all hover:border-[var(--color-terracotta)] shadow-sm ${isStatusMenuOpen ? 'ring-2 ring-[var(--color-terracotta)]/20' : ''}`}
               >
                 <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      request.status === 'new' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' :
                      request.status === 'in_progress' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                      'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                    }`} />
                    <span className="text-[10px] font-black text-[var(--color-espresso)] uppercase tracking-widest">
                      {request.status.replace('_', ' ')}
                    </span>
                 </div>
                 <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
               </button>

               <AnimatePresence>
                 {isStatusMenuOpen && (
                   <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-gray-100 shadow-2xl p-2 z-50 overflow-hidden"
                   >
                     {[
                       { id: 'new', label: 'Unresolved', color: 'text-red-600', bg: 'hover:bg-red-50', icon: AlertCircle },
                       { id: 'in_progress', label: 'Processing', color: 'text-orange-600', bg: 'hover:bg-orange-50', icon: RefreshCw },
                       { id: 'closed', label: 'Completed', color: 'text-green-600', bg: 'hover:bg-green-50', icon: CheckCircle2 },
                     ].map(option => (
                       <button
                        key={option.id}
                        onClick={() => {
                          updateStatus(option.id);
                          setIsStatusMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${option.bg} group ${request.status === option.id ? 'bg-gray-50' : ''}`}
                       >
                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${option.color} bg-white shadow-sm border border-gray-100`}>
                           <option.icon className="w-4 h-4" />
                         </div>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${option.color}`}>
                           {option.label}
                         </span>
                         {request.status === option.id && (
                           <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                         )}
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-orange-900/5">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Service Level Agreement</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-beige)] rounded-2xl flex items-center justify-center shadow-sm">
                  <Clock className="w-6 h-6 text-[var(--color-terracotta)]" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Resolution Deadline</div>
                  <div className={`text-sm font-black tracking-tight ${request.slaDeadline?.toDate && new Date() > new Date(request.slaDeadline.toDate()) ? 'text-red-600' : 'text-[var(--color-espresso)]'}`}>
                    {request.slaDeadline?.toDate ? new Date(request.slaDeadline.toDate()).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
