/* Terms.jsx — HeritageX Terms of Service */
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function Terms() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ color: '#0d7377', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>← Back to HeritageX</Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 48px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <Icon name="clipboard" size={34} />
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Terms of Service</h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Last updated: June 28, 2026 · Effective immediately</p>
            </div>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.7, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 32 }}>
            By accessing or using the HeritageX platform, you agree to be bound by these Terms of Service. Please read them carefully before making any bookings or using our services.
          </p>

          {[
            {
              title: '1. Acceptance of Terms',
              content: `By creating an account or making a booking on HeritageX, you confirm that:
• You are at least 18 years of age
• You have the legal authority to enter into this agreement
• All information you provide is accurate and complete
• You will comply with all applicable laws and regulations`,
            },
            {
              title: '2. Our Services',
              content: `HeritageX provides:
• **Heritage Site Discovery**: Search, scan, and explore cultural heritage sites worldwide
• **Travel Booking**: Flight, train, bus, hotel, and cab booking services
• **AI Trip Planner**: AI-powered itinerary generation and travel recommendations
• **E-Ticket Generation**: Digital tickets for all confirmed bookings

All bookings are subject to availability and the terms of the respective carriers and hotels.`,
            },
            {
              title: '3. User Accounts',
              content: `• You are responsible for maintaining the confidentiality of your account credentials
• You must notify us immediately of any unauthorised use of your account
• We reserve the right to suspend accounts that violate these terms
• One person may not maintain multiple active accounts`,
            },
            {
              title: '4. Booking & Payment',
              content: `• All prices displayed are inclusive of applicable taxes unless stated otherwise
• Bookings are confirmed only upon successful payment processing
• E-tickets are issued within minutes of confirmed payment
• Booking details are sent to your registered email address
• All transactions are processed through PCI DSS compliant payment gateways`,
            },
            {
              title: '5. Cancellation & Refunds',
              content: `• **Flights**: Cancellation charges apply per airline policy. Refunds processed within 5–7 business days.
• **Hotels**: Free cancellation up to 24 hours before check-in. After that, one night may be charged.
• **Trains**: Cancellation per IRCTC rules. Refunds processed within 7 business days.
• **Buses**: Non-refundable within 4 hours of departure.
• **Cabs**: Free cancellation up to 30 minutes before scheduled pickup.

Refunds are credited to the original payment method.`,
            },
            {
              title: '6. User Responsibilities',
              content: `You agree not to:
• Provide false or misleading information in bookings
• Use the platform for any fraudulent or illegal purpose
• Attempt to reverse-engineer, hack, or disrupt our systems
• Share your account credentials with other persons
• Make bulk or automated bookings without prior written approval`,
            },
            {
              title: '7. Intellectual Property',
              content: `All content on HeritageX — including the logo, design, text, images, and software code — is the intellectual property of HeritageX Technologies Pvt. Ltd. and is protected by copyright law. Unauthorised use, reproduction, or distribution is prohibited.`,
            },
            {
              title: '8. Limitation of Liability',
              content: `HeritageX acts as a booking intermediary. We are not responsible for:
• Service quality provided by airlines, hotels, or transport operators
• Flight delays, cancellations, or changes made by carriers
• Loss of baggage or personal property
• Force majeure events (natural disasters, strikes, pandemics)

Our maximum liability for any booking is limited to the amount paid for that specific booking.`,
            },
            {
              title: '9. Governing Law',
              content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra, India.`,
            },
            {
              title: '10. Contact',
              content: `For any questions about these Terms:
• Email: legal@heritagex.com
• Support: support@heritagex.com (1800-402-900, Toll Free)
• Address: HeritageX Technologies Pvt. Ltd., India`,
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d7377', marginBottom: 12 }}>{section.title}</h2>
              <div style={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: 14 }}>
                {section.content.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/security" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 13 }}><Icon name="shield" size={15} /> Security Center</Link>
            <Link to="/privacy" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13 }}><Icon name="lock" size={15} /> Privacy Policy</Link>
            <a href="mailto:legal@heritagex.com" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: 13 }}><Icon name="mail" size={15} /> Legal Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
