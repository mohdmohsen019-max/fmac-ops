import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { BarChart3, ClipboardList, MessageSquareWarning, Phone, Wrench, CalendarDays, Star, Users, Search, Trash2, Download } from "lucide-react";

const STORAGE_KEY = "fmac_ops_system_v1";

const initialDb = {
  inquiries: [],
  complaints: [],
  calls: [],
  maintenance: [],
  meetings: [],
  ratings: [],
};

const inquiryOptions = [
  "New registration",
  "Medical check",
  "Fitness test",
  "Training schedule",
  "Tournaments & participation",
  "Uniforms & gear",
  "Clinic & treatment",
  "Drivers & buses",
  "Other",
];

const complaintTypes = ["Bus", "Coach", "Administrator", "Teammate", "Driver", "Other"];
const maintenanceAreas = ["Air conditioning", "Electrical", "Restrooms", "Painting", "Other"];
const meetingPersons = [
  "Club Director",
  "Deputy Director",
  "Head of Operations",
  "Head Coach",
  "Head of Finance",
  "Head of HR",
  "Administrator",
  "Physio",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function nowIso() {
  return new Date().toISOString();
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialDb;
  } catch {
    return initialDb;
  }
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="rounded-2xl bg-slate-100 p-2"><Icon className="h-5 w-5" /></div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-500">{subtitle}</p>}
    </div>
  );
}

