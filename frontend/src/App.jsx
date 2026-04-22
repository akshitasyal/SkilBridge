import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AuthModal from "./components/AuthModal";
import GigDetail from "./pages/GigDetail";
import Gigs from "./pages/Gigs";
import AddGig from "./pages/AddGig";
import SellerDashboard from "./pages/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import MySales from "./pages/MySales";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyGigs from "./pages/MyGigs";
import EditGig from "./pages/EditGig";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#ffffff" }}>
        <AuthModal />
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/gigs/:id" element={<GigDetail />} />

            {/* Protected — any logged-in user */}
            <Route path="/seller-dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />

            {/* Seller Only Form — accessible via both /add-gig and /create-gig */}
            <Route path="/add-gig" element={<ProtectedRoute><AddGig /></ProtectedRoute>} />
            <Route path="/create-gig" element={<ProtectedRoute><AddGig /></ProtectedRoute>} />

            {/* Orders & Fulfillment */}
            <Route path="/checkout/:gigId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/my-sales" element={<ProtectedRoute><MySales /></ProtectedRoute>} />

            {/* Admin Hub */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* Messaging */}
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

            {/* Placeholder stubs — will be implemented in later phases */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/my-gigs" element={<ProtectedRoute><MyGigs /></ProtectedRoute>} />
            <Route path="/edit-gig/:id" element={<ProtectedRoute><EditGig /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><PlaceholderPage title="Analytics" /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

/** Temporary placeholder for pages not yet built */
function PlaceholderPage({ title }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f9fafb",
      flexDirection: "column", gap: "12px", paddingTop: "80px",
    }}>
      <div style={{ fontSize: "3rem" }}>🚧</div>
      <h1 style={{ color: "#111827", fontWeight: "800", fontSize: "1.6rem" }}>{title}</h1>
      <p style={{ color: "#6b7280" }}>Coming in a future phase.</p>
    </div>
  );
}

export default App;

