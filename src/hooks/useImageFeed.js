import { useEffect, useState } from 'react';
import { fetchImages } from '../services/imageService';
import { normalizeImageList } from '../utils/normalizeImage';
import useDebouncedValue from './useDebouncedValue';

function useImageFeed(searchTerm) {
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadImages() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchImages(debouncedSearch);

        if (!active) return;

        const formatted = normalizeImageList(data);

        setImages(formatted);
      } catch (err) {
        if (active) {
          setErrorMessage('Failed to load images.');
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

export default useImageFeed;
