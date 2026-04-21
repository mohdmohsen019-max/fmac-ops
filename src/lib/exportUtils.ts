import * as XLSX from "xlsx";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function formatDate(val: any): string {
  if (!val) return "N/A";
  if (val?.toDate) return new Date(val.toDate()).toLocaleDateString("en-GB");
  return String(val);
}

export type TabType = "all" | "inquiry" | "complaint" | "suggestion" | "meeting" | "call" | "maintenance";

/** Map a single request to a flat plain-object row for the active tab. */
function mapRow(req: any, tab: TabType): Record<string, string> {
  const s = req.serviceDetails || {};
  const u = req.userInfo || {};
  const c = req.content || {};
  const logs = req.admin?.internalNotes || [];

  const base: Record<string, string> = {
    "Ticket ID": req.ticketNumber ?? req.id ?? "",
    Status:      req.status ?? "",
    Date:        formatDate(req.createdAt),
    Type:        req.type ?? "",
    Submitter:   u.name ?? "",
    Email:       u.email ?? "N/A",
    Phone:       u.phone ?? "N/A",
    Branch:      u.branch ?? "N/A",
    Sport:       u.sport ?? "N/A",
    Player:      u.playerName ?? "N/A",
    Description: c.description ?? "",
  };

  // Format internal logs into a single readable string
  const logsSummary = logs.map((l: any) => 
    `[${l.timestamp ? new Date(l.timestamp).toLocaleDateString() : 'N/A'}] ${l.author || 'System'}: ${l.text}`
  ).join(" | ");

  const details: Record<string, string> = {};

  switch (tab) {
    case "inquiry":
      details["Categories"] = (s.inquiryCategories ?? []).join(", ");
      break;
    case "complaint":
      details["Against Type"] = s.complaintType ?? "";
      details["Target Name"] = s.againstName ?? "";
      details["Bus Number"] = s.busNumber ?? "";
      break;
    case "suggestion":
      details["Department"] = s.suggestionDept ?? "";
      details["Priority"] = s.suggestionPriority ?? "";
      details["Expected Outcome"] = s.suggestionExpected ?? "";
      break;
    case "meeting":
      details["Official Role"] = s.meetingPersonId ?? "";
      details["Target Admin"] = s.meetingAdminName ?? "";
      break;
    case "call":
      details["Caller Role"] = s.callerRole ?? "";
      details["Subject"] = s.callSubject ?? "";
      break;
    case "maintenance":
      details["Target"] = s.maintenanceTarget ?? "";
      details["Equipment/ID"] = s.maintenanceBusNo ?? (s.maintenanceCategories ?? []).join(", ");
      details["Urgency"] = s.maintenanceUrgency ?? "";
      break;
  }

  return { ...base, ...details, "Internal Logs": logsSummary };
}

// ─── Excel export ──────────────────────────────────────────────────────────────

