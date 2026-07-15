export default function FilterChips({ items, value, onChange }) {
  return (
    <div className="chips" role="tablist" aria-label="Filters">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`chip ${value === item ? 'chip-active' : ''}`}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
