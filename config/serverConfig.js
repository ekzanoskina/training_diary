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
    name: app.get('session cookie name'),
    secret: process.env.SESSION_SECRET || 'test',
    store: new FileStore({
      // Шифрование сессии
      secret: process.env.SESSION_SECRET || 'test',
    }),
    // Если true, сохраняет сессию, даже если она не поменялась
    resave: false,
    // Если false, куки появляются только при установке req.session
    saveUninitialized: false,
    cookie: {
      // В продакшне нужно "secure: true" для HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  }));

  app.use(userPass);
  app.use(ssr);
};

module.exports = serverConfig;
