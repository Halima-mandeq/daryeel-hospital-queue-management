import { jsPDF } from 'jspdf';
import { Patient, DoctorRoom } from '../types/clinic';

export interface ExportFilterOptions {
  status?: string; // 'all' | 'waiting' | 'in_consultation' | 'completed' | 'emergency'
  searchQuery?: string;
  lang?: 'so' | 'en';
}

/**
 * Filter patients helper based on user selection in ClinicAnalyticsView
 */
export function filterPatientsForExport(
  patients: Patient[],
  filter: string,
  search: string = ''
): Patient[] {
  return patients.filter((patient) => {
    // Filter condition
    if (filter === 'waiting' && patient.status !== 'waiting') return false;
    if (filter === 'in_consultation' && patient.status !== 'in_consultation') return false;
    if (filter === 'completed' && patient.status !== 'completed') return false;
    if (filter === 'emergency' && patient.triageLevel !== 'emergency') return false;
    if (filter === 'urgent' && patient.triageLevel !== 'urgent') return false;
    if (filter === 'routine' && patient.triageLevel !== 'routine') return false;

    // Search condition
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = patient.fullName.toLowerCase().includes(q);
      const matchTicket = patient.ticketNumber.toLowerCase().includes(q);
      const matchPhone = patient.phone.toLowerCase().includes(q);
      const matchSymptoms = patient.symptoms.toLowerCase().includes(q);
      if (!matchName && !matchTicket && !matchPhone && !matchSymptoms) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Helper to escape CSV fields safely according to RFC 4180
 */
function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // Double-quote escape any embedded double quotes
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Format timestamp into clean human readable date/time
 */
export function formatExportDateTime(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

/**
 * Export Patient List to CSV File with UTF-8 BOM
 */
export function exportPatientsToCSV(
  patients: Patient[],
  rooms: DoctorRoom[] = [],
  lang: 'so' | 'en' = 'so'
): { success: boolean; count: number; filename: string } {
  if (!patients || patients.length === 0) {
    return { success: false, count: 0, filename: '' };
  }

  const roomMap = new Map<string, string>();
  rooms.forEach((r) => {
    roomMap.set(r.id, `${r.roomName} (${r.doctorName})`);
  });

  // Multilingual column headers
  const headers = lang === 'so'
    ? [
        'Lambarka Tikidha',
        'Magaca Buuxa',
        'Taleefanka',
        "Da'da",
        'Jinsiga',
        'Qeybta Bukaanka',
        'Uurka (Toddobaadyo)',
        'Heerka Triage-ka',
        'Dhibcaha Acuity',
        'Xaaladda Hadda',
        'Heerkulka (°C)',
        'Cadaadiska Dhiigga (BP)',
        'Garaaca Wadnaha (BPM)',
        'Ogsijiinta SpO2 (%)',
        'Calaamadaha / Cabashada',
        'Qolka & Dhakhtarka',
        'Dawooyinka / Qoraalka',
        'Waqtiga Diiwaangelinta',
        'Waqtiga Yeeritaanka',
        'Waqtiga Dhameystirka',
      ]
    : [
        'Ticket Number',
        'Full Name',
        'Phone Number',
        'Age',
        'Gender',
        'Patient Category',
        'Pregnancy Weeks',
        'Triage Level',
        'Acuity Score',
        'Current Status',
        'Temperature (°C)',
        'Blood Pressure (BP)',
        'Heart Rate (BPM)',
        'Oxygen SpO2 (%)',
        'Clinical Symptoms / Chief Complaint',
        'Assigned Room & Doctor',
        'Prescriptions / Clinical Notes',
        'Registration Timestamp',
        'Called Timestamp',
        'Completed Timestamp',
      ];

  const rows: string[][] = patients.map((p) => {
    const assigned = p.assignedDoctorName
      ? `${p.assignedDoctorName}${p.assignedRoomId ? ` [${p.assignedRoomId}]` : ''}`
      : p.assignedRoomId && roomMap.has(p.assignedRoomId)
      ? roomMap.get(p.assignedRoomId)!
      : 'Aan loo qoondeyn (Unassigned)';

    const triageLabel =
      p.triageLevel === 'emergency'
        ? lang === 'so' ? 'Cas · Degdeg Halis ah (P-1)' : 'Red · Critical Emergency (P-1)'
        : p.triageLevel === 'urgent'
        ? lang === 'so' ? 'Jaalle · Degdeg Dhexdhexaad (P-2)' : 'Yellow · Urgent Care (P-2)'
        : lang === 'so' ? 'Cagaar · Caadi (P-3)' : 'Green · Routine Non-urgent (P-3)';

    const statusLabel =
      p.status === 'waiting'
        ? lang === 'so' ? 'Sugaya' : 'Waiting'
        : p.status === 'in_consultation'
        ? lang === 'so' ? 'Dhakhtarka la jooga' : 'In Consultation'
        : p.status === 'called'
        ? lang === 'so' ? 'Loo yeeray' : 'Called'
        : p.status === 'completed'
        ? lang === 'so' ? 'Dhameystirmay' : 'Completed'
        : lang === 'so' ? 'La wareejiyay' : 'Referred';

    const categoryLabel =
      p.category === 'maternal'
        ? lang === 'so' ? 'Hooyo (Maternal)' : 'Maternal / ANC'
        : p.category === 'child'
        ? lang === 'so' ? 'Dhallaanka (Child/Pediatric)' : 'Child / Pediatric'
        : p.category === 'emergency'
        ? lang === 'so' ? 'Degdeg Guud (Emergency)' : 'Acute Emergency'
        : lang === 'so' ? 'Qof Weyn (Adult General)' : 'Adult General';

    const notesAndRx = [
      p.prescriptions && p.prescriptions.length > 0 ? `Rx: ${p.prescriptions.join('; ')}` : '',
      p.doctorNotes ? `Notes: ${p.doctorNotes}` : '',
    ].filter(Boolean).join(' | ') || '-';

    return [
      p.ticketNumber,
      p.fullName,
      p.phone || '-',
      String(p.age),
      p.gender === 'female' ? (lang === 'so' ? 'Dheddig' : 'Female') : (lang === 'so' ? 'Lab' : 'Male'),
      categoryLabel,
      p.pregnancyWeek ? `${p.pregnancyWeek} wks` : 'N/A',
      triageLabel,
      String(p.triageScore ?? 3),
      statusLabel,
      p.vitals?.temperature ? `${p.vitals.temperature}°C` : '-',
      p.vitals?.bloodPressure || '-',
      p.vitals?.heartRate ? `${p.vitals.heartRate} bpm` : '-',
      p.vitals?.spO2 ? `${p.vitals.spO2}%` : '-',
      p.symptoms || '-',
      assigned,
      notesAndRx,
      formatExportDateTime(p.registeredAt),
      formatExportDateTime(p.calledAt),
      formatExportDateTime(p.completedAt),
    ];
  });

  const csvLines: string[] = [];
  csvLines.push(headers.map(escapeCsvCell).join(','));
  rows.forEach((row) => {
    csvLines.push(row.map(escapeCsvCell).join(','));
  });

  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel and international spreadsheet support
  const csvContent = '\uFEFF' + csvLines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `DaryeelQoys_Bukaanada_${dateStr}.csv`;

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { success: true, count: patients.length, filename };
}

/**
 * Export Patient Registry to a clinical-grade PDF Document using jsPDF
 */
export function exportPatientsToPDF(
  patients: Patient[],
  rooms: DoctorRoom[] = [],
  lang: 'so' | 'en' = 'so',
  filterName?: string
): { success: boolean; count: number; filename: string } {
  if (!patients || patients.length === 0) {
    return { success: false, count: 0, filename: '' };
  }

  // Create landscape A4 PDF document: width=297mm, height=210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  const roomMap = new Map<string, string>();
  rooms.forEach((r) => {
    roomMap.set(r.id, `${r.roomName}`);
  });

  const emergencyCount = patients.filter((p) => p.triageLevel === 'emergency').length;
  const urgentCount = patients.filter((p) => p.triageLevel === 'urgent').length;
  const routineCount = patients.filter((p) => p.triageLevel === 'routine').length;
  const waitingCount = patients.filter((p) => p.status === 'waiting').length;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString(lang === 'so' ? 'so-SO' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Draw Header function for page 1 and subsequent pages
  const drawPageHeader = (pageNum: number) => {
    // Top primary brand bar
    doc.setFillColor(37, 99, 235); // Sapphire Blue #2563eb
    doc.rect(margin, margin, contentWidth, 18, 'F');

    // Title text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(
      lang === 'so'
        ? 'DARYEELQOYS - XARUNTA HOOYADA, DHALLAANKA & SAFKA DEGDEGGA'
        : 'DARYEELQOYS - MATERNAL, CHILD & EMERGENCY CLINIC REGISTRY',
      margin + 6,
      margin + 8
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      lang === 'so'
        ? 'Diiwaanka Rasmiga ah ee Bukaanka (Official Clinical Patient Ledger) | Qeybta Diiwaangelinta & Triage-ka'
        : 'Official In-Facility Patient Registry & Clinical Acuity Audit Ledger | Triage & Medical Records Dept',
      margin + 6,
      margin + 13.5
    );

    // Date / Page right-aligned in header bar
    doc.setFontSize(8);
    doc.text(`${dateFormatted} - ${timeFormatted}`, pageWidth - margin - 6, margin + 8, { align: 'right' });
    doc.text(
      lang === 'so' ? `Bogga ${pageNum}` : `Page ${pageNum}`,
      pageWidth - margin - 6,
      margin + 13.5,
      { align: 'right' }
    );
  };

  // Draw Summary Stats banner on First Page only
  let startY = margin + 22;

  drawPageHeader(1);

  // Summary Metrics Card
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, startY, contentWidth, 14, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);

  const filterDisplay = filterName ? ` [${filterName}]` : '';
  doc.text(
    lang === 'so'
      ? `Tirada Bukaanka: ${patients.length}${filterDisplay}`
      : `Total Patients: ${patients.length}${filterDisplay}`,
    margin + 4,
    startY + 5.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    lang === 'so'
      ? `Sugayaasha Safka: ${waitingCount}  |  Degdeg Cas (P-1): ${emergencyCount}  |  Degdeg Dhexdhexaad (P-2): ${urgentCount}  |  Caadi (P-3): ${routineCount}`
      : `Waiting in Queue: ${waitingCount}  |  Emergency Red (P-1): ${emergencyCount}  |  Urgent Yellow (P-2): ${urgentCount}  |  Routine Green (P-3): ${routineCount}`,
    margin + 4,
    startY + 10.5
  );

  // Disclaimer / Confidentiality on top right
  doc.setTextColor(100, 116, 139);
  doc.text(
    lang === 'so' ? 'Sir Caafimaad · Qoraal Rasmi ah' : 'Confidential Medical Records · MOH Protocol',
    pageWidth - margin - 4,
    startY + 8,
    { align: 'right' }
  );

  startY += 17;

  // Table Column Definitions
  // Total width: contentWidth (e.g. 297 - 24 = 273mm)
  const cols = [
    { key: 'ticket', label: lang === 'so' ? 'Tikidh' : 'Ticket', width: 18 },
    { key: 'name', label: lang === 'so' ? 'Magaca Bukaanka' : 'Patient Name', width: 44 },
    { key: 'phone', label: lang === 'so' ? 'Taleefan' : 'Phone', width: 25 },
    { key: 'demo', label: lang === 'so' ? "Da'da/Jinsiga" : 'Age/Sex', width: 22 },
    { key: 'category', label: lang === 'so' ? 'Qeybta' : 'Category', width: 28 },
    { key: 'triage', label: lang === 'so' ? 'Triage (Acuity)' : 'Triage (Acuity)', width: 34 },
    { key: 'vitals', label: lang === 'so' ? 'Vitals (T, BP, HR, O2)' : 'Vitals (T, BP, HR, O2)', width: 42 },
    { key: 'status', label: lang === 'so' ? 'Xaaladda' : 'Status', width: 25 },
    { key: 'room', label: lang === 'so' ? 'Qolka/Dhakhtarka' : 'Room/Physician', width: 35 },
  ];

  const renderTableHeader = (y: number) => {
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    cols.forEach((col) => {
      doc.text(col.label, curX + 2, y + 4.8);
      curX += col.width;
    });
  };

  renderTableHeader(startY);
  startY += 7;

  // Row Rendering loop
  const rowHeight = 7.2;
  const bottomLimit = pageHeight - 20; // Leave 20mm for footer & signature
  let currentPage = 1;

  patients.forEach((patient, index) => {
    // Check if we need a new page
    if (startY + rowHeight > bottomLimit) {
      doc.addPage();
      currentPage += 1;
      drawPageHeader(currentPage);
      startY = margin + 22;
      renderTableHeader(startY);
      startY += 7;
    }

    // Zebra striping
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252); // slate-50
    }
    doc.rect(margin, startY, contentWidth, rowHeight, 'F');

    // Bottom row separator line
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.line(margin, startY + rowHeight, margin + contentWidth, startY + rowHeight);

    let curX = margin;

    // 1. Ticket
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (patient.triageLevel === 'emergency') {
      doc.setTextColor(225, 29, 72); // rose-600
    } else if (patient.triageLevel === 'urgent') {
      doc.setTextColor(217, 119, 6); // amber-600
    } else {
      doc.setTextColor(16, 149, 193); // sapphire/emerald
    }
    doc.text(patient.ticketNumber, curX + 2, startY + 4.8);
    curX += cols[0].width;

    // 2. Patient Name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // slate-900
    const truncatedName = patient.fullName.length > 25 ? patient.fullName.substring(0, 24) + '…' : patient.fullName;
    doc.text(truncatedName, curX + 2, startY + 4.8);
    curX += cols[1].width;

    // 3. Phone
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(patient.phone || '-', curX + 2, startY + 4.8);
    curX += cols[2].width;

    // 4. Age/Sex
    const sexLabel = patient.gender === 'female' ? (lang === 'so' ? 'Dh' : 'F') : (lang === 'so' ? 'L' : 'M');
    doc.text(`${patient.age}y / ${sexLabel}`, curX + 2, startY + 4.8);
    curX += cols[3].width;

    // 5. Category
    let catText: string = patient.category;
    if (patient.category === 'maternal') {
      catText = patient.pregnancyWeek ? `ANC (${patient.pregnancyWeek}w)` : 'Maternal';
    } else if (patient.category === 'child') {
      catText = 'Pediatric';
    } else if (patient.category === 'emergency') {
      catText = 'Emergency';
    } else {
      catText = 'Adult';
    }
    doc.text(catText, curX + 2, startY + 4.8);
    curX += cols[4].width;

    // 6. Triage (P-1, P-2, P-3)
    doc.setFont('helvetica', 'bold');
    if (patient.triageLevel === 'emergency') {
      doc.setTextColor(190, 18, 60);
      doc.text('RED (P-1 Crit)', curX + 2, startY + 4.8);
    } else if (patient.triageLevel === 'urgent') {
      doc.setTextColor(180, 83, 9);
      doc.text('YELLOW (P-2 Urg)', curX + 2, startY + 4.8);
    } else {
      doc.setTextColor(5, 150, 105);
      doc.text('GREEN (P-3 Rout)', curX + 2, startY + 4.8);
    }
    curX += cols[5].width;

    // 7. Vitals (T, BP, HR, O2)
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const vitalsStr = `${patient.vitals?.temperature || '-'}°C | ${patient.vitals?.bloodPressure || '-'} | ${patient.vitals?.spO2 || '-'}%`;
    doc.text(vitalsStr, curX + 2, startY + 4.8);
    curX += cols[6].width;

    // 8. Status
    const statusText =
      patient.status === 'waiting'
        ? lang === 'so' ? 'Sugaya' : 'Waiting'
        : patient.status === 'in_consultation'
        ? lang === 'so' ? 'Qolka ku jira' : 'In Consult'
        : patient.status === 'called'
        ? lang === 'so' ? 'Yeeray' : 'Called'
        : patient.status === 'completed'
        ? lang === 'so' ? 'Dhameeyay' : 'Completed'
        : 'Referred';
    doc.text(statusText, curX + 2, startY + 4.8);
    curX += cols[7].width;

    // 9. Room / Doctor
    const assignedDoc = patient.assignedDoctorName
      ? patient.assignedDoctorName.replace(/^Dr\.\s*/, '')
      : patient.assignedRoomId && roomMap.has(patient.assignedRoomId)
      ? roomMap.get(patient.assignedRoomId)!
      : '-';
    const truncatedDoc = assignedDoc.length > 18 ? assignedDoc.substring(0, 17) + '…' : assignedDoc;
    doc.text(truncatedDoc, curX + 2, startY + 4.8);

    startY += rowHeight;
  });

  // Footer: Signature and Official Ledger verification on the last page
  const footerY = pageHeight - 14;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, footerY - 2, margin + contentWidth, footerY - 2);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    lang === 'so'
      ? '* Qoraalkani waa xog rasmi ah oo ay dhalisay DaryeelQoys Triage System. Waa xog sir ah oo bukaan (Confidential Medical Record).'
      : '* This ledger is an official medical export from DaryeelQoys Clinical System. Strict patient data privacy applies.',
    margin,
    footerY + 3
  );

  // Signatures on right
  doc.setFont('helvetica', 'normal');
  doc.text(
    lang === 'so'
      ? 'Saxeexa Kalkaalisada / Dhakhtarka: _____________________'
      : 'Authorizing Officer Signature: _____________________',
    pageWidth - margin - 85,
    footerY + 3
  );

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `DaryeelQoys_Bukaanada_${dateStr}.pdf`;

  // Trigger PDF file download
  doc.save(filename);

  return { success: true, count: patients.length, filename };
}
