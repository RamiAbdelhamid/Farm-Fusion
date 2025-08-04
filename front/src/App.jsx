import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Component/Shared/Navbar";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Footer from "./Component/Shared/Footer";
import Login from "./Pages/Login";
import Userprofile from "./Pages/Userprofile";
import Veterinarians from "./Pages/Veterinarians";
import Shop from "./Pages/Shop";
import ProductDetails from "./Pages/ProductDetails";
import Checkout from "./Pages/Checkout";
import SignUp from "./Pages/SignUp";
import ProceedToPayment from "./Pages/ProceedToPayment";
import AddProduct from "../src/Dashboard/AddProduct";
import Dashboard from "../src/Dashboard/Dashboard";
import EditProduct from "../src/Dashboard/EditProduct";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MainDash from "./Dashboard/MainDashboard";
import HealthGuide from "./Pages/HealthGuide";
import Wishlist from "./Pages/Wishlist";
import Reservations from "./Pages/Reservations";
// import WhatsAppIcon from "./Component/Shared/WhatsAppIcon";
import AgriChatBot from "./Component/Shared/AgriChatBot";
import BackToTopButton from "./Component/Shared/BackToTopButton"; // Import the BackToTopButton
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import Faq from "./Pages/Faq"; // Import the FAQ component
import PlantDiseaseDetector from "./Pages/PlantDiseaseDetector";
  import ProtectedRoute from "./Dashboard/ProtectedRoute"; // Import the ProtectedRoute component
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userRole, setUserRole] = useState("");

  // Routes where Navbar and Footer shouldn't appear
  const noNavbarFooterRoutes = [
    "/login",
    "/signup",
    "/Dashboard/add-product",
    "/edit-product",
    "/Dashboard",
    "/dashboard",
  ];

  // Routes where chat widgets shouldn't appear
  const noChatRoutes = [
    "/Dashboard",
    "/dashboard",
    // Add other routes where you don't want chat widgets to appear
  ];

  // Determine if Navbar and Footer should be shown based on the route
  const showNavbarFooter = !noNavbarFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Determine if chat widgets should be shown
  const showChatWidgets = !noChatRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {showNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
<Route
  path="/login"
  element={<Login onLogin={() => setIsAuthenticated(true)} setUserRole={setUserRole} />}
/>
        <Route path="/userprofile" element={<Userprofile />} />
        <Route path="/veterinarians" element={<Veterinarians />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/proceed-to-payment" element={<ProceedToPayment />} />
        <Route path="/add-product" element={<AddProduct />} />
  <Route
          path="/Dashboard/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainDash />
            </ProtectedRoute>
          }
        />        <Route path="/edit-product/:id" element={<EditProduct />} />

        <Route path="/healthguide" element={<HealthGuide />} />
        <Route path="/wishlist" element={<Wishlist />} />
<Route
  path="/Reservations"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="veterinarian" userRole={userRole}>
      <Reservations />
    </ProtectedRoute>
  }
/>
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/plant-disease-detect" element={<PlantDiseaseDetector />} />
        {/* Add other routes here */}
      </Routes>
      {showNavbarFooter && <Footer />}

      {/* Back to top button - shown on all pages except dashboard */}
      {showNavbarFooter && <BackToTopButton />}

      {/* Agriculture themed chatbot with chicken/rooster icon */}
      {showChatWidgets && (
        <AgriChatBot
          position={{ bottom: "20px", right: "20px" }}
          profileName="Farm Helper"
          welcomeText="Hello! 🐓 Welcome to our farm and pet care website. How can I assist you today?"
          phoneNumber="+962785956180" // Replace with your actual WhatsApp number
        />
      )}

      {/* WhatsApp icon - positioned to avoid overlap with the chatbot
         Note: Only include this if you want both widgets */}
      {/* {showChatWidgets && (
        <WhatsAppIcon
          position={{ bottom: "20px", right: "100px" }} // Offset to avoid overlap with chatbot
          phoneNumber="+962785956180" // Replace with your actual WhatsApp number
          profileName="Farm Support Team"
          profileImage="../src/assets/pic/User-Icon.jpg" // Replace with your actual profile image URL
          welcomeText="Need direct assistance? Our farm experts are ready to help!"
        />
      )} */}
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="708338751810-vs4526i07didjadt2vhqgrgu1vnr3ib8.apps.googleusercontent.com">
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
