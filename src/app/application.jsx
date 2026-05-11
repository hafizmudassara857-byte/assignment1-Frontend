import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainShell from "../layouts/main-shell";
import ExplorePhotos from "../screens/explore-photos";
import LoginSignup from "../screens/login-signup";
import CreatorPublish from "../screens/creator-publish";
import PhotoDetail from "../screens/photo-detail";
import LoadingSpinner from "../ui/loading-spinner";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw && raw !== "undefined" && raw !== "null" ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function CreatorGate() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = readUser();
    setAllowed(user?.role === "creator");
    setReady(true);
  }, []);

  if (!ready) return <LoadingSpinner label="Loading..." />;
  return allowed ? <CreatorPublish /> : <Navigate to="/" replace />;
}

export default function Application() {
  return (
    <MainShell>
      <Routes>
        <Route path="/" element={<ExplorePhotos />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/creator" element={<CreatorGate />} />
        <Route path="/images/:imageId" element={<PhotoDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainShell>
  );
}
