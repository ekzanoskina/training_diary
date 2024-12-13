const express = require('express');
const Main = require('../components/Main'); 
const authCheck = require('../middleware/authCheck'); 

const router = express.Router();

// Home route
router.get('/', authCheck, (req, res) => {
    const user = req.session.user || null; 
    res.renderComponent(Main, { user });
});

module.exports = router;