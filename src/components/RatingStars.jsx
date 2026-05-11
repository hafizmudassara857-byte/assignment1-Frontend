function RatingStars({ value, onRate, size = 'md', readonly = false, isLoading = false }) {
  return (
    <div className={`rating-group rating-${size} ${isLoading ? 'rating-loading' : ''}`.trim()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'star active' : 'star'}
          onClick={() => !readonly && !isLoading && onRate?.(star)}
          disabled={readonly || isLoading}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
      {isLoading ? <span className="rating-spinner" aria-hidden="true" /> : null}
    </div>
    
  );
}

export default RatingStars;
