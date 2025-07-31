const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');

// router.get('/signup',users.registeruser);
router.get('/signup', (req, res) => {
    res.render('signup'); 
});
// POST route to handle registration
router.post('/signup', users.registeruser);

router.get('/login', (req, res) => {
    res.render('login');
});
// // POST route to handle login
router.post('/login', users.loginUser);

// Home page route
router.get('/home', users.HomePage);

// Logout route
router.get('/logout', users.logoutUser);

module.exports = router;
