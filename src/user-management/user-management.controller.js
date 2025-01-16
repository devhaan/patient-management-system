const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user-management-entity");

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword, role });

  await user.save();
  res.status(201).json({ message: "User registered successfully" });
};

// Login and get JWT token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, { role: 1, password : 1 });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
