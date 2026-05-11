import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  LogIn,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchNotifications } from "../lib/notifications-api";
import Button from "../ui/button";

function safeParseUser(raw) {
  try {
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function MainShell({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    return safeParseUser(localStorage.getItem("user"));
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  useEffect(() => {
    function syncAuthState() {
      const nextUser = safeParseUser(localStorage.getItem("user"));
      setUser(nextUser);
    }

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-change", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (!showNotifications || !user) return;

    let active = true;
    async function loadNotifications() {
      setLoadingNotif(true);
      try {
        const data = await fetchNotifications();
        if (!active) return;
        setNotifications(data || []);
      } catch {
        if (active) setNotifications([]);
      } finally {
        if (active) setLoadingNotif(false);
      }
    }

    loadNotifications();
    return () => {
      active = false;
    };
  }, [showNotifications, user]);

  const navItems = useMemo(() => {
    const base = [{ href: "/", label: "Explore", icon: ImageIcon }];
    if (user?.role === "creator")
      base.push({ href: "/creator", label: "Creator", icon: UploadCloud });
    return base;
  }, [user?.role]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div className="brand-copy">
            <div className="brand-title">Aurelia Frame</div>
            <div className="brand-subtitle">Visual archive workspace</div>
          </div>
        </div>

        <nav className="app-nav" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={active ? "nav-pill active" : "nav-pill"}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="app-actions">
          {user ? (
            <>
              <div className="notification-wrapper">
                <Button
                  variant="ghost"
                  className="notification-btn"
                  onClick={() => setShowNotifications((prev) => !prev)}
                  isLoading={loadingNotif && showNotifications}
                  aria-expanded={showNotifications}
                >
                  <span className="inline">
                    <Bell size={16} />
                    <span className="hide-sm">Notifications</span>
                  </span>
                  {notifications.length > 0 && (
                    <span className="badge">{notifications.length}</span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="notification-panel">
                    <div className="panel-title">Notifications</div>
                    {loadingNotif ? (
                      <div className="panel-item">Loading...</div>
                    ) : notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id || n._id} className="panel-item">
                          {n.message || n.text || "New notification"}
                        </div>
                      ))
                    ) : (
                      <div className="panel-item">No notifications</div>
                    )}

                    <button
                      className="panel-close"
                      type="button"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              <div className="user-chip">
                <span className="user-name">{user.username || "User"}</span>
              </div>

              <Button
                variant="danger"
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setUser(null);
                  window.dispatchEvent(new Event("auth-change"));
                  navigate("/", { replace: true });
                }}
              >
                <span className="inline">
                  <LogOut size={16} />
                  <span className="hide-sm">Logout</span>
                </span>
              </Button>
            </>
          ) : (
            <Link
              to="/auth"
              className={pathname === "/auth" ? "nav-pill active" : "nav-pill"}
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
