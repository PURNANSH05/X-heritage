export default function Badge({ children, tone = 'teal' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

