import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import AuthPage from "./pages/AuthPage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage";
import HomePage from "./pages/HomePage";
import ImageDetailPage from "./pages/ImageDetailPage";
import LoadingState from "./components/LoadingState";
import { useEffect, useState } from "react";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw && raw !== "undefined" && raw !== "null" ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function CreatorRoute() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = readUser();
    setAllowed(user?.role === "creator");
    setReady(true);
  }, []);

  if (!ready) return <LoadingState label="Loading..." />;
  return allowed ? <CreatorDashboardPage /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/creator" element={<CreatorRoute />} />
        <Route path="/images/:imageId" element={<ImageDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
