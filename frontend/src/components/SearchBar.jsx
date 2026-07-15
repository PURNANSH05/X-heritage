export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}

