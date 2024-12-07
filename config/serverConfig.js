// config/serverConfig.js
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const ssr = require("../middleware/ssr");

const serverConfig = (app) => {
  app.use(morgan("dev"));
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 12 },
}));


  app.use(ssr);
};

module.exports = serverConfig;
