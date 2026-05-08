import { Link } from 'react-router-dom';
import Card from './Card';
import RatingStars from './RatingStars';
import { getImageCommentCount, getImageSource } from '../utils/normalizeImage';

function ImageCard({ image }) {
  const imageSrc = getImageSource(image);
  const commentCount = getImageCommentCount(image);
  const rating = Number(image.rating || 0);

  return (
    <Card className="image-card">
      <Link to={`/images/${image.id || image._id}`} className="image-link">
        <div className="image-frame">
          {imageSrc ? (
            <img src={imageSrc} alt={image.title || 'Uploaded image'} />
          ) : (
            <div className="image-placeholder">No image</div>
          )}
        </div>

        <div className="image-copy">
          <div className="image-copy-top">
            <div>
              <h3>{image.title}</h3>
              <p>{image.location}</p>
            </div>

            <span>{commentCount} comments</span>
          </div>

          <p className="image-caption">{image.caption}</p>

          <div className="image-meta">
            <span>By {image.author || image.creator || 'Unknown'}</span>

            <div className="image-rating">
              <RatingStars
                value={Math.round(rating)}
                readonly
                size="sm"
              />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default ImageCard;
