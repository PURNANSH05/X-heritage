import { useCallback, useEffect, useRef, useState } from 'react';

const SUGGESTIONS = [
  'Best hotels near Taj Mahal?',
  'Best time to visit India?',
  'Tips for booking trains?',
  'Budget travel tips?',
  'What to pack for India?',
  'Goa travel guide?',
];

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n/g, '<br/>');
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m your **HeritageX AI Travel Assistant**. Ask me anything about destinations, hotels, transport, or travel tips! ✈️' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setTyping(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again!' }]);
    }
  }, [input]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="ai-chat-bubble">
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-avatar-circle">🤖</div>
            <div className="ai-header-info">
              <h4>HeritageX AI</h4>
              <span>✦ Always online</span>
            </div>
            <button className="ai-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <div
                  className="ai-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
                />
              </div>
            ))}
            {typing && (
              <div className="ai-msg bot">
                <div className="ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="ai-suggestions">
              {SUGGESTIONS.slice(0, 3).map(s => (
                <button key={s} className="ai-suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="ai-input-row">
            <input
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about travel, hotels, tips…"
              aria-label="Chat input"
            />
            <button className="ai-send-btn" onClick={() => sendMessage()} aria-label="Send">➤</button>
          </div>
        </div>
      )}

      <button
        className="ai-chat-toggle"
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI Travel Assistant"
        title="AI Travel Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  );
}
