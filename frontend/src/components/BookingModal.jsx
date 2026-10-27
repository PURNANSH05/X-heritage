/* BookingModal.jsx — Reusable booking confirmation modal with payment flow */
import { useState } from 'react';
import { createBooking, formatPrice } from '../services/bookingService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { openTicketPrintWindow } from '../utils/ticketGenerator.js';
import Icon from './Icon.jsx';


const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: 'phone', options: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'] },
  { id: 'card', label: 'Credit / Debit Card', icon: 'card', options: [] },
  { id: 'netbanking', label: 'Net Banking', icon: 'bank', options: ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'] },
  { id: 'wallet', label: 'Wallet', icon: 'wallet', options: ['Paytm', 'Amazon Pay', 'Mobikwik'] },
  { id: 'emi', label: 'EMI', icon: 'calendar', options: ['No Cost EMI available'] },
];

export default function BookingModal({ isOpen, onClose, bookingType, bookingDetails, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: review, 2: payment, 3: confirmed
  const [payMethod, setPayMethod] = useState('upi');
  const [payOption, setPayOption] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === payMethod);

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    const newBooking = createBooking(bookingType, bookingDetails, user?.email, user?.name);
    setBooking(newBooking);
    setProcessing(false);
    setStep(3);
    onSuccess && onSuccess(newBooking);
    // Simulate email notification
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 6000);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="booking-modal-title">
            {step === 1 && <><Icon name="clipboard" /> Review Booking</>}
            {step === 2 && <><Icon name="card" /> Secure Payment</>}
            {step === 3 && <><Icon name="confirmed" /> Booking Confirmed!</>}
          </h2>
          {step !== 3 && (
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close booking"><Icon name="close" /></button>
          )}
        </div>

        {/* Step indicators */}
        <div className="booking-steps">
          {['Review', 'Payment', 'Confirmed'].map((label, idx) => (
            <div key={label} className={`booking-step ${step > idx ? 'done' : ''} ${step === idx + 1 ? 'active' : ''}`}>
              <div className="booking-step-circle">{step > idx + 1 ? <Icon name="check" size={15} /> : idx + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Review */}
        {step === 1 && (
          <div className="modal-body">
            <div className="booking-review-grid">
              {Object.entries(bookingDetails).map(([key, val]) => {
                if (['id', 'image', 'amenities', 'roomTypes'].includes(key)) return null;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                return (
                  <div key={key} className="booking-review-item">
                    <span className="booking-review-label">{label}</span>
                    <span className="booking-review-value">
                      {typeof val === 'number' && key.toLowerCase().includes('price')
                        ? formatPrice(val)
                        : String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="booking-total-bar">
              <span>Total Amount</span>
              <strong>{formatPrice(bookingDetails.price || bookingDetails.totalPrice || 0)}</strong>
            </div>
            <button type="button" className="btn btn-primary booking-continue-btn" onClick={() => setStep(2)}>
              Continue to Payment <Icon name="arrowRight" size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="modal-body">
            <div className="payment-methods">
              {PAYMENT_METHODS.map(m => (
                <button
                  type="button"
                  key={m.id}
                  className={`payment-method-tab ${payMethod === m.id ? 'active' : ''}`}
                  aria-pressed={payMethod === m.id}
                  onClick={() => { setPayMethod(m.id); setPayOption(''); }}
                >
                  <Icon name={m.icon} />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            <div className="payment-form">
              {payMethod === 'upi' && (
                <div className="payment-field-group">
                  <div className="payment-upi-apps">
                    {selectedMethod.options.map(opt => (
                      <button
                        type="button"
                        key={opt}
                        className={`upi-app-btn ${payOption === opt ? 'active' : ''}`}
                        aria-pressed={payOption === opt}
                        onClick={() => setPayOption(opt)}
                      >{opt}</button>
                    ))}
                  </div>
                  <div className="payment-field">
                    <label>Or enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {payMethod === 'card' && (
                <div className="payment-field-group">
                  <div className="payment-field">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                      value={cardDetails.number}
                      onChange={e => setCardDetails(p => ({ ...p, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))}
                    />
                  </div>
                  <div className="payment-field-row">
                    <div className="payment-field">
                      <label>Expiry</label>
                      <input type="text" placeholder="MM/YY" maxLength={5}
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails(p => ({ ...p, expiry: e.target.value }))}
                      />
                    </div>
                    <div className="payment-field">
                      <label>CVV</label>
                      <input type="password" placeholder="•••" maxLength={4}
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails(p => ({ ...p, cvv: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="payment-field">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="As on card"
                      value={cardDetails.name}
                      onChange={e => setCardDetails(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {(payMethod === 'netbanking' || payMethod === 'wallet') && (
                <div className="payment-options-grid">
                  {selectedMethod.options.map(opt => (
                      <button
                        type="button"
                      key={opt}
                      className={`payment-option-btn ${payOption === opt ? 'active' : ''}`}
                        aria-pressed={payOption === opt}
                      onClick={() => setPayOption(opt)}
                    >{opt}</button>
                  ))}
                </div>
              )}

              {payMethod === 'emi' && (
                <div className="payment-emi-info">
                  <p><Icon name="celebration" size={16} /> No Cost EMI available on select credit cards</p>
                  <div className="payment-options-grid">
                    {['3 months', '6 months', '9 months', '12 months'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        className={`payment-option-btn ${payOption === opt ? 'active' : ''}`}
                        aria-pressed={payOption === opt}
                        onClick={() => setPayOption(opt)}
                      >{opt}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="payment-security-note">
              <Icon name="lock" size={15} /> 256-bit SSL encryption · PCI DSS compliant · Your data is safe
            </div>

            <div className="booking-total-bar">
              <span>Total to Pay</span>
              <strong>{formatPrice(bookingDetails.price || bookingDetails.totalPrice || 0)}</strong>
            </div>

            <div className="payment-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}><Icon name="arrowLeft" size={16} /> Back</button>
              <button
                className={`btn btn-primary booking-pay-btn ${processing ? 'loading' : ''}`}
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <><span className="login-spinner" /> Processing Payment…</>
                ) : (
                  <>Pay {formatPrice(bookingDetails.price || bookingDetails.totalPrice || 0)} <Icon name="arrowRight" size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && booking && (
          <div className="modal-body booking-confirmed">
            {/* Email sent toast */}
            {emailSent && (
              <div style={{
                position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
                background: '#22c55e', color: '#fff', padding: '12px 20px',
                borderRadius: '12px', boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '14px', fontWeight: '700', animation: 'slideInRight 0.4s ease',
              }}>
                <Icon name="mail" size={17} />
                <span>E-Ticket sent to <strong>{user?.email}</strong></span>
              </div>
            )}

            <div style={{ marginBottom: '12px', animation: 'bounce 0.8s ease', color: '#22c55e' }}><Icon name="confirmed" size={56} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px', color: '#0f172a' }}>Booking Confirmed!</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px' }}>Your e-ticket has been saved to the dashboard and sent to your email.</p>

            {/* Booking summary strip */}
            <div style={{
              background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px',
              padding: '16px 20px', marginBottom: '20px', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Booking ID</span>
                <strong style={{ fontFamily: 'monospace', color: '#0d7377', fontSize: '13px' }}>{booking.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Status</span>
                <span style={{ color: '#22c55e', fontWeight: '800', fontSize: '13px' }}><Icon name="check" size={14} /> Confirmed &amp; Paid</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Email</span>
                <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}><Icon name="mail" size={14} /> Sent to {user?.email}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="confirmed-actions" style={{ gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => openTicketPrintWindow(booking)}
                style={{ background: 'linear-gradient(135deg, #c9a84c, #8b6914)', color: '#000', fontWeight: '800' }}
              >
                <Icon name="document" size={16} /> Download E-Ticket (PDF)
              </button>
              <a className="btn btn-primary" href="/dashboard" style={{ textDecoration: 'none' }}><Icon name="layoutDashboard" size={16} /> View Dashboard</a>
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '16px', lineHeight: '1.5' }}>
              <Icon name="lock" size={14} /> Your data is secure. A copy of this ticket has been saved locally for offline access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
