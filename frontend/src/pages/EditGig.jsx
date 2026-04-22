import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGigById, updateGig } from "../api/gigs";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Design", "Development", "Marketing", "Writing",
  "Video", "Music", "Business", "Data",
];

export default function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, isSeller } = useAuth();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [imageChanged, setImageChanged] = useState(false);
  const fileInputRef = useRef(null);

  // Load existing gig data
  useEffect(() => {
    (async () => {
      try {
        const gig = await getGigById(id);
        // Verify ownership
        if (gig.userId !== user?.id && gig.user?.id !== user?.id) {
          setError("You are not authorised to edit this gig.");
          setLoading(false);
          return;
        }
        const pkgs = gig.packages || {};
        setFormData({
          title: gig.title || "",
          description: gig.description || "",
          category: gig.category || CATEGORIES[0],
          image: gig.image || "",
          packages: {
            basic: pkgs.basic || { price: "", revisions: "1", deliveryTime: "1 day", deliverables: "" },
            standard: pkgs.standard || { price: "", revisions: "3", deliveryTime: "3 days", deliverables: "" },
            premium: pkgs.premium || { price: "", revisions: "Unlimited", deliveryTime: "5 days", deliverables: "" },
          },
        });
        if (gig.image) setPreview(gig.image);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  if (!isSeller) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ color: "#ef4444", fontWeight: "800", fontSize: "1.5rem" }}>Sellers Only</h2>
        <p style={{ color: "#6b7280", textAlign: "center", maxWidth: "320px" }}>
          You need a seller account to edit gigs.
        </p>
        <button onClick={() => navigate("/")} style={{ marginTop: "8px", padding: "10px 24px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#059669", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
          ← Back to Home
        </button>
      </div>
    );
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ width: "48px", height: "48px", border: "4px solid #e5e7eb", borderTopColor: "#1dbf73", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  if (error && !formData) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", flexDirection: "column", gap: "12px" }}>
      <div style={{ fontSize: "3rem" }}>⚠️</div>
      <h2 style={{ color: "#ef4444", fontWeight: "700" }}>{error}</h2>
      <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#059669", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>← Go Back</button>
    </div>
  );

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePackageChange = (tier, field, value) => {
    setFormData((prev) => ({
      ...prev,
      packages: { ...prev.packages, [tier]: { ...prev.packages[tier], [field]: value } },
    }));
  };

  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be smaller than 5 MB."); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
      setImageChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageChanged(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview && !formData.image) {
      setError("Please upload a gig cover image.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateGig(
        id,
        { ...formData, price: Number(formData.packages.basic.price) },
        token
      );
      setSuccess(true);
      setTimeout(() => navigate(`/gigs/${id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "#fff",
    border: "1px solid #94a3b8", borderRadius: "6px", color: "#334155",
    fontSize: "0.95rem", fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", color: "#475569", marginBottom: "10px",
    fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.03em",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "120px 1.5rem 80px", background: "#fafafa" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", paddingLeft: "8px", display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => navigate(`/gigs/${id}`)} style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff", cursor: "pointer", fontWeight: "600", color: "#64748b", fontSize: "0.9rem" }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" }}>
              Edit Gig
            </h1>
            <p style={{ color: "#64748b", fontSize: "1rem", margin: 0 }}>
              Update your gig details below.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "48px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>

          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #dcfce7", color: "#15803d", padding: "14px 16px", borderRadius: "6px", marginBottom: "32px", fontWeight: "600", fontSize: "0.9rem" }}>
              ✅ Gig updated! Redirecting…
            </div>
          )}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "14px 16px", borderRadius: "6px", marginBottom: "32px", fontSize: "0.9rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

            {/* Title & Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div>
                <label style={labelStyle}>Gig Title *</label>
                <input
                  name="title" value={formData.title} onChange={handleChange}
                  required placeholder="e.g. I will design a stunning logo"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#10b981"}
                  onBlur={e => e.target.style.borderColor = "#94a3b8"}
                />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  required style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                  onFocus={e => e.target.style.borderColor = "#10b981"}
                  onBlur={e => e.target.style.borderColor = "#94a3b8"}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Gig Description *</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                required placeholder="Write a clear and detailed description of your gig"
                style={{ ...inputStyle, minHeight: "180px", resize: "vertical", lineHeight: "1.6" }}
                onFocus={e => e.target.style.borderColor = "#10b981"}
                onBlur={e => e.target.style.borderColor = "#94a3b8"}
              />
            </div>

            {/* Packages */}
            <div>
              <label style={labelStyle}>Packages & Pricing *</label>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  {["basic", "standard", "premium"].map((tab) => (
                    <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                      style={{ flex: 1, padding: "14px", fontWeight: "700", fontSize: "0.95rem", textTransform: "capitalize", border: "none", cursor: "pointer", background: activeTab === tab ? "#fff" : "transparent", color: activeTab === tab ? "#1dbf73" : "#64748b", borderBottom: activeTab === tab ? "2px solid #1dbf73" : "2px solid transparent" }}>
                      {tab}
                    </button>
                  ))}
                </div>
                <div style={{ padding: "24px", display: "grid", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div>
                      <label style={labelStyle}>Price (USD) *</label>
                      <input type="number" min="5" required
                        value={formData.packages[activeTab].price}
                        onChange={(e) => handlePackageChange(activeTab, "price", e.target.value)}
                        placeholder={activeTab === "basic" ? "50" : activeTab === "standard" ? "100" : "150"}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Revisions *</label>
                      <input type="text" required
                        value={formData.packages[activeTab].revisions}
                        onChange={(e) => handlePackageChange(activeTab, "revisions", e.target.value)}
                        placeholder="e.g. 1, 3, or Unlimited" style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Delivery Time *</label>
                    <input type="text" required
                      value={formData.packages[activeTab].deliveryTime}
                      onChange={(e) => handlePackageChange(activeTab, "deliveryTime", e.target.value)}
                      placeholder="e.g. 1 day" style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Deliverables (one per line) *</label>
                    <textarea required
                      value={formData.packages[activeTab].deliverables}
                      onChange={(e) => handlePackageChange(activeTab, "deliverables", e.target.value)}
                      placeholder={"e.g.\nVideo editing\nScript writing\nVoice over"}
                      style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label style={labelStyle}>Gig Cover Image *</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => readFile(e.target.files[0])} style={{ display: "none" }} id="gig-image-upload" />

              {preview ? (
                <div style={{ position: "relative", borderRadius: "6px", overflow: "hidden", border: "1px solid #e2e8f0", height: "300px" }}>
                  <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "16px", right: "16px", display: "flex", gap: "8px" }}>
                    <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: "8px 16px", borderRadius: "4px", background: "#fff", border: "1px solid #e2e8f0", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Change</button>
                    <button type="button" onClick={removeImage} style={{ padding: "8px 16px", borderRadius: "4px", background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); readFile(e.dataTransfer.files[0]); }}
                  style={{ border: `2px dashed ${dragOver ? "#10b981" : "#cbd5e1"}`, borderRadius: "6px", padding: "40px", textAlign: "center", cursor: "pointer", background: dragOver ? "#f0fdf4" : "#f8fafc", transition: "all 0.2s", height: "300px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🖼️</div>
                  <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "600", margin: 0 }}>Click or drag an image here</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "6px" }}>PNG, JPG, WEBP — max 5 MB</p>
                </div>
              )}
            </div>

            {/* Save button */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              <button type="button" onClick={() => navigate(`/gigs/${id}`)}
                style={{ padding: "16px 32px", background: "#fff", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "6px", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving || success}
                style={{ padding: "16px 48px", background: saving || success ? "#10b981" : "#1dbf73", color: "#fff", borderRadius: "6px", fontWeight: "700", fontSize: "1rem", border: "none", cursor: saving || success ? "not-allowed" : "pointer", transition: "background 0.2s", opacity: saving || success ? 0.8 : 1 }}
                onMouseEnter={e => { if (!saving && !success) e.currentTarget.style.background = "#059669"; }}
                onMouseLeave={e => { if (!saving && !success) e.currentTarget.style.background = "#1dbf73"; }}
              >
                {saving ? "Saving…" : success ? "Saved ✓" : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
