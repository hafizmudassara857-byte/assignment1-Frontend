import { useState } from "react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import ImageCard from "../components/ImageCard";
import LoadingState from "../components/LoadingState";
import SearchBar from "../components/SearchBar";
import useImageFeed from "../hooks/useImageFeed";

function HomePage() {
  const [query, setQuery] = useState("");
  const { images, isLoading, errorMessage } = useImageFeed(query);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Image Library</span>
          <h2>Discover shared visual stories</h2>
        </div>
        <p>Search images by title, caption, location, or the details creators added.</p>
      </section>

      <Card className="toolbar-panel search-panel">
        <SearchBar value={query} onChange={setQuery} />
      </Card>

      {isLoading && <LoadingState label="Loading feed..." />}

      {!isLoading && errorMessage && (
        <EmptyState title="Error" body={errorMessage} />
      )}

      {!isLoading && !errorMessage && (
        <>
          {images.length > 0 ? (
            <section className="image-grid">
              {images.map((img) => (
                <ImageCard key={img.id || img._id} image={img} />
              ))}
            </section>
          ) : (
            <EmptyState
              title="No results"
              body="Try a different search term."
            />
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
