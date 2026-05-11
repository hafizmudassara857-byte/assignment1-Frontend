import { useEffect, useState } from "react";
import { fetchImages } from "../lib/gallery-api";
import { normalizeImageList } from "../helpers/photo-data";
import useDebouncedValue from "./use-debounced-value";

export default function useGalleryFeed(searchTerm) {
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadImages() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await fetchImages(debouncedSearch);

        if (!active) return;

        const formatted = normalizeImageList(data);

        setImages(formatted);
      } catch {
        if (active) {
          setErrorMessage("Failed to load images.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadImages();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  return { images, isLoading, errorMessage };
}
