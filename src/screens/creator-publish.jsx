import { useState } from "react";
import Button from "../ui/button";
import Card from "../ui/card";
import TextField from "../ui/text-field";
import TextareaField from "../ui/textarea-field";
import { createImage } from "../lib/gallery-api";

const initialState = {
  imageFile: null,
  title: "",
  caption: "",
  location: "",
  people: "",
};

export default function CreatorPublish() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.imageFile || !form.title.trim() || !form.caption.trim()) {
      setError("Please add image, title, and caption.");
      return;
    }

    const data = new FormData();
    data.append("image", form.imageFile);
    data.append("title", form.title.trim());
    data.append("caption", form.caption.trim());
    data.append("location", form.location.trim());
    data.append("people", form.people.trim());

    setLoading(true);

    try {
      const res = await createImage(data);
      setMessage(res?.message || "Image published successfully.");
      setForm(initialState);
      setFileKey((k) => k + 1);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="hero-panel creator-hero">
        <div>
          <span className="eyebrow">Creator Studio</span>
          <h2>Publish a new image</h2>
        </div>
        <p>
          Add a photo, title, caption, and optional details for the gallery.
        </p>
      </section>

      <Card className="form-card">
        <form className="creator-form" onSubmit={handleSubmit}>
          <TextField
            key={fileKey}
            type="file"
            label="Image"
            accept="image/*"
            onChange={(e) =>
              updateField("imageFile", e.target.files?.[0] || null)
            }
            hint={
              form.imageFile ? form.imageFile.name : "Choose an image"
            }
          />

          <div className="form-grid">
            <TextField
              label="Title"
              value={form.title}
              placeholder="Image title"
              onChange={(e) => updateField("title", e.target.value)}
            />

            <TextField
              label="Location"
              value={form.location}
              placeholder="Location"
              onChange={(e) => updateField("location", e.target.value)}
            />
          </div>

          <TextareaField
            label="Caption"
            value={form.caption}
            placeholder="Write a caption"
            onChange={(e) => updateField("caption", e.target.value)}
          />

          <TextField
            label="People"
            value={form.people}
            placeholder="Names separated by commas"
            onChange={(e) => updateField("people", e.target.value)}
          />

          {message && <p className="success-banner">{message}</p>}
          {error && <p className="error-banner">{error}</p>}

          <div className="form-actions">
            <Button type="submit" isLoading={loading}>
              {loading ? "Publishing..." : "Publish"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(initialState);
                setMessage("");
                setError("");
                setFileKey((k) => k + 1);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
