import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import EditProductList from "./EditProductList";
import AddProduct from "./AddProduct";
import Analytics from "./Analytics";
import  Profile  from "./Profile";
import EditProduct from "./EditProduct";
import OrderManagement from "./OrderManagement";
import AddVeterinarians from "./AddVeterinarians";
import DoctorReservations from "./DoctorReservations";
import UserManagement from "./UserManagement";
import ContactMessages from "./Conact";
import AddArticle from "./AddArticle";

const MainDash = () => {
  return (
    <div className="flex">
      <Sidebar isOpen={true} />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<EditProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/AddVeterinarians" element={<AddVeterinarians />} />
          <Route path="/DoctorReservations" element={<DoctorReservations />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/ContactMessages" element={<ContactMessages />} />
          <Route path="/Add Article" element={<AddArticle />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainDash;
