const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const router = express.Router();
const Authentication = require("../components/Authentication");

// Отображение страницы авторизации
router.get("/", async (req, res) => {
  try {
    // Проверяем, есть ли пользователь в сессии
    if (req.session.user) {
      // Если пользователь уже залогинен, перенаправляем его на главную страницу или страницу профиля
      return res.redirect("/"); // Замените "/profile" на нужный вам маршрут
    }

    // Если пользователь не залогинен, отображаем страницу авторизации
    res.renderComponent(Authentication, {});
  } catch (error) {
    console.error("Ошибка при отображении страницы авторизации:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// Login route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid email or password.");
    }
    req.session.user = user; // Store user ID in session
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});
function failAuth(res) {
  return res.status(401).end();
}

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
  };
}
router
  .route("/signup")
  // Регистрация пользователя
  .post(async (req, res) => {
    const { username, password, email } = req.body;
    try {
      // Мы не храним пароль в БД, только его хэш
      const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        username,
        password: hashedPassword,
        email,
      });
      req.session.user = serializeUser(user);
    } catch (err) {
      console.error(err);
      return failAuth(res);
    }
    return res.end();
  });

router.get("/signout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err); // Передаем ошибку в следующий обработчик
    }
    // Убедитесь, что имя куки правильно указано
    res.clearCookie("connect.sid"); // Замените на фактическое имя куки, если оно другое
    return res.redirect("/"); // Перенаправляем на главную страницу
  });
});

module.exports = router;