function RecordRow({ title, subtitle, meta, badge, onDelete, details }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{title}</p>
              {badge && <Badge variant="secondary">{badge}</Badge>}
            </div>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            {meta && <p className="text-xs text-slate-400">{meta}</p>}
            {details && <p className="text-sm text-slate-700 pt-2 whitespace-pre-wrap">{details}</p>}
          </div>
          <Button variant="outline" size="sm" onClick={onDelete} className="rounded-xl">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FMACOperationsSystem() {
  const [db, setDb] = useState(initialDb);
  const [query, setQuery] = useState("");

  const [personal, setPersonal] = useState({
    fullName: "",
    phone: "",
    email: "",
    playerName: "",
    sport: "",
  });

  const [inquiry, setInquiry] = useState({
    types: [],
    notes: "",
  });

  const [complaint, setComplaint] = useState({
    type: "Bus",
    details: "",
    resolvedByAdmin: false,
    escalated: false,
  });

  const [callLog, setCallLog] = useState({
    callerName: "",
    callerPhone: "",
    role: "Parent",
    sport: "",
    type: "Bus",
    handledBy: [],
    notes: "",
  });

  const [maintenance, setMaintenance] = useState({
    target: "building",
    buildingItems: [],
    busNumber: "",
    maintenanceType: "Periodic",
    details: "",
  });

  const [meeting, setMeeting] = useState({
    person: "Club Director",
    reason: "",
  });

  const [rating, setRating] = useState({
    value: 0,
    notes: "",
  });

  useEffect(() => {
    setDb(loadDb());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const totals = useMemo(() => ({
    inquiries: db.inquiries.length,
    complaints: db.complaints.length,
    calls: db.calls.length,
    maintenance: db.maintenance.length,
    meetings: db.meetings.length,
    ratings: db.ratings.length,
    avgRating: db.ratings.length
      ? (db.ratings.reduce((sum, x) => sum + Number(x.value || 0), 0) / db.ratings.length).toFixed(1)
      : "0.0",
  }), [db]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return db;
    const match = (obj) => JSON.stringify(obj).toLowerCase().includes(q);
    return {
      inquiries: db.inquiries.filter(match),
      complaints: db.complaints.filter(match),
      calls: db.calls.filter(match),
      maintenance: db.maintenance.filter(match),
      meetings: db.meetings.filter(match),
      ratings: db.ratings.filter(match),
    };
  }, [db, query]);

  function appendRecord(key, record) {
    setDb((prev) => ({ ...prev, [key]: [{ id: uid(), createdAt: nowIso(), ...record }, ...prev[key]] }));
  }

  function removeRecord(key, id) {
    setDb((prev) => ({ ...prev, [key]: prev[key].filter((x) => x.id !== id) }));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fmac-operations-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleListValue(arr, value) {
    return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-3xl bg-white shadow-sm border p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">FMAC</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-1">Operations Management System</h1>
              <p className="text-slate-500 mt-2 max-w-3xl">
                A working MVP for inquiries, complaints, meetings, call logs, maintenance requests, and ratings.
                Data is currently stored in the browser so the system functions immediately.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={exportJson} className="rounded-2xl">
                <Download className="h-4 w-4 mr-2" /> Export Data
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-2xl">Production Notes</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle>How to make this production-ready</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-slate-600 space-y-3">
                    <p>1. Replace localStorage with a real database such as Supabase, Firebase, or PostgreSQL.</p>
                    <p>2. Add authentication for Operations staff and role-based access.</p>
                    <p>3. Send email/WhatsApp notifications on new submissions.</p>
                    <p>4. Add audit logs, attachments, Arabic/English localization, and PDF/Excel reporting.</p>
                    <p>5. Deploy the frontend to Vercel/Netlify and backend to Supabase/Firebase/Render.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
          <StatCard title="Inquiries" value={totals.inquiries} icon={ClipboardList} />
          <StatCard title="Complaints" value={totals.complaints} icon={MessageSquareWarning} />
          <StatCard title="Calls" value={totals.calls} icon={Phone} />
          <StatCard title="Maintenance" value={totals.maintenance} icon={Wrench} />
          <StatCard title="Meetings" value={totals.meetings} icon={CalendarDays} />
          <StatCard title="Ratings" value={totals.ratings} icon={Star} />
          <StatCard title="Avg. Rating" value={totals.avgRating} icon={BarChart3} />
        </div>

        <Tabs defaultValue="forms" className="space-y-6">
          <TabsList className="rounded-2xl bg-white border p-1 h-auto flex flex-wrap">
            <TabsTrigger value="forms" className="rounded-xl">Submit Forms</TabsTrigger>
            <TabsTrigger value="dashboard" className="rounded-xl">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-8">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
                  <div><Label>Full name</Label><Input value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} /></div>
                  <div><Label>Email</Label><Input value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} /></div>
                  <div><Label>Player name</Label><Input value={personal.playerName} onChange={(e) => setPersonal({ ...personal, playerName: e.target.value })} /></div>
                  <div><Label>Sport</Label><Input value={personal.sport} onChange={(e) => setPersonal({ ...personal, sport: e.target.value })} /></div>
                </div>
              </CardContent>
            </Card>

            <div className="grid xl:grid-cols-2 gap-6">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle>Inquiries</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    {inquiryOptions.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 rounded-2xl border p-3 cursor-pointer">
                        <Checkbox checked={inquiry.types.includes(opt)} onCheckedChange={() => setInquiry({ ...inquiry, types: toggleListValue(inquiry.types, opt) })} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <Label>Additional details</Label>
                    <Textarea rows={4} value={inquiry.notes} onChange={(e) => setInquiry({ ...inquiry, notes: e.target.value })} />
                  </div>
                  <Button className="rounded-2xl" onClick={() => {
                    appendRecord("inquiries", { ...personal, ...inquiry, status: "New" });
                    setInquiry({ types: [], notes: "" });
                  }}>Submit Inquiry</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle>Complaints</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Complaint type</Label>
                    <Select value={complaint.type} onValueChange={(v) => setComplaint({ ...complaint, type: v })}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {complaintTypes.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Details</Label>
                    <Textarea rows={4} value={complaint.details} onChange={(e) => setComplaint({ ...complaint, details: e.target.value })} />
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2"><Checkbox checked={complaint.resolvedByAdmin} onCheckedChange={(v) => setComplaint({ ...complaint, resolvedByAdmin: !!v })} /><span className="text-sm">Resolved by admin</span></label>
                    <label className="flex items-center gap-2"><Checkbox checked={complaint.escalated} onCheckedChange={(v) => setComplaint({ ...complaint, escalated: !!v })} /><span className="text-sm">Escalated</span></label>
                  </div>
                  <Button className="rounded-2xl" onClick={() => {
                    appendRecord("complaints", { ...personal, ...complaint, status: complaint.escalated ? "Escalated" : "Open" });
                    setComplaint({ type: "Bus", details: "", resolvedByAdmin: false, escalated: false });
                  }}>Submit Complaint</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle>Phone Call Log</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label>Caller name</Label><Input value={callLog.callerName} onChange={(e) => setCallLog({ ...callLog, callerName: e.target.value })} /></div>
                    <div><Label>Caller phone</Label><Input value={callLog.callerPhone} onChange={(e) => setCallLog({ ...callLog, callerPhone: e.target.value })} /></div>
                    <div>
                      <Label>Role</Label>
                      <Select value={callLog.role} onValueChange={(v) => setCallLog({ ...callLog, role: v })}>
                        <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Player">Player</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Sport</Label><Input value={callLog.sport} onChange={(e) => setCallLog({ ...callLog, sport: e.target.value })} /></div>
                  </div>
                  <div>
                    <Label>Complaint type</Label>
                    <Select value={callLog.type} onValueChange={(v) => setCallLog({ ...callLog, type: v })}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {complaintTypes.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    {['Resolved by admin','Escalated to department head'].map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <Checkbox checked={callLog.handledBy.includes(item)} onCheckedChange={() => setCallLog({ ...callLog, handledBy: toggleListValue(callLog.handledBy, item) })} />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <Label>Call notes</Label>
                    <Textarea rows={4} value={callLog.notes} onChange={(e) => setCallLog({ ...callLog, notes: e.target.value })} />
                  </div>
                  <Button className="rounded-2xl" onClick={() => {
                    appendRecord("calls", { ...callLog });
                    setCallLog({ callerName: "", callerPhone: "", role: "Parent", sport: "", type: "Bus", handledBy: [], notes: "" });
                  }}>Save Call Log</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle>Maintenance</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Target</Label>
                    <Select value={maintenance.target} onValueChange={(v) => setMaintenance({ ...maintenance, target: v })}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building">Building</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {maintenance.target === "building" ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {maintenanceAreas.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 rounded-2xl border p-3 cursor-pointer">
                          <Checkbox checked={maintenance.buildingItems.includes(opt)} onCheckedChange={() => setMaintenance({ ...maintenance, buildingItems: toggleListValue(maintenance.buildingItems, opt) })} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Bus number</Label><Input value={maintenance.busNumber} onChange={(e) => setMaintenance({ ...maintenance, busNumber: e.target.value })} /></div>
                      <div>
                        <Label>Maintenance type</Label>
                        <Select value={maintenance.maintenanceType} onValueChange={(v) => setMaintenance({ ...maintenance, maintenanceType: v })}>
                          <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Periodic">Periodic</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Details</Label>
                    <Textarea rows={4} value={maintenance.details} onChange={(e) => setMaintenance({ ...maintenance, details: e.target.value })} />
                  </div>
                  <Button className="rounded-2xl" onClick={() => {
                    appendRecord("maintenance", { ...maintenance, status: "Submitted" });
                    setMaintenance({ target: "building", buildingItems: [], busNumber: "", maintenanceType: "Periodic", details: "" });
                  }}>Submit Maintenance Request</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle>Meeting Request</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Person to meet</Label>
                    <Select value={meeting.person} onValueChange={(v) => setMeeting({ ...meeting, person: v })}>
                      <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {meetingPersons.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reason</Label>
                    <Textarea rows={4} value={meeting.reason} onChange={(e) => setMeeting({ ...meeting, reason: e.target.value })} />
                  </div>
                  <Button className="rounded-2xl" onClick={() => {
                    appendRecord("meetings", { ...personal, ...meeting, status: "Pending" });
                    setMeeting({ person: "Club Director", reason: "" });
                  }}>Submit Meeting Request</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle>Experience Rating</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 flex-wrap">
                    {[1,2,3,4,5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating({ ...rating, value: n })}
                        className={`h-12 w-12 rounded-2xl border text-lg font-bold transition ${rating.value >= n ? 'bg-slate-900 text-white' : 'bg-white'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea rows={4} value={rating.notes} onChange={(e) => setRating({ ...rating, notes: e.target.value })} />
                  </div>
                  <Button className="rounded-2xl" onClick={() => {
                    appendRecord("ratings", { ...personal, ...rating });
                    setRating({ value: 0, notes: "" });
                  }}>Submit Rating</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold">Operations Dashboard</h3>
                  <p className="text-slate-500">Search across all saved submissions.</p>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, phone, sport, complaint, details..." className="pl-9 rounded-2xl" />
                </div>
              </CardContent>
            </Card>

            <div className="grid xl:grid-cols-2 gap-6">
              <div className="space-y-3">
                <SectionTitle icon={ClipboardList} title="Inquiries" subtitle={`${filtered.inquiries.length} record(s)`} />
                {filtered.inquiries.map((x) => (
                  <RecordRow key={x.id} title={x.fullName || 'Unnamed inquiry'} subtitle={(x.types || []).join(', ')} meta={`${x.phone || '-'} • ${new Date(x.createdAt).toLocaleString()}`} badge={x.status} details={x.notes} onDelete={() => removeRecord('inquiries', x.id)} />
                ))}
              </div>

              <div className="space-y-3">
                <SectionTitle icon={MessageSquareWarning} title="Complaints" subtitle={`${filtered.complaints.length} record(s)`} />
                {filtered.complaints.map((x) => (
                  <RecordRow key={x.id} title={x.fullName || 'Unnamed complaint'} subtitle={x.type} meta={`${x.phone || '-'} • ${new Date(x.createdAt).toLocaleString()}`} badge={x.status} details={x.details} onDelete={() => removeRecord('complaints', x.id)} />
                ))}
              </div>

              <div className="space-y-3">
                <SectionTitle icon={Phone} title="Phone Calls" subtitle={`${filtered.calls.length} record(s)`} />
                {filtered.calls.map((x) => (
                  <RecordRow key={x.id} title={x.callerName || 'Unnamed caller'} subtitle={`${x.type} • ${x.role}`} meta={`${x.callerPhone || '-'} • ${new Date(x.createdAt).toLocaleString()}`} badge={x.handledBy?.join(', ') || 'Logged'} details={x.notes} onDelete={() => removeRecord('calls', x.id)} />
                ))}
              </div>

              <div className="space-y-3">
                <SectionTitle icon={Wrench} title="Maintenance" subtitle={`${filtered.maintenance.length} record(s)`} />
                {filtered.maintenance.map((x) => (
                  <RecordRow key={x.id} title={x.target === 'bus' ? `Bus ${x.busNumber || '-'}` : 'Building request'} subtitle={x.target === 'bus' ? x.maintenanceType : (x.buildingItems || []).join(', ')} meta={`${new Date(x.createdAt).toLocaleString()}`} badge={x.status} details={x.details} onDelete={() => removeRecord('maintenance', x.id)} />
                ))}
              </div>

              <div className="space-y-3">
                <SectionTitle icon={CalendarDays} title="Meetings" subtitle={`${filtered.meetings.length} record(s)`} />
                {filtered.meetings.map((x) => (
                  <RecordRow key={x.id} title={x.fullName || 'Unnamed request'} subtitle={x.person} meta={`${x.phone || '-'} • ${new Date(x.createdAt).toLocaleString()}`} badge={x.status} details={x.reason} onDelete={() => removeRecord('meetings', x.id)} />
                ))}
              </div>

              <div className="space-y-3">
                <SectionTitle icon={Star} title="Ratings" subtitle={`${filtered.ratings.length} record(s)`} />
                {filtered.ratings.map((x) => (
                  <RecordRow key={x.id} title={x.fullName || 'Anonymous'} subtitle={`Rating ${x.value || 0}/5`} meta={`${new Date(x.createdAt).toLocaleString()}`} badge="Feedback" details={x.notes} onDelete={() => removeRecord('ratings', x.id)} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold">What this already does</h3>
              <p className="text-slate-500 mt-1">Working forms, saved records, searchable dashboard, deletion, and JSON export.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" /> Designed as an FMAC Operations MVP
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
