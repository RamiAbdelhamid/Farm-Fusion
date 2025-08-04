import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from "./Component/Shared/CartContext.jsx";
import { WishlistProvider } from "./Component/Shared/WishlistContext.jsx";
import { CookiesProvider } from "react-cookie";
import './i18n'; // ← استيراد i18n

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CookiesProvider>
     <WishlistProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </WishlistProvider>
    </CookiesProvider>
  </StrictMode>,
);



