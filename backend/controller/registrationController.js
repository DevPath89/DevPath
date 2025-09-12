const Registration = require("../models/Registration");

// ✅ Sequential UserID & Password generator
const generateCredentials = async () => {
  const count = await Registration.countDocuments();
  const nextNumber = count + 1;
  const formattedNumber = String(nextNumber).padStart(3, "0");

  const userId = `Devpath${formattedNumber}`;
  const password = `DPT${formattedNumber}`;

  return { userId, password };
};

// ===== REGISTER =====
exports.userRegister = async (req, res) => {
  try {
    const { name, emailID, collegeName, passingYear, trainingType, course, mobileNo } = req.body;

    // Email already registered?
    const existingUser = await Registration.findOne({ emailID });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Generate sequential UserID & Password
    const { userId, password } = await generateCredentials();

    // Save new user
    const newUser = new Registration({
      name,
      emailID,
      collegeName,
      passingYear,
      trainingType,
      course,
      mobileNo,
      userId,
      password
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Registration successful", 
      userId, 
      password 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ===== LOGIN =====
exports.userLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await Registration.findOne({ userId });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password) return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      userId: user.userId
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
