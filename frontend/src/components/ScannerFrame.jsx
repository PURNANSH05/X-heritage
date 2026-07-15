export default function ScannerFrame({ children }) {
  return (
    <div className="scanner-shell">
      <div className="scanner-viewfinder">
        <div className="scanner-corners" />
        {children}
      </div>
    </div>
  );
}

