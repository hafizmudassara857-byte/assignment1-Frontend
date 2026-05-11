import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/button";
import Card from "../ui/card";
import TextField from "../ui/text-field";
import { loginUser, signupUser } from "../lib/auth-api";

export default function LoginSignup() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let storedUser = null;

    try {
      storedUser = localStorage.getItem("user");
    } catch {
      storedUser = null;
    }

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    Object.keys(payload).forEach((key) => {
      payload[key] = payload[key].trim();
    });
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginUser(payload);
        const token =
          data?.token ||
          data?.accessToken ||
          data?.data?.token ||
          data?.data?.accessToken;
        const user =
          data?.user || data?.data?.user || data?.profile || null;

        if (!token || !user) {
          throw new Error("Invalid login response from server.");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("auth-change"));

        setMessage("Login successful.");
        navigate("/", { replace: true });
      } else {
        await signupUser(payload);
        setMessage("Account created successfully.");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-copy">
        <h2>Welcome back</h2>
        <p>Login or create an account to continue.</p>
      </section>

      <Card className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "toggle-tab active" : "toggle-tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={
              mode === "signup" ? "toggle-tab active" : "toggle-tab"
            }
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
          />

          {mode === "signup" && (
            <>
              <TextField
                label="Username"
                name="username"
                placeholder="Enter username"
              />
              <label className="field">
                <span className="field-label">Role</span>
                <select
                  name="role"
                  defaultValue="creator"
                  className="input-field"
                >
                  <option value="creator">Creator</option>
                  <option value="consumer">Consumer</option>
                </select>
              </label>
            </>
          )}

          {message && <p className="success-banner">{message}</p>}

          <Button type="submit" isLoading={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
