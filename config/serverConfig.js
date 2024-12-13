// config/serverConfig.js
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const ssr = require("../middleware/ssr");
const userPass = require("../middleware/userPass");
const sessionFileStore = require("session-file-store");
const FileStore = sessionFileStore(session);

const serverConfig = (app) => {
  app.use(morgan("dev"));
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session({
    secret: 'connect.sid',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Настройте это для вашего окружения
}));

  app.use(userPass);
  app.use(ssr);
};

module.exports = serverConfig;
