require('@babel/register');

const express = require("express");

// routes
const indexRoutes = require('./routes/index.routes');
const authRoutes = require("./routes/auth.routes");


const serverConfig = require('./config/serverConfig');


const app = express();

serverConfig(app)


// маршрутизация приложения
app.use('/', indexRoutes);
app.use("/auth", authRoutes);

// Получаем порт из переменной окружения или используем 3000 по умолчанию
const PORT = process.env.PORT || 3000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});