const express = require('express');
// const Main = require('../components/Main'); 
// const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// Home route
// router.get('/', (req, res) => {
//     const user = req.session.user || null; 
//     console.log(user);
//     res.renderComponent(Main, { user });
// });

// router.get('/profile', authMiddleware, (req, res) => {
//     const user = req.session.user; 
//     console.log("User profile:", user);
    
//     res.renderComponent(Main, { user }); 
// });

module.exports = router;