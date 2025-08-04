// routes/userRoutes.js
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const bookingController = require("../controller/bookingController");


const {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUserFromToken,
  getUserRoleFromToken,
  updateUserRole,
  getAllUsers,
getMe,
suspendUser,
unsuspendUser
} = require("../controller/userController");

const verifyToken = require("../middleware/authMiddleware");

router.put(
  "/profileProf",
  verifyToken,
);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/profile", verifyToken, getUserProfile);





// Route to update user profile (protected route)
router.put(
  "/profile",
  verifyToken,
  upload.single("profilePicture"),
  updateUserProfile
);


// Route to get user role from token
router.get("/get-role", getUserRoleFromToken);


// Route to logout user
router.post("/logout", logoutUser);

// Route to get user from token
router.get("/get-user", getUserFromToken);


// Route to create a new booking (protected route)
router.get("/bookings/user", verifyToken, bookingController.getUserBookings);



// Route to get all users (protected route)
router.get("/users", verifyToken, getAllUsers);

// Route to update user role (protected route)
router.put("/:userId/role", verifyToken, updateUserRole);

// Route to suspend a user (protected route)
router.put('/:userId/suspend', verifyToken, suspendUser);

// Route to unsuspend a user (protected route)
router.put('/:userId/unsuspend', verifyToken, unsuspendUser);

// Route to get user profile by ID (protected route)
router.get("/me", verifyToken, getMe);






module.exports = router;
