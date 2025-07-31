const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

const userRouter = require('./routes/userroute');
const taskRouter = require('./routes/taskroute');

const { setupDatabase, getPool } = require('./db'); 
const { createUserTable } = require('./models/userschema');
const { createTaskTable } = require('./models/taskschema');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth Middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/user/login');
    }
}

// Routes
app.use('/users', userRouter);
app.use('/task', isAuthenticated, taskRouter);

// Create Tables
(async () => {
    try {
        await setupDatabase(); 
        await createUserTable();
        await createTaskTable();
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to setup database:', error.message);
    }
})();
