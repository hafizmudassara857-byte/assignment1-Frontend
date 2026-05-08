function Button({
  children,
  className = '',
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${isLoading ? 'is-loading' : ''} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
      <span className="button-content">{children}</span>
    </button>
  );
}

export default Button;
