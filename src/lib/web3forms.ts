export async function notifyStaff(ticketNumber: string, formData: any) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.warn("Web3Forms access key missing. Notifications disabled.");
    return;
  }

  try {
    const subject = `[FMAC] New ${formData.type} – ${formData.name}`;
    
    const messageLines = [
      `--- TICKET INFO ---`,
      `Ticket Number: ${ticketNumber}`,
      `Date: ${new Date().toLocaleString()}`,
      `Type: ${formData.type}`,
      ``,
      `--- CONTACT DETAILS ---`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email || 'N/A'}`,
      `Branch: ${formData.branch}`,
      `Player Name: ${formData.playerName || 'N/A'}`,
      `Sport: ${formData.sport || 'N/A'}`,
      ``,
      `--- SERVICE SPECIFICS ---`,
      formData.type === 'inquiry' && formData.inquiryCategories?.length ? `Inquiry categories: ${formData.inquiryCategories.join(', ')}` : null,
      
      formData.type === 'suggestion' && formData.suggestionDept ? `Department: ${formData.suggestionDept}` : null,
      formData.type === 'suggestion' && formData.suggestionPriority ? `Priority: ${formData.suggestionPriority}` : null,
      
      formData.type === 'complaint' && formData.complaintType ? `Complaint against: ${formData.complaintType}` : null,
      formData.type === 'complaint' && formData.againstName ? `Target name: ${formData.againstName}` : null,
      formData.type === 'complaint' && formData.busNumber ? `Bus number: ${formData.busNumber}` : null,
      
      formData.type === 'meeting' && formData.meetingPersonId ? `Meeting with: ${formData.meetingPersonId}` : null,
      formData.type === 'meeting' && formData.meetingAdminName ? `Admin name: ${formData.meetingAdminName}` : null,
      
      formData.type === 'call' && formData.callerRole ? `Caller role: ${formData.callerRole}` : null,
      formData.type === 'call' && formData.callSubject ? `Call subject: ${formData.callSubject}` : null,
      
      formData.type === 'maintenance' && formData.maintenanceTarget ? `Maintenance target: ${formData.maintenanceTarget}` : null,
      formData.type === 'maintenance' && formData.maintenanceCategories?.length ? `Maintenance types: ${formData.maintenanceCategories.join(', ')}` : null,
      formData.type === 'maintenance' && formData.maintenanceBusNo ? `Maintenance bus #: ${formData.maintenanceBusNo}` : null,
      formData.type === 'maintenance' && formData.maintenanceUrgency ? `Maintenance urgency: ${formData.maintenanceUrgency}` : null,
      ``,
      `--- DESCRIPTION ---`,
      formData.description,
      ``,
      formData.type === 'suggestion' && formData.suggestionExpected ? `--- EXPECTED OUTCOME ---\n${formData.suggestionExpected}` : null,
    ].filter(v => v !== null && v !== false);

    const message = messageLines.join("\n");

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        message,
        from_name: "FMAC Operations Console",
      }),
    });
  } catch (err) {
    console.error("Web3Forms error:", err);
  }
}
