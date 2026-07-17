import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import ListingsGrid from "./pages/ListingsGrid";
import ListingDetails from "./pages/ListingDetails";
import ListingForm from "./pages/ListingForm";
import AuthForm from "./pages/AuthForm";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";

function App() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* Responsive Glass Navbar */}
          <Navbar onSearch={setSearchKeyword} />

          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* Default Redirect to listings grid */}
              <Route path="/" element={<Navigate to="/listings" replace />} />

              {/* Listings routes */}
              <Route
                path="/listings"
                element={<ListingsGrid searchKeyword={searchKeyword} />}
              />
              <Route path="/listings/new" element={<ListingForm />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/listings/:id/edit" element={<ListingForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trips" element={<MyTrips />} />

              {/* Auth routes */}
              <Route path="/login" element={<AuthForm />} />
              <Route path="/signup" element={<AuthForm />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/listings" replace />} />
            </Routes>
          </main>

          {/* Elegant Footer */}
          <Footer />
        </div>

        {/* Hot Toasts notification popup styling */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#FFFFFF",
              color: "var(--text-main)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              boxShadow: "var(--shadow-lg)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              padding: "12px 24px",
            },
            success: {
              iconTheme: {
                primary: "var(--color-primary)",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
