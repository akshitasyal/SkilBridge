import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGigById } from "../api/gigs";
import { createOrder } from "../api/orders";
import { createConversation } from "../api/messages";
import { useAuth } from "../context/AuthContext";

const CATEGORY_ICONS = {
  "Design": "🎨",
  "Development": "💻",
  "Marketing": "📢",
  "Writing": "✍️",
  "Video": "🎬",
  "Music": "🎵",
  "Business": "💼",
  "Data": "📊",
};

export default function GigDetail() {
  const { id } = useParams();
  const { user, isAuthenticated, openAuthModal, token } = useAuth();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("Basic");

  // Detect if the viewer is the gig owner (evaluated after gig state loads)
  const isOwner = isAuthenticated && !!user && !!gig && (
    user.id === gig.userId || user.id === gig.user?.id
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getGigById(id);
        setGig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  if (error || !gig) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center text-red-500">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="mb-2 font-bold">{error || "Gig not found"}</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Back to home</Link>
      </div>
    </div>
  );

  const joinedYear = gig.user?.createdAt
    ? new Date(gig.user.createdAt).getFullYear()
    : "2024";

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6">
      <div className="max-w-[1150px] mx-auto">

        {/* Top Navbar Context */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-[0.85rem] font-medium text-gray-500">
            <Link to="/" className="hover:text-black">🏠</Link>
            <span>/</span>
            <span className="hover:text-black cursor-pointer">{gig.category}</span>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{gig.title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-gray-500 hover:text-black font-semibold text-sm border border-transparent hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors">
              <span>☰</span> <span className="text-red-500">❤</span> 253
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors font-bold">
              ...
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <div>
            {/* Title */}
            <h1 className="text-[28px] lg:text-[32px] font-bold text-[#222325] leading-[1.3] mb-6">
              {gig.title}
            </h1>

            {/* Seller Info */}
            <div className="flex items-center gap-4 mb-8 pb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center object-cover">
                {gig.user?.profilePic ? (
                   <img src={gig.user.profilePic} alt={gig.user.username} className="w-full h-full object-cover"/>
                ) : (
                   <span className="text-lg font-bold text-gray-600">{gig.user?.username?.slice(0,2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#222325]">{gig.user?.username || "Unknown"}</span>
                  <span className="text-gray-400 font-bold text-sm">Level 2</span>
                  <span className="text-gray-400 text-sm">|</span>
                  <span className="text-gray-500 text-sm">5 orders in queue</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#222325] mt-1">
                  <span className="text-black font-bold tracking-tighter">★★★★★</span>
                  <span className="font-bold">4.8</span>
                  <span className="text-gray-400 underline ml-1 cursor-pointer hover:text-black">(144 reviews)</span>
                </div>
              </div>
            </div>

            {/* Main Media Carousel Mock */}
            <div className="w-full aspect-[16/9] bg-gray-100 mb-8 border border-gray-200 rounded-lg overflow-hidden relative group">
              {gig.image ? (
                <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[4rem]">
                  {CATEGORY_ICONS[gig.category] || "🔧"}
                </div>
              )}
              {/* Carousel Arrows */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            <div className="text-[#404145] text-base leading-relaxed">
              <h2 className="text-[#222325] font-bold text-xl mb-4">About this gig</h2>
              <p className="whitespace-pre-wrap">{gig.description}</p>
            </div>
            
          </div>

          {/* RIGHT COLUMN (Sticky Card) */}
          <div className="sticky top-24">
            
            {/* Tabbed Card Layout */}
            <div className="border border-[#dadbdd] bg-white rounded-md flex flex-col">
              
              {/* Tabs */}
              <div className="flex border-b border-[#dadbdd]">
                {["Basic", "Standard", "Premium"].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center py-4 font-bold text-[15px] border-b-2 transition-colors ${
                      activeTab === tab ? "border-[#222325] text-[#222325]" : "border-transparent text-[#74767e] hover:text-[#222325]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-bold text-[#222325] text-base uppercase tracking-wide">
                    {activeTab}
                  </span>
                  <span className="text-[#222325] text-[1.4rem] font-bold">
                    ${gig.packages && gig.packages[activeTab.toLowerCase()] 
                      ? Number(gig.packages[activeTab.toLowerCase()].price).toFixed(2) 
                      : activeTab === "Standard" ? (Number(gig.price) * 1.5).toFixed(2) : activeTab === "Premium" ? (Number(gig.price) * 2).toFixed(2) : Number(gig.price).toFixed(2)}
                  </span>
                </div>

                <p className="text-[#62646a] text-sm leading-relaxed mb-6">
                  {gig.description.substring(0, 100)}...<br/><br/>
                  Quality output + High Priority support included.
                </p>

                <div className="flex gap-4 items-center text-[#222325] font-bold text-[13px] mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">🕐</span> {gig.packages && gig.packages[activeTab.toLowerCase()] ? gig.packages[activeTab.toLowerCase()].deliveryTime : "1-day"} delivery
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">🔁</span> {gig.packages && gig.packages[activeTab.toLowerCase()] ? gig.packages[activeTab.toLowerCase()].revisions : "Unlimited"} Revisions
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2 mb-8">
                  {(gig.packages && gig.packages[activeTab.toLowerCase()]?.deliverables 
                    ? gig.packages[activeTab.toLowerCase()].deliverables.split('\n').filter(f => f.trim()) 
                    : ["Video editing", "Script writing", "30 seconds running time", "Product imagery", "Voice over recording"]
                  ).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-[#62646a] text-[14px]">
                       <span className="text-[#1dbf73] font-black">✓</span> 
                       {feature}
                    </div>
                  ))}
                </div>

                {/* CTA — Edit for owner, Continue for buyer */}
                {isOwner ? (
                  <button
                    onClick={() => navigate(`/edit-gig/${gig.id}`)}
                    className="w-full bg-[#222325] hover:bg-black text-white font-bold py-3.5 rounded text-[15px] flex items-center justify-center gap-2 transition-colors focus:ring-4 ring-gray-400/20 outline-none"
                  >
                    ✏️ Edit Gig
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) { openAuthModal("login"); return; }
                      navigate(`/checkout/${gig.id}`);
                    }}
                    className="w-full bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold py-3.5 rounded text-[15px] flex items-center justify-center gap-2 transition-colors focus:ring-4 ring-[#1dbf73]/20 outline-none"
                  >
                    Continue <span>→</span>
                  </button>
                )}
              </div>
            </div>

            {/* Contact Seller CTA — hidden for own gig */}
            {!isOwner && (
              <div className="mt-4">
                <button 
                  onClick={async () => {
                    if (!isAuthenticated) { openAuthModal("login"); return; }
                    try {
                      const conv = await createConversation(gig.user?.id, token);
                      navigate(`/messages?c=${conv.id}`);
                    } catch (err) {
                       console.error("Failed to start chat", err);
                    }
                  }}
                  className="w-full bg-white border border-[#222325] hover:bg-[#222325] hover:text-white text-[#222325] font-bold py-3.5 rounded text-[15px] transition-colors"
                 >
                  Contact me
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
