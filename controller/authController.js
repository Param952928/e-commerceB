const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" }); // Adjust the expiry as per your needs
};

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const role = req.body.role || "user";
      let existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
      const token = generateAuthToken(newUser.id);
      newUser.token = token;
      res.status(200).json({
        message: "User registered successfully",
        token,
        userData: newUser,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateAuthToken(user.id);
        user.token = token;
        res.status(200).json({ message: "Login successful", userData: user });
      } else {
        res.status(400).json({ message: "username and password is reqiuresd" });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  },
};
