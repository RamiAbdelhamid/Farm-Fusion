import { Fragment, useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../Shared/CartContext";
import { useWishlist } from "../Shared/WishlistContext";
import { Heart as HeartOutline, Heart as HeartFilled } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe } from "lucide-react";

  /**************************************************************************************************** */

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gg, setgg] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { wishlist } = useWishlist();
  const [navigation, setNavigation] = useState([]);

  // Navigation items with translations
  /**************************************************************************************************** */
  useEffect(() => {
    setNavigation([
      { name: t("home"), to: "/" },
      { name: t("shop"), to: "/Shop" },
      { name: t("veterinarians"), to: "/veterinarians" },
      {
        name: t("reservations"),
        to: "./Reservations",
        hideFor: "user",
      },
      { name: t("healthGuide"), to: "/HealthGuide" },
      { name: t("about"), to: "/about" },
      { name: t("contact"), to: "/contact" },
      { name: t("PlantDiseaseDetector"), to: "/plant-disease-detect" },
    ]);
  }, [t, i18n.language]);
  /**************************************************************************************************** */

  // Cart context
  /**************************************************************************************************** */

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    cartTotal,
    showCart,
    setShowCart,
  } = useCart();
  /**************************************************************************************************** */

  const location = useLocation();
  const navigate = useNavigate();

  /**************************************************************************************************** */
  // handel scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  /**************************************************************************************************** */

  /**************************************************************************************************** */

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/get-role",
          { withCredentials: true }
        );
        setgg(response.data.userId);

        if (isMounted && response.data && response.data.userId) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
          setIsLoggedIn(true);
          setLoading(false);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          setIsLoggedIn(false);
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []);
  /**************************************************************************************************** */

  /**************************************************************************************************** */
  useEffect(() => {
    console.log("Updated isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const filteredNavigation = navigation.filter((item) => {
    if (!isAuthenticated) {
      return (
        item.name === t("home") ||
        item.name === t("shop") ||
        item.name === t("veterinarians") ||
        item.name === t("healthGuide") ||
        item.name === t("about") ||
        item.name === t("contact") ||
        item.name === t("PlantDiseaseDetector")
      );
    } else if (userRole === "user" || gg) {
      if (userRole === "veterinarian") {
        return true;
      } else {
        return (
          item.name === t("home") ||
          item.name === t("shop") ||
          item.name === t("veterinarians") ||
          item.name === t("healthGuide") ||
          item.name === t("about") ||
          item.name === t("contact")||
          item.name === t("PlantDiseaseDetector")
        );
      }
    } else if (userRole === "veterinarian") {
      return true;
    }
    return false;
  });
  /**************************************************************************************************** */

  /**************************************************************************************************** */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setUpdatedUser({
          name: res.data.user.name,
          email: res.data.user.email,
          profilePicture: res.data.user.profilePicture,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || t("fetchUserError"));
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [t]);
  /**************************************************************************************************** */

  /****************************************************************** */
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("arabic-font", i18n.language === "ar");
  }, [i18n.language]);
  /****************************************************************** */

  /**************************************************************************************************** */
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);
  /**************************************************************************************************** */

  /**************************************************************************************************** */
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      toast.success(t("logoutSuccess"));
      setIsLoggedIn(false);
      setIsAuthenticated(false);
      setUserRole(null);
      navigate("/");
    } catch (error) {
      toast.error(t("logoutFailed"));
      console.error("Logout error:", error);
    }
  };
  /**************************************************************************************************** */

  if (loading) {
    return null;
  }

  return (
    <>
      <Disclosure
        as="nav"
        className={`transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-green-800 shadow-lg"
            : "bg-gradient-to-r from-green-600 to-green-700"
        }`}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-20 items-center justify-between">
                {/* Mobile menu button */}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <DisclosureButton className="relative inline-flex items-center justify-center p-2 rounded-md text-green-100 hover:text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200">
                    <span className="sr-only">{t("openMenu")}</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>

                {/* Logo and desktop navigation */}
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 ml-5 bg-white rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-transform duration-200">
                        <a href="/">
                          <span className="text-2xl cursor-pointer">🌿</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:ml-6 sm:block">
                    <div
                      className={`flex ${
                        i18n.language === "ar"
                          ? "space-x-reverse space-x-1"
                          : "space-x-2"
                      }`}
                    >
                      {filteredNavigation.map((item) => {
                        const isCurrent = location.pathname === item.to;
                        return (
                          <Link
                            key={item.name}
                            to={item.to}
                            className={`
    ${i18n.language === "ar" ? "px-2 py-1 text-sm" : "px-3 py-2 text-base"}
    rounded-md font-medium group relative overflow-hidden
    ${
      isCurrent
        ? "bg-green-800 text-white"
        : "text-green-100 hover:bg-green-800/60 hover:text-white"
    }
    transition-all duration-200 ease-in-out
  `}
                          >
                            <span className="relative z-10 flex items-center space-x-1">
                              <span
                                className={`transform group-hover:scale-110 transition-transform duration-200 ${
                                  i18n.language === "ar"
                                    ? "order-2 ml-6"
                                    : "order-1 mr-1"
                                }`}
                              >
                                {item.icon}
                              </span>
                              <span>{item.name}</span>
                            </span>

                            {!isCurrent && (
                              <span className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* User menu or auth buttons */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Language Toggle Button */}
                  {/* <button
                    onClick={() =>
                      i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
                    }
                    className={`mr-4 px-3 py-1 text-sm rounded bg-white text-green-800 hover:bg-green-100 transition duration-200 shadow ${
                      i18n.language === "ar" ? "font-arabic" : ""
                    }`}
                  >
                    {i18n.language === "en" ? "عربي" : "English"}
                  </button> */}

                  <Menu
                    as="div"
                    className="relative inline-block text-left mr-4"
                  >
                    <Menu.Button className="inline-flex items-center ml-6 mr-4 px-2 py-1 bg-white text-green-800 rounded shadow hover:bg-green-100 transition duration-200">
                      <Globe className="w-5 h-5 mr-1" />
                      <ChevronDown className="w-4 h-4" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => i18n.changeLanguage("en")}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                              i18n.language === "en" ? "font-semibold" : ""
                            }`}
                          >
                            🇺🇸 English
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => i18n.changeLanguage("ar")}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                              i18n.language === "ar" ? "font-semibold" : ""
                            }`}
                          >
                            🇸🇦 العربية
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => i18n.changeLanguage("fr")}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                              i18n.language === "fr" ? "font-semibold" : ""
                            }`}
                          >
                            🇫🇷 Français
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>

                  {/* Cart Button */}
                  <button
                    onClick={() => setShowCart(true)}
                    className="relative p-2 mr-4 text-green-100 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-green-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <Link
                    to="/wishlist"
                    className="relative p-2 mr-6 ml-6 text-green-100 hover:text-white transition-colors duration-200"
                  >
                    {wishlist.length > 0 ? (
                      <HeartFilled className="h-6 w-6 text-white-500" />
                    ) : (
                      <HeartOutline className="h-6 w-6" />
                    )}
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-green-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  {isLoggedIn ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <MenuButton className="flex rounded-full bg-green-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700 transition-all duration-200 hover:ring-2 transform hover:scale-105">
                          <span className="sr-only">{t("openUserMenu")}</span>
                          <img
                            className="h-13 w-13  rounded-full border-2 border-white cursor-pointer"
                            src={
                              user
                                ? `http://localhost:5000${user.profilePicture}`
                                : "/api/placeholder/40/40"
                            }
                            alt={t("userProfile")}
                          />
                        </MenuButton>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to="/userprofile"
                                className={`${
                                  active ? "bg-green-100" : ""
                                } block px-4 py-2 text-sm text-gray-700 transition-colors duration-200`}
                              >
                                {t("yourProfile")}
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? "bg-green-100" : ""
                                } block w-full text-left px-4 py-2 text-sm text-gray-700 transition-colors duration-200 cursor-pointer`}
                              >
                                {t("signOut")}
                              </button>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="flex space-x-2">
                      <Link
                        to="/login"
                        className="relative overflow-hidden px-3 py-1.5 text-white bg-green-800 hover:bg-green-900 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        <span className="relative z-10">{t("login")}</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                      </Link>
                      <Link
                        to="/signup"
                        className="relative overflow-hidden px-3 py-1.5 text-green-800 bg-white hover:bg-green-50 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        <span className="relative z-10">{t("signUp")}</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-green-50 to-white opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu panel */}
            <Transition
              as={Fragment}
              enter="transition duration-200 ease-out"
              enterFrom="transform -translate-y-3 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition duration-150 ease-in"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-3 opacity-0"
            >
              <DisclosurePanel className="sm:hidden bg-green-700 shadow-inner">
                <div className="space-y-1 px-3 pb-3 pt-2">
                  {filteredNavigation.map((item) => {
                    const isCurrent = location.pathname === item.to;
                    return (
                      <DisclosureButton
                        key={item.name}
                        as={Link}
                        to={item.to}
                        className={`
                          flex items-center space-x-3 rounded-md px-4 py-3 text-base font-medium
                          ${
                            isCurrent
                              ? "bg-green-800 text-white"
                              : "text-green-100 hover:bg-green-800/70 hover:text-white"
                          }
                          transition-all duration-200
                        `}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                      </DisclosureButton>
                    );
                  })}
                  {!isLoggedIn && (
                    <div className="mt-4 flex flex-col space-y-2 pt-3 border-t border-green-600">
                      <DisclosureButton
                        as={Link}
                        to="/login"
                        className="flex justify-center rounded-md bg-green-800 px-4 py-3 text-base font-medium text-white hover:bg-green-900 transition-colors duration-200"
                      >
                        {t("login")}
                      </DisclosureButton>
                      <DisclosureButton
                        as={Link}
                        to="/signup"
                        className="flex justify-center rounded-md bg-white px-4 py-3 text-base font-medium text-green-800 hover:bg-green-50 transition-colors duration-200"
                      >
                        {t("signUp")}
                      </DisclosureButton>
                    </div>
                  )}
                </div>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-150 overflow-hidden">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
            onClick={() => setShowCart(false)}
          ></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {t("shoppingCart")}
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowCart(false)}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-8">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                          {t("emptyCart")}
                        </h3>
                        <p className="mt-1 text-gray-500">
                          {t("startShopping")}
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => setShowCart(false)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            {t("continueShopping")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200">
                          {cartItems.map((item) => (
                            <li key={item._id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={`http://localhost:5000${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">
                                      {(item.price * item.quantity).toFixed(2)}{" "}
                                      {t("jd")}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.category}
                                  </p>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center border rounded-lg">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.quantity - 1
                                        )
                                      }
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item._id,
                                          item.quantity + 1
                                        )
                                      }
                                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="flex">
                                    <button
                                      onClick={() => removeFromCart(item._id)}
                                      type="button"
                                      className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      {t("remove")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>{t("subtotal")}</p>
                      <p>
                        {cartTotal} {t("jd")}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {t("shippingCalc")}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setShowCart(false);
                          navigate("/checkout");
                        }}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        {t("checkout")}
                      </button>
                    </div>
                    <div className="mt-4 flex justify-center text-sm text-gray-500">
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-500 font-medium"
                      >
                        {t("clearCart")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;