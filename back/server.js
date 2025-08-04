const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/productRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const vetRoutes = require("./routes/vetRoutes");
const departmentRoutes = require('./routes/departmentRoutes'); // Import department routes
const contactRoutes = require("./routes/contactusRoutes"); // Import contact routes
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");
const reviewRoutes = require('./routes/reviewRoutes');
const emailRoutes = require("./routes/emailRoutes");
const articleRoutes = require("./routes/articleRoutes");
const plantDiseaseRoutes = require("./routes/plantDiseaseRoutes");
const app = express();
//************************************************************************************************** */



// Middleware
dotenv.config();


// Middleware
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(cookieParser());


// Middleware 
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://agriculture-and-animals-3.onrender.com",
    ],
    credentials: true, // إذا كنت تستخدم كوكيز أو توكن
  })
);



// app.use("/uploads", express.static("uploads")); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use Routes
app.use("/api",productRoutes);
app.use("/bookings", bookingRoutes);
app.use('/api', userRoutes); 
app.use(bookingRoutes);  
app.use("/api/vets", vetRoutes);
app.use('/api/departments', departmentRoutes); 
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api", orderRoutes);
app.use('/pdf', express.static(path.join(__dirname, 'pdfs')));  
app.use("/api/reviews", reviewRoutes);
app.use("/api", emailRoutes);
app.use("/vets", vetRoutes); 
app.use("/api/articles", articleRoutes);
app.use("/api/products", productRoutes); 
app.use('/api/plant-disease-detect', plantDiseaseRoutes);

app.get('/', (req, res) => {
  res.send('💰 Cashback API is running successfully');
});



//************************************************************************************************** */
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));
//************************************************************************************************** */







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/************************************************************************* */