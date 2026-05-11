export default function TextareaField({ label, hint, className = "", ...props }) {
  return (
    <label className={`field ${className}`.trim()}>
      <span className="field-label">{label}</span>
      <textarea className="field-input field-textarea" {...props} />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}
