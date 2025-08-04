

import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  PlusCircle,
  List,
  Layers,
  BarChart2,
  ShoppingBag,
  Settings,
  ChevronRight,
  Tractor,
  Leaf,

} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
 const handleLogout = async () => {
   try {
     await axios.post(
       "http://localhost:5000/api/users/logout",
       {},
       { withCredentials: true }
     );
     window.location.href = "/login";
   } catch (error) {
     toast.error("Logout failed");
   }
 };

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/Dashboard" },
    {
      name: "Analytics",
      icon: <BarChart2 size={20} />,
      path: "/Dashboard/analytics",
    },
    {
      name: "Products",
      icon: <Package size={20} />,
      path: "/Dashboard/products",
    },

    {
      name: "DoctorReservations",
      icon: <Layers size={20} />,
      path: "/Dashboard/DoctorReservations",
    },
    {
      name: "Add Product",
      icon: <PlusCircle size={20} />,
      path: "/Dashboard/add-product",
    },
    {
      name: "Add Veterinarian",
      icon: <PlusCircle size={20} />,
      path: "/Dashboard/AddVeterinarians",
    },
    {
      name: "Add Article",
      icon: <PlusCircle size={20} />,
      path: "/Dashboard/Add Article",
    },
    {
      name: "UserManagement",
      icon: <Settings size={20} />,
      path: "/Dashboard/UserManagement",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/Dashboard/Profile",
    },
    {
      name: "Messages",
      icon: <Settings size={20} />,
      path: "/Dashboard/ContactMessages",
    },

    {
      name: "Logout",

      isButton: true,
      onClick: handleLogout,
    }, // Button added
  ];



  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-green-800 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex items-center justify-center">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <Leaf size={24} className="text-white" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        ) : (
          <Leaf size={24} className="text-white" />
        )}
      </div>

      <div className="mt-6">
        {menuItems.map((item) =>
          item.isButton ? (
            // Render button if isButton flag is true
            <button
              key={item.name}
              onClick={item.onClick}
              className="flex items-center py-3 px-4 w-full bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              <span className="mr-4">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </button>
          ) : (
            // Render link for normal menu items
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center py-3 px-4 ${
                location.pathname === item.path
                  ? "bg-green-700"
                  : "hover:bg-green-700"
              } transition-colors duration-200`}
            >
              <span className="mr-4">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </Link>
          )
        )}
      </div>


    </div>
  );
};

export default Sidebar;
