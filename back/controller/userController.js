const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../model/user");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
















// Setup Multer storage
// multer is a middleware for handling multipart/form-data, which is used for uploading files
// It stores the uploaded files in a specified directory and generates a unique filename for each file
/****************************************************************************************/
/****************************************************************************************/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
/****************************************************************************************/
/****************************************************************************************/












// Create a multer instance with the defined storage
/****************************************************************************************/
/****************************************************************************************/
const upload = multer({ storage: storage });
/****************************************************************************************/
/****************************************************************************************/









  





// Controller to handle Google login
/****************************************************************************************/
/****************************************************************************************
 * @desc Handle Google login
 * @route POST /api/auth/google
 *  @access Public
 * @body {token}
 * @returns {Object} {message, token}
 * /****************************************************************************************/
/****************************************************************************************/
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload.name || !payload.email) {
      return res
        .status(400)
        .json({ message: "Missing required data from Google" });
    }

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profilePicture: payload.picture,
        role: "user",
      });
      await user.save();
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Your account is suspended." });
    }

    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res
      .status(200)
      .json({ message: "Google login successful", token: authToken }); // <-- أضف token هنا
  } catch (error) {
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/














// Controller to handle user registration
/****************************************************************************************/
/****************************************************************************************
 * @desc Handle user registration
 * @route POST /api/auth/register
 *  @access Public
 * @body {email, password, name}
 * @returns {Object} {message, token}
 * /****************************************************************************************/
/****************************************************************************************/
exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/
















// Controller to handle user login
/****************************************************************************************/
/****************************************************************************************
 * @desc Handle user login
 * @route POST /api/auth/login
 * @access Public
 * @body {email, password}
 * @returns {Object} {message, token}
 * /****************************************************************************************/
/****************************************************************************************/
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isSuspended) {
      return res.status(403).json({ message: "Your account is suspended." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/

















// Controller to handle user profile retrieval
/****************************************************************************************/
/****************************************************************************************
 * @desc Get user profile
 * @route GET /api/auth/profile
 * @access Private
 * @returns {Object} {user}
 * /****************************************************************************************/
/****************************************************************************************/
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "لم يتم العثور على المستخدم" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        savedArticles: user.savedArticles,
        comments: user.comments,
        readingHistory: user.readingHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/


















  // Controller to handle user profile update
/****************************************************************************************/
/****************************************************************************************
 * @desc Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 * @body {name, email, file}
 * @returns {Object} {message, user}
 * /****************************************************************************************/
/****************************************************************************************/
const profileUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.base": "الاسم يجب أن يكون نصًا",
    "string.min": "الاسم يجب أن يكون على الأقل 3 أحرف",
    "string.max": "الاسم يجب أن لا يتجاوز 50 حرفًا",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      "string.base": "البريد الإلكتروني يجب أن يكون نصًا",
      "string.email": "صيغة البريد الإلكتروني غير صحيحة",
    }),
  file: Joi.any().optional(),
});
/****************************************************************************************/
/****************************************************************/

















// Controller to handle user profile update
/****************************************************************************************/
/****************************************************************************************
 * @desc Update user profile
 *  @route PUT /api/auth/profile
 *  @access Private
 * @body {name, email, file}
 * @returns {Object} {message, user}
 * /****************************************************************************************/
/****************************************************************************************/
exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  const { error } = profileUpdateSchema.validate(
    { name, email, file: req.file },
    { abortEarly: false }
  );

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    await user.save();
    res.status(200).json({
      message: "User data updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error during profile update:", error); // Log detailed error
    res.status(500).json({
      message: "Server error during profile update",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/

















// Controller to handle user logout
/****************************************************************************************/
/****************************************************************************************
 * @desc Handle user logout
 * @route POST /api/auth/logout
 * @access Private
 * @returns {Object} {message}
 * /****************************************************************************************/
/****************************************************************************************/
exports.logoutUser = (req, res) => {
  res.clearCookie("authToken").status(200).json({ message: "تم تسجيل الخروج" });
};
/****************************************************************************************/
/****************************************************************/



















// Middleware to verify JWT token
/****************************************************************************************/
/****************************************************************
 * @desc Verify JWT token
 * @route GET /api/auth/verify
 * @access Private
 * @returns {Object} {message}
 * /****************************************************************************************/
/****************************************************************/
exports.getUserFromToken = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};  
/****************************************************************************************/
/****************************************************************/












// Middleware to verify JWT token and get user role
/****************************************************************************************/
/****************************************************************
 * @desc Verify JWT token and get user role
 * @route GET /api/auth/role
 * @access Private
 * @returns {Object} {message}
 * /****************************************************************************************/
/****************************************************************/
exports.getUserRoleFromToken = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.id, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
/****************************************************************************************/
/****************************************************************/














// Middleware to get user details
/****************************************************************************************/
/****************************************************************
 * @desc Get user details
 * @route GET /api/auth/me
 * @access Private
 * @returns {Object} {user}
 * /****************************************************************************************/
/****************************************************************/
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
/****************************************************************************************/
/****************************************************************/













// Middleware to get all users
/****************************************************************************************/
/****************************************************************
 * @desc Get all users
 * @route GET /api/auth/users
 * @access Private
 *  @returns {Object} {users}
 * /****************************************************************************************/
/****************************************************************/
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password, include all other fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/****************************************************************************************/
/****************************************************************/













// udate user role
/****************************************************************************************/
/****************************************************************
 * @desc Update user role
 * @route PUT /api/auth/users/:userId
 * @access Private
 * @body {newRole}
 * @returns {Object} {message, user}
 * /****************************************************************************************/
/****************************************************************/
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params
    const { newRole } = req.body; // Get newRole from request body

    // Validate the role
    const validRoles = ["veterinarian", "user", "admin"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({
      message: "Error updating user role",
      error: err.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************/













// Suspend a user
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsuspend a user
exports.unsuspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User unsuspended successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
