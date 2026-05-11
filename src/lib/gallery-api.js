import apiClient from "./http-client";
import { getImageList } from "../helpers/photo-data";

export async function fetchImages(searchTerm = "", page = 1, limit = 10) {
  if (searchTerm && searchTerm.trim()) {
    const res = await apiClient.get("/search", {
      skipAuth: true,
      params: {
        q: searchTerm,
        page,
        limit,
      },
    });
    return getImageList(res.data);
  }

  const res = await apiClient.get("/images", {
    skipAuth: true,
    params: {
      page,
      limit,
    },
  });
  return getImageList(res.data);
}

export async function createImage(payload) {
  const response = await apiClient.post("/images/upload", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function addComment(imageId, comment) {
  const response = await apiClient.post(`/images/${imageId}/comments`, {
    text: comment.text,
  });
  return response.data?.data || response.data;
}

export async function submitRating(imageId, rating) {
  const response = await apiClient.post(`/images/${imageId}/rate`, { rating });
  return response.data?.data || response.data;
}

export async function fetchImageById(imageId) {
  const response = await apiClient.get(`/images/${imageId}`, {
    skipAuth: true,
  });
  return response.data?.data || response.data;
}
