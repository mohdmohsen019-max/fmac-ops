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
      formData.inquiryCategories?.length ? `Inquiry categories: ${formData.inquiryCategories.join(', ')}` : null,
      formData.suggestionDept ? `Department: ${formData.suggestionDept}` : null,
      formData.suggestionPriority ? `Priority: ${formData.suggestionPriority}` : null,
      formData.complaintType ? `Complaint against: ${formData.complaintType}` : null,
      formData.againstName ? `Target name: ${formData.againstName}` : null,
      formData.busNumber ? `Bus number: ${formData.busNumber}` : null,
      formData.meetingPersonId ? `Meeting with: ${formData.meetingPersonId}` : null,
      formData.meetingAdminName ? `Admin name: ${formData.meetingAdminName}` : null,
      formData.callerRole ? `Caller role: ${formData.callerRole}` : null,
      formData.callSubject ? `Call subject: ${formData.callSubject}` : null,
      formData.maintenanceTarget ? `Maintenance target: ${formData.maintenanceTarget}` : null,
      formData.maintenanceCategories?.length ? `Maintenance types: ${formData.maintenanceCategories.join(', ')}` : null,
      formData.maintenanceBusNo ? `Maintenance bus #: ${formData.maintenanceBusNo}` : null,
      formData.maintenanceUrgency ? `Maintenance urgency: ${formData.maintenanceUrgency}` : null,
      ``,
      `--- DESCRIPTION ---`,
      formData.description,
      ``,
      formData.suggestionExpected ? `--- EXPECTED OUTCOME ---\n${formData.suggestionExpected}` : null,
    ].filter(Boolean);

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
