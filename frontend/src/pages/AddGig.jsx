import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../api/gigs";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Music",
  "Business",
  "Data",
];

export default function AddGig() {
  const navigate = useNavigate();
  const { token, isSeller } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    image: "",
    packages: {
      basic: { price: "", revisions: "1", deliveryTime: "1 day", deliverables: "" },
      standard: { price: "", revisions: "3", deliveryTime: "3 days", deliverables: "" },
      premium: { price: "", revisions: "Unlimited", deliveryTime: "5 days", deliverables: "" }
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef(null);

  if (!isSeller) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ color: "#ef4444", fontWeight: "800", fontSize: "1.5rem" }}>Sellers Only</h2>
        <p style={{ color: "#6b7280", textAlign: "center", maxWidth: "320px" }}>
          You need a seller account to post gigs.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{ marginTop: "8px", padding: "10px 24px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#059669", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePackageChange = (tier, field, value) => {
    setFormData((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [tier]: {
          ...prev.packages[tier],
          [field]: value
        }
      }
    }));
  };

  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => readFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setPreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError("Please upload a gig cover image.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await createGig(
        { 
          ...formData, 
          price: Number(formData.packages.basic.price) 
        },
        token
      );
      setSuccess(true);
      setTimeout(() => navigate("/gigs"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "#fff",
    border: "1px solid #94a3b8",
    borderRadius: "6px",
    color: "#334155",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    color: "#475569",
    marginBottom: "10px",
    fontSize: "0.85rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.03em"
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "120px 1.5rem 80px",
      background: "#fafafa",
    }}>
      <div style={{
        maxWidth: "960px",
        margin: "0 auto",
      }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0" }}>
            Create a new Gig
          </h1>
          <p style={{ color: "#64748b", fontSize: "1rem", margin: 0 }}>
            Enter the details below to reach thousands of potential buyers.
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "48px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
        }}>
          
          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #dcfce7", color: "#15803d", padding: "14px 16px", borderRadius: "6px", marginBottom: "32px", fontWeight: "600", fontSize: "0.9rem" }}>
              ✅ Gig published! Redirecting to marketplace…
            </div>
          )}

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "14px 16px", borderRadius: "6px", marginBottom: "32px", fontSize: "0.9rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

            {/* Row 1: Title & Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div>
                <label style={labelStyle}>Gig Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. I will do something I'm really good at"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#10b981"}
                  onBlur={e => e.target.style.borderColor = "#94a3b8"}
                />
              </div>
              <div>
                <label style={labelStyle}>Select a Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                  onFocus={e => e.target.style.borderColor = "#10b981"}
                  onBlur={e => e.target.style.borderColor = "#94a3b8"}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label style={labelStyle}>Gig Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Write a clear and detailed description of your gig"
                style={{ ...inputStyle, minHeight: "180px", resize: "vertical", lineHeight: "1.6" }}
                onFocus={e => e.target.style.borderColor = "#10b981"}
                onBlur={e => e.target.style.borderColor = "#94a3b8"}
              />
            </div>

            {/* Row 3: Packages Configuration */}
            <div>
              <label style={labelStyle}>Packages & Pricing</label>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  {["basic", "standard", "premium"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1, padding: "14px", fontWeight: "700", fontSize: "0.95rem",
                        textTransform: "capitalize", border: "none", cursor: "pointer",
                        background: activeTab === tab ? "#fff" : "transparent",
                        color: activeTab === tab ? "#1dbf73" : "#64748b",
                        borderBottom: activeTab === tab ? "2px solid #1dbf73" : "2px solid transparent",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: "24px", display: "grid", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div>
                      <label style={labelStyle}>Price (USD)</label>
                      <input
                        type="number"
                        min="5"
                        value={formData.packages[activeTab].price}
                        onChange={(e) => handlePackageChange(activeTab, "price", e.target.value)}
                        required
                        placeholder={activeTab === "basic" ? "50" : activeTab === "standard" ? "100" : "150"}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Revisions</label>
                      <input
                        type="text"
                        value={formData.packages[activeTab].revisions}
                        onChange={(e) => handlePackageChange(activeTab, "revisions", e.target.value)}
                        required
                        placeholder="e.g. 1, 3, or Unlimited"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Delivery Time</label>
                    <input
                      type="text"
                      value={formData.packages[activeTab].deliveryTime}
                      onChange={(e) => handlePackageChange(activeTab, "deliveryTime", e.target.value)}
                      required
                      placeholder="e.g. 1 day"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Deliverables (One per line)</label>
                    <textarea
                      value={formData.packages[activeTab].deliverables}
                      onChange={(e) => handlePackageChange(activeTab, "deliverables", e.target.value)}
                      required
                      placeholder="e.g.&#10;Video editing&#10;Script writing&#10;Voice over"
                      style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Image Upload */}
            <div>
              <label style={labelStyle}>Gig Image Cover *</label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="gig-image-upload"
              />

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
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${dragOver ? "#10b981" : "#cbd5e1"}`,
                    borderRadius: "6px",
                    padding: "40px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "#f0fdf4" : "#f8fafc",
                    transition: "all 0.2s",
                    height: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "600", margin: 0 }}>
                    Click or drag an image here
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                type="submit"
                disabled={loading || success}
                style={{
                  padding: "16px 48px",
                  background: loading || success ? "#10b981" : "#1dbf73",
                  color: "#fff",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  border: "none",
                  cursor: loading || success ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  opacity: loading || success ? 0.8 : 1,
                }}
                onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.background = "#059669"; }}
                onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.background = "#1dbf73"; }}
              >
                {loading ? "Publishing…" : success ? "Published" : "Create Gig"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
