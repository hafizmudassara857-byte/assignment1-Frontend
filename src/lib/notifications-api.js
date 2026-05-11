import apiClient from "./http-client";

export async function fetchNotifications(page = 1, limit = 20) {
  const response = await apiClient.get("/notifications", {
    params: { page, limit },
  });

  return response.data.data || [];
}
