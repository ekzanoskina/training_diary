const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const router = express.Router();
// const Registration = require("../components/Registration");
const Authorization = require("../components/Authorization");

// router.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     await User.create({ email, password: hashedPassword });
//     res.status(201).send("Пользователь зарегистрирован");
//   } catch (error) {
//     res.status(400).send("Ошибка регистрации: " + error.message);
//   }
// });

// // Отображение страницы регистрации
// router.get("/register", async (req, res) => {
//   try {
//     res.renderComponent(Registration, {});
//   } catch (error) {
//     console.error("Ошибка при отображении страницы регистрации:", error);
//     res.status(500).send("Ошибка сервера");
//   }
// });

// Отображение страницы авторизации
router.get("/login", async (req, res) => {
  try {
    res.renderComponent(Authorization, {});
  } catch (error) {
    console.error("Ошибка при отображении страницы авторизации:", error);
    res.status(500).send("Ошибка сервера");
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ where: { email } });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).send("Invalid email or password.");
      }
      req.session.user = user; // Store user ID in session
      res.status(200).send("User logged in successfully!");
  } catch (error) {
      res.status(500).send("Error logging in: " + error.message);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) return res.status(500).send("Error logging out.");
      res.redirect('/'); // Redirect after logout
  });
});

module.exports = router;
