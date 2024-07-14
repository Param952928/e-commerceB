const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./connection/database");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/user"); // Adjust the path if necessary

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Function to check and insert superadmin user
async function setupSuperadmin() {
  try {
    const user = await User.findByPk(1); // Find user with id 1
    if (!user) {
      // If no user with id 1 exists, create a superadmin
      const hashedPassword = await bcrypt.hash("Test@123", 10); // Replace with your superadmin password
      await User.create({
        id: 1,
        username: "superadmin",
        email: "test@example.com",  
        password: hashedPassword,
        role: "superadmin",
      });
      console.log("Superadmin user created");
    } else {
      console.log("Superadmin user already exists");
    }
  } catch (err) {
    console.error("Error setting up superadmin:", err);
  }
}

// Database synchronization and superadmin setup
sequelize
  .sync()
  .then(async () => {
    console.log("Database & tables created!");
    await setupSuperadmin(); // Call the function to setup superadmin
  })
  .catch((err) => console.error("Error creating database & tables:", err));

// Import models and routes
require("./models/index");
require("./routes/index")(app);

// Start the server
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, (err) => {
  if (err) {
    console.error("Failed to start the server:", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
