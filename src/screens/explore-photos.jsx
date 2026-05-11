import { useState } from "react";
import Card from "../ui/card";
import EmptyMessage from "../ui/empty-message";
import PhotoTile from "../ui/photo-tile";
import LoadingSpinner from "../ui/loading-spinner";
import SearchField from "../ui/search-field";
import useGalleryFeed from "../hooks/use-gallery-feed";

export default function ExplorePhotos() {
  const [query, setQuery] = useState("");
  const { images, isLoading, errorMessage } = useGalleryFeed(query);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Image Library</span>
          <h2>Discover shared visual stories</h2>
        </div>
        <p>
          Search images by title, caption, location, or the details creators
          added.
        </p>
      </section>

      <Card className="toolbar-panel search-panel">
        <SearchField value={query} onChange={setQuery} />
      </Card>

      {isLoading && <LoadingSpinner label="Loading feed..." />}

      {!isLoading && errorMessage && (
        <EmptyMessage title="Error" body={errorMessage} />
      )}

      {!isLoading && !errorMessage && (
        <>
          {images.length > 0 ? (
            <section className="image-grid">
              {images.map((img) => (
                <PhotoTile key={img.id || img._id} image={img} />
              ))}
            </section>
          ) : (
            <EmptyMessage
              title="No results"
              body="Try a different search term."
            />
          )}
        </>
      )}
    </div>
  );
}
