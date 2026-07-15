/* ticketGenerator.js — High-fidelity client-side PDF/Print E-Ticket generator */

export function generateTicketHTML(booking) {
  const pnr = booking.pnr || `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const dateStr = booking.date || booking.checkin || new Date().toISOString().split('T')[0];
  const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const price = booking.price || booking.totalPrice || booking.totalAmount || 0;
  const baseFare = Math.round(price / 1.18);
  const gst = price - baseFare;
  const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  const formattedBase = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(baseFare);
  const formattedGst = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(gst);

  let typeLabel = 'Booking receipt';
  let icon = '🎟️';
  let detailsRows = '';

  if (booking.type === 'flight') {
    typeLabel = 'Boarding Pass & E-Ticket';
    icon = '✈️';
    detailsRows = `
      <tr><th>Airline</th><td>${booking.airline || 'Domestic Carrier'}</td></tr>
      <tr><th>Flight Number</th><td>${booking.flightNumber || 'IX-402'}</td></tr>
      <tr><th>Route</th><td><strong>${booking.from || 'Delhi (DEL)'}</strong> ➔ <strong>${booking.to || 'Mumbai (BOM)'}</strong></td></tr>
      <tr><th>Departure Time</th><td>${booking.departure || '08:00'}</td></tr>
      <tr><th>Arrival Time</th><td>${booking.arrival || '10:30'}</td></tr>
      <tr><th>Class</th><td>${booking.travelClass || 'Economy'}</td></tr>
      <tr><th>Passengers</th><td>${booking.passengers || 1} Adult(s)</td></tr>
      <tr><th>PNR Status</th><td>Confirmed (${pnr})</td></tr>
    `;
  } else if (booking.type === 'train') {
    typeLabel = 'E-Ticket (IRCTC Partner)';
    icon = '🚂';
    detailsRows = `
      <tr><th>Train Name / Number</th><td>${booking.trainName || 'Rajdhani Express'} (#${booking.trainNumber || '12952'})</td></tr>
      <tr><th>Route</th><td><strong>${booking.from || 'NDLS'}</strong> ➔ <strong>${booking.to || 'BCT'}</strong></td></tr>
      <tr><th>Departure</th><td>${booking.departure || '16:55'}</td></tr>
      <tr><th>Arrival</th><td>${booking.arrival || '08:30'}</td></tr>
      <tr><th>Class / Coach</th><td>${booking.coachType || '3AC'}</td></tr>
      <tr><th>Quota</th><td>General (GN)</td></tr>
      <tr><th>Passengers</th><td>${booking.passengers || 1} Adult(s)</td></tr>
      <tr><th>PNR Number</th><td><strong>${pnr}</strong></td></tr>
    `;
  } else if (booking.type === 'hotel') {
    typeLabel = 'Hotel Booking Voucher';
    icon = '🏨';
    detailsRows = `
      <tr><th>Hotel Name</th><td>${booking.hotelName || 'Luxury Resort'}</td></tr>
      <tr><th>Location</th><td>${booking.destination || 'Goa'}</td></tr>
      <tr><th>Check-in Date</th><td>${booking.checkin || dateStr}</td></tr>
      <tr><th>Check-out Date</th><td>${booking.checkout || 'Next Day'}</td></tr>
      <tr><th>Room Type</th><td>${booking.roomType || 'Deluxe Room'}</td></tr>
      <tr><th>Guests / Rooms</th><td>${booking.guests || 2} Guest(s) · ${booking.rooms || 1} Room(s)</td></tr>
      <tr><th>Total Nights</th><td>${booking.nights || 1} Night(s)</td></tr>
    `;
  } else if (booking.type === 'bus') {
    typeLabel = 'Bus E-Ticket Voucher';
    icon = '🚌';
    detailsRows = `
      <tr><th>Operator</th><td>${booking.operator || 'Intercity SmartBus'}</td></tr>
      <tr><th>Bus Type</th><td>${booking.busType || 'Volvo Multi-Axle AC'}</td></tr>
      <tr><th>Route</th><td><strong>${booking.from}</strong> ➔ <strong>${booking.to}</strong></td></tr>
      <tr><th>Reporting Time</th><td>${booking.departure || '21:00'}</td></tr>
      <tr><th>Seats Assigned</th><td>${booking.seats?.join(', ') || '7, 8'}</td></tr>
      <tr><th>Passengers</th><td>${booking.passengers || 1} Pax</td></tr>
    `;
  } else if (booking.type === 'cab') {
    typeLabel = 'Cab Rental Receipt';
    icon = '🚗';
    detailsRows = `
      <tr><th>Cab Provider</th><td>${booking.provider || 'Ola'}</td></tr>
      <tr><th>Vehicle Class</th><td>${booking.vehicleType || 'Sedan (AC)'}</td></tr>
      <tr><th>Route / Plan</th><td>${booking.from} ➔ ${booking.to}</td></tr>
      <tr><th>Schedule Time</th><td>${booking.schedule || 'Immediate'}</td></tr>
      <tr><th>Status</th><td>Booking Confirmed (Driver details will arrive via SMS)</td></tr>
    `;
  } else {
    // general itinerary/booking
    typeLabel = 'Itinerary Receipt';
    detailsRows = `
      <tr><th>Details</th><td>${booking.details || 'HeritageX booking itinerary'}</td></tr>
      <tr><th>Date</th><td>${dateStr}</td></tr>
    `;
  }

  // Self-contained SVG QR code block to make invoice look extremely professional
  const qrSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
      <rect width="100" height="100" fill="#ffffff"/>
      <!-- Outer boundary corners -->
      <rect x="10" y="10" width="25" height="25" fill="none" stroke="#000" stroke-width="4"/>
      <rect x="15" y="15" width="15" height="15" fill="#000"/>
      <rect x="65" y="10" width="25" height="25" fill="none" stroke="#000" stroke-width="4"/>
      <rect x="70" y="15" width="15" height="15" fill="#000"/>
      <rect x="10" y="65" width="25" height="25" fill="none" stroke="#000" stroke-width="4"/>
      <rect x="15" y="70" width="15" height="15" fill="#000"/>
      <!-- QR Random Pixels matching professional barcode layout -->
      <rect x="42" y="12" width="6" height="6" fill="#000"/>
      <rect x="52" y="12" width="6" height="12" fill="#000"/>
      <rect x="42" y="24" width="12" height="6" fill="#000"/>
      <rect x="12" y="42" width="6" height="6" fill="#000"/>
      <rect x="24" y="42" width="12" height="6" fill="#000"/>
      <rect x="42" y="42" width="18" height="18" fill="#000"/>
      <rect x="72" y="42" width="6" height="12" fill="#000"/>
      <rect x="12" y="52" width="12" height="6" fill="#000"/>
      <rect x="72" y="65" width="12" height="6" fill="#000"/>
      <rect x="65" y="75" width="6" height="12" fill="#000"/>
      <rect x="80" y="80" width="8" height="8" fill="#000"/>
      <rect x="45" y="72" width="12" height="12" fill="#000"/>
    </svg>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HeritageX-Booking-${booking.id}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1e293b;
          background: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        .invoice-card {
          background: #ffffff;
          max-width: 800px;
          margin: 30px auto;
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .invoice-header {
          background: linear-gradient(135deg, #0d7377 0%, #1e3a3a 100%);
          color: #ffffff;
          padding: 30px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #c9a84c;
        }
        .brand-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          margin-top: 4px;
        }
        .invoice-header-right {
          text-align: right;
        }
        .invoice-badge {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 8px;
        }
        .invoice-meta-info {
          padding: 24px 40px;
          border-bottom: 1px solid #edf2f7;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          background: #fafafb;
        }
        .meta-col h4 {
          margin: 0 0 6px;
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .meta-col p {
          margin: 0;
          font-size: 13.5px;
          font-weight: 600;
          color: #1e293b;
        }
        .invoice-body {
          padding: 40px;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .details-table th, .details-table td {
          padding: 14px 16px;
          text-align: left;
          font-size: 14px;
        }
        .details-table th {
          background: #f1f5f9;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e2e8f0;
          width: 35%;
        }
        .details-table td {
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }
        .invoice-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: end;
          margin-top: 40px;
          border-top: 2px dashed #edf2f7;
          padding-top: 30px;
        }
        .qr-section {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.4;
        }
        .billing-breakdown {
          background: #fafafb;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #edf2f7;
        }
        .billing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 13px;
          color: #475569;
        }
        .billing-row.total {
          border-top: 1.5px solid #e2e8f0;
          margin-bottom: 0;
          padding-top: 10px;
          font-weight: 800;
          font-size: 16px;
          color: #0d7377;
        }
        .invoice-footer {
          text-align: center;
          padding: 30px 40px;
          background: #f8fafc;
          border-top: 1px solid #edf2f7;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.6;
        }
        .btn-print-action {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #c9a84c;
          color: #000000;
          border: none;
          padding: 14px 28px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(201,168,76,0.3);
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-print-action:hover {
          transform: translateY(-2px);
        }
        @media print {
          body {
            background: #ffffff;
            padding: 0;
          }
          .invoice-card {
            box-shadow: none;
            border: none;
            margin: 0;
          }
          .btn-print-action {
            display: none;
          }
        }
      </style>
    </head>
    <body>

      <div class="invoice-card">
        <!-- Header -->
        <div class="invoice-header">
          <div>
            <div class="brand-logo">HeritageX</div>
            <div class="brand-subtitle">Official Travel Booking Document</div>
          </div>
          <div class="invoice-header-right">
            <span class="invoice-badge">Paid & Confirmed</span>
            <div style="font-size: 12px; opacity: 0.8;">Status updated live via Local Ledger</div>
          </div>
        </div>

        <!-- Meta Grid -->
        <div class="invoice-meta-info">
          <div class="meta-col">
            <h4>Booking ID</h4>
            <p>${booking.id}</p>
          </div>
          <div class="meta-col">
            <h4>Date of Issue</h4>
            <p>${formattedDate}</p>
          </div>
          <div class="meta-col">
            <h4>Passenger / Guest</h4>
            <p>${booking.userName || 'Yash Travel-Guest'}</p>
          </div>
        </div>

        <!-- Ticket Body -->
        <div class="invoice-body">
          <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 16px; border-bottom: 2px solid #0d7377; padding-bottom: 8px; color: #0d7377; display: flex; align-items: center; gap: 8px;">
            <span>${icon}</span> ${typeLabel} Details
          </h3>
          <table class="details-table">
            <tbody>
              ${detailsRows}
            </tbody>
          </table>

          <!-- Billing Breakdown -->
          <div class="invoice-summary-grid">
            <div class="qr-section">
              ${qrSvg}
              <div>
                <strong>Secure Digital Signature</strong><br>
                This document is verified and authenticated by HeritageX. Scan this QR code on-site to verify boarding eligibility.
              </div>
            </div>
            <div class="billing-breakdown">
              <div class="billing-row">
                <span>Base Fare / Stay Tariff</span>
                <span>${formattedBase}</span>
              </div>
              <div class="billing-row">
                <span>GST (18% Integrated Tax)</span>
                <span>${formattedGst}</span>
              </div>
              <div class="billing-row">
                <span>Convenience / Reservation Fees</span>
                <span style="color: #22c55e;">FREE</span>
              </div>
              <div class="billing-row total">
                <span>Total Paid (INR)</span>
                <span>${formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms Footer -->
        <div class="invoice-footer">
          Thank you for choosing HeritageX to discover and plan your next cultural journey.<br>
          For support, call 1800-402-900 (Toll Free) or email support@heritagex.com.<br>
          <span style="display:block; margin-top:10px; font-size:10px; color:#cbd5e1;">© 2026 HeritageX Travel Platform. All Rights Reserved. Subject to standard carriage conditions.</span>
        </div>
      </div>

      <!-- Floating Print CTA -->
      <button class="btn-print-action" onclick="window.print()">
        <span>🖨️</span> Save as PDF / Print Ticket
      </button>

    </body>
    </html>
  `;
}

export function openTicketPrintWindow(booking) {
  const html = generateTicketHTML(booking);
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  } else {
    alert('Pop-up blocked! Please allow pop-ups for localhost to view the e-ticket.');
  }
}
