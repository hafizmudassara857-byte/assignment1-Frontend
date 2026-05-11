export default function LoadingSpinner({ label = "Loading content..." }) {
  return (
    <div className="loading-state" aria-live="polite">
      <span className="loading-dot" />
      <p>{label}</p>
    </div>
  );
}
