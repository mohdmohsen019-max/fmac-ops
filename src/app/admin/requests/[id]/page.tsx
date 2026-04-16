"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Shield, UploadCloud, MessageSquare, Tag, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function RequestDetailsAdmin() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) router.push('/admin');
    });
    return () => unsubAuth();
  }, [router]);

  useEffect(() => {
    if (!user || !id) return;
    const unsubDoc = onSnapshot(doc(db, "requests", id), (docObj) => {
      if (docObj.exists()) {
        setRequest({ id: docObj.id, ...docObj.data() });
        setLoading(false);
      } else {
        router.push('/admin');
      }
    });
    return () => unsubDoc();
  }, [id, user, router]);

  const updateStatus = async (status: string) => {
    const ref = doc(db, "requests", id);
    await updateDoc(ref, { status });
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
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

  if (!mounted || loading || !user || !request) return <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-beige)]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--color-terracotta)]"></div></div>;

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
                    <div className="inline-block px-3 py-1 bg-[var(--color-beige)] text-[var(--color-terracotta)] text-[10px] font-black rounded-md uppercase tracking-widest mt-2">{request.userInfo?.branch} Branch</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Service specifics
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    {renderServiceDetail('Against/Type', s.complaintType)}
                    {renderServiceDetail('Target Name', s.againstName)}
                    {renderServiceDetail('Bus #', s.busNumber || s.maintenanceBusNo)}
                    {renderServiceDetail('Maint. Target', s.maintenanceTarget)}
                    {renderServiceDetail('Maint. Type', s.maintenanceCategories)}
                    {renderServiceDetail('Department', s.suggestionDept)}
                    {renderServiceDetail('Inquiry Cat.', s.inquiryCategories)}
                    {renderServiceDetail('Call Subject', request.content?.description ? null : s.callSubject)}
                    {renderServiceDetail('Priority', request.priority || s.suggestionPriority)}
                    {renderServiceDetail('Official', s.meetingPersonId)}
                    {renderServiceDetail('Admin Name', s.meetingAdminName)}
                    {renderServiceDetail('Urgency', s.maintenanceUrgency)}
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
               <select 
                value={request.status} 
                onChange={e => updateStatus(e.target.value)}
                className="w-full px-6 py-5 bg-[var(--color-beige)]/20 border-2 border-transparent focus:border-[var(--color-terracotta)] rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-[var(--color-espresso)] outline-none cursor-pointer transition-all"
              >
                <option value="new">🔴 UNRESOLVED</option>
                <option value="in_progress">🟡 PROCESSING</option>
                <option value="closed">🟢 COMPLETED</option>
              </select>
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
