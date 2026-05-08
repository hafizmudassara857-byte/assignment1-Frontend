export function getImageSource(image = {}) {
  image = image || {};

  const source =
    image.imageUrl ||
    image.secureUrl ||
    image.signedUrl ||
    image.url ||
    image.src ||
    '';

  return typeof source === 'string' ? source.trim() : '';
}

export function getImageAuthor(image = {}) {
  image = image || {};

  if (typeof image.creatorId === 'object' && image.creatorId?.username) {
    return image.creatorId.username;
  }

  if (typeof image.creator === 'object' && image.creator?.username) {
    return image.creator.username;
  }

  return (
    image.author ||
    (typeof image.creator === 'string' ? image.creator : '') ||
    image.user?.username ||
    'Unknown'
  );
}

export function getImageRating(image = {}) {
  image = image || {};

  return Number(image.averageRating ?? image.rating ?? 0);
}

export function getImageCommentCount(image = {}) {
  image = image || {};

  if (typeof image.commentCount === 'number') return image.commentCount;
  if (typeof image.commentsCount === 'number') return image.commentsCount;
  if (Array.isArray(image.comments)) return image.comments.length;
  return 0;
}

export function getImageList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.images)) return payload.images;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export function normalizeImage(image = {}) {
  const id = image.id || image._id;
  const imageUrl = getImageSource(image);
  const commentCount = getImageCommentCount(image);

  return {
    ...image,
    id,
    imageUrl,
    url: image.url || imageUrl,
    author: getImageAuthor(image),
    rating: getImageRating(image),
    reviewsCount: image.ratingCount ?? image.reviewsCount ?? 0,
    commentCount,
    comments: Array.isArray(image.comments)
      ? image.comments
      : Array(commentCount).fill({}),
    people: Array.isArray(image.people)
      ? image.people
      : image.people
        ? [image.people]
        : [],
    uploadedAt: image.uploadedAt || image.createdAt || image.updatedAt || ''
  };
}

export function normalizeImageList(payload) {
  return getImageList(payload).map(normalizeImage);
}