export function exportToExcel(requests: any[], tab: TabType, label: string) {
  const rows = requests.map((r) => mapRow(r, tab));
  const ws = XLSX.utils.json_to_sheet(rows);

  const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) + 2,
  }));
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, label);
  XLSX.writeFile(wb, `FMAC_Requests_${label}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ─── Creative Executive PDF Export ───────────────────────────────────────────

export async function exportToPDF(requests: any[], tab: TabType, label: string) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const allRows = requests.map((r) => mapRow(r, tab));
  if (allRows.length === 0) return;

  const pdfHeaders = ["Ticket ID", "Status", "Date", "Type", "Submitter", "Branch"];
  const rows = allRows.map(row => {
    const filtered: Record<string, string> = {};
    pdfHeaders.forEach(h => filtered[h] = row[h] || "");
    return filtered;
  });

  const stats = {
    total: rows.length,
    new:   requests.filter(r => r.status === 'new' || r.status === 'in_progress').length,
    done:  requests.filter(r => r.status === 'closed').length
  };

  const brandRed    = "#D2122E";
  const brandBlack  = "#111111";
  const softBeige   = "#fdf8f3";
  const masterRef   = `FMAC-R-2026-${Math.floor(Math.random()*1000)}`;

  // Configuration for pagination - REDUCED for breathing room
  const ROWS_PAGE_1 = 5;
  const ROWS_NORMAL = 10;
  
  const chunks: any[][] = [];
  
  // First chunk
  if (rows.length > 0) {
    chunks.push(rows.slice(0, ROWS_PAGE_1));
  }
  
  // Subsequent chunks
  for (let i = ROWS_PAGE_1; i < rows.length; i += ROWS_NORMAL) {
    chunks.push(rows.slice(i, i + ROWS_NORMAL));
  }

  const doc = new jsPDF({ 
    orientation: "landscape", 
    unit: "pt", 
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let pageIdx = 0; pageIdx < chunks.length; pageIdx++) {
    const isFirstPage = pageIdx === 0;
    const currentRows = chunks[pageIdx];
    
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "absolute",
      left: "-9999px",
      top: "0",
      width: "1122px", 
      height: "794px",
      background: "white",
      fontFamily: "'A Jannat LT', 'Montserrat', sans-serif",
      display: "flex", 
    });

    container.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap');
        @import url('https://db.onlinewebfonts.com/c/52673295988d8b835377f0bd66945037?family=A+Jannat+LT');

        * { box-sizing: border-box; }
        .brand-sidebar { width: 12px; background: ${brandRed}; align-self: stretch; }
        .document-content { flex: 1; padding: 40px 70px 100px 70px; position: relative; display: flex; flex-direction: column; overflow: hidden; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: ${isFirstPage ? '25px' : '20px'}; }
        .club-brand { display: flex; align-items: center; gap: 20px; }
        .logo-box { width: 70px; height: 70px; background: #fff; border-radius: 18px; display: flex; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); }
        .logo-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        .title-stack h1 { font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 900; color: ${brandBlack}; margin: 0; line-height: 1; text-transform: uppercase; }
        .title-stack p { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; color: ${brandRed}; margin-top: 6px; letter-spacing: 4px; text-transform: uppercase; }

        .document-meta { text-align: right; }
        .ref-id { font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 800; color: #ccc; text-transform: uppercase; letter-spacing: 1.5px; }
        .date-box { font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; color: ${brandBlack}; margin-top: 3px; }
        .filter-badge { display: inline-block; background: ${brandBlack}; color: white; padding: 5px 12px; border-radius: 6px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }

        .overview-section { margin-bottom: 40px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 25px 0; display: grid; grid-template-columns: repeat(3, 1fr); }
        .stat-item { border-right: 1px solid #eee; padding: 0 30px; }
        .stat-item:last-child { border-right: none; }
        .stat-label { font-size: 9px; font-weight: 900; color: #bbb; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; display: block; }
        .stat-value { font-size: 36px; font-weight: 900; color: ${brandBlack}; display: flex; align-items: baseline; gap: 6px; line-height: 1; }
        .stat-suffix { font-size: 12px; font-weight: 800; color: #ddd; }
        
        .table-container { flex: 1; }
        .table-title { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900; color: ${brandBlack}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .table-title:before { content: ''; width: 20px; height: 3px; background: ${brandRed}; display: block; }

        table { width: 100%; border-collapse: collapse; }
        th { padding: 10px 18px; text-align: left; background: white; border-bottom: 2px solid ${brandBlack}; font-size: 9px; font-weight: 900; color: ${brandBlack}; text-transform: uppercase; letter-spacing: 1.2px; }
        td { padding: 10px 18px; font-size: 11px; font-weight: 600; color: #444; border-bottom: 1px solid #f8f8f8; line-height: 1.3; vertical-align: middle; }
        tr:nth-child(even) { background: ${softBeige}; }
        
        .status-pill { display: inline-block; font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: ${brandBlack}; border-left: 2.5px solid #ddd; padding-left: 8px; }
        .status-new { border-color: ${brandRed}; }
        .status-closed { border-color: #27ae60; }
        
        .arabic-content { direction: rtl; text-align: right; font-family: 'A Jannat LT', sans-serif; font-size: 12px; }

        .footer { 
          position: absolute; 
          bottom: 35px; 
          left: 70px; 
          right: 70px; 
          padding-top: 15px; 
          border-top: 1px solid #eee; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .footer-info { font-size: 9px; font-weight: 700; color: #ccc; text-transform: uppercase; letter-spacing: 1px; min-width: 150px; }
        .confidential { color: ${brandRed}; font-weight: 900; text-align: center; flex: 1; }
        .page-num { text-align: right; min-width: 150px; }
      </style>

      <div class="brand-sidebar"></div>
      <div class="document-content">
        <div class="header">
          <div class="club-brand">
            <div class="logo-box"><img src="/fmac-logo.png" /></div>
            <div class="title-stack">
              <h1>Fujairah Martial Arts Club</h1>
              <p>Operations Summary Report</p>
            </div>
          </div>
          <div class="document-meta">
            <div class="ref-id">Ref: ${masterRef}</div>
            <div class="date-box">${new Date().toLocaleDateString("en-GB", {day: 'numeric', month: 'long', year: 'numeric'})}</div>
            <div class="filter-badge">${label} Log</div>
          </div>
        </div>

        ${isFirstPage ? `
          <div class="overview-section">
            <div class="stat-item">
              <span class="stat-label">Total Volume</span>
              <div class="stat-value">${stats.total}<span class="stat-suffix">Entries</span></div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pending Review</span>
              <div class="stat-value" style="color: ${brandRed}">${stats.new}<span class="stat-suffix">Active</span></div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Resolved Stats</span>
              <div class="stat-value" style="color: #27ae60">${stats.done}<span class="stat-suffix">Closed</span></div>
            </div>
          </div>
        ` : ''}

        <div class="table-container">
          <div class="table-title">Detailed Operations Log ${!isFirstPage ? '(Continued)' : ''}</div>
          <table>
            <thead>
              <tr>${pdfHeaders.map(h => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${currentRows.map((row) => `
                <tr>
                  ${pdfHeaders.map((h, i) => {
                    const val = row[h] ?? "";
                    if (h === "Status") {
                      const statusClass = val.toLowerCase() === 'closed' ? 'status-closed' : 'status-new';
                      return `<td><span class="status-pill ${statusClass}">${val}</span></td>`;
                    }
                    const isArabic = i >= 3 && !["Branch", "Date", "Ticket ID"].includes(h);
                    return `<td class="${isArabic ? 'arabic-content' : ''}">${val}</td>`;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <div class="footer-info">© 2026 FMAC Unified Console • Systems Report</div>
          <div class="footer-info confidential">Highly Confidential • Authorized Personnel Only</div>
          <div class="footer-info page-num">Page ${String(pageIdx + 1).padStart(2, '0')} of ${String(chunks.length).padStart(2, '0')}</div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Sync assets
    const fontsReady = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();
    const images = Array.from(container.querySelectorAll('img'));
    const imagesLoaded = Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    await Promise.all([fontsReady, imagesLoaded]);
    await new Promise(r => setTimeout(r, 600));

    const canvas = await html2canvas(container, {
      scale: 2.0,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 1122,
    });

    document.body.removeChild(container);

    if (pageIdx > 0) doc.addPage();
    
    doc.addImage(
      canvas.toDataURL("image/png", 0.95), 
      "PNG", 
      0, 0, pageWidth, pageHeight, 
      undefined, 'FAST'
    );
  }

  doc.save(`FMAC_Executive_Report_${label}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
