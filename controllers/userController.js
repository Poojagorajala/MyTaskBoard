const bcrypt = require('bcrypt');
const { getPool } = require('../db');

const registeruser = async (req, res) => {
    const { user_name, user_email, password } = req.body;

    if (!user_name || !user_email || !password) {
        return res.status(400).send("All fields are required.");
    }
     try {
        const pool = getPool();
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (user_name, user_email, password)
                       VALUES ($1, $2, $3) RETURNING *`;

        const result = await pool.query(query, [user_name, user_email, hashedPassword]);

        if (result.rows.length === 0) {
            return res.status(400).send("User could not be registered.");
        }

        console.log("User registered:", result.rows[0]);

        
        // return res.redirect('/users/login'); 
           res.render('login')
    } catch (error) {
        console.error("Registration error:", error.message);
        return res.status(500).send("internal Server Error");
    }
};

const loginUser = async (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    try {
        const pool = getPool();

        const query = 'SELECT * FROM users WHERE user_email = $1';
        const result = await pool.query(query, [user_email]);

        if (result.rows.length === 0) {
            return res.status(400).send("Invalid email or user not found.");
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send("Incorrect password.");
        }

      
        req.session.user = { user_id: user.user_id, user_email: user.user_email };
        console.log("Login successful ,redirecting to home page");

        res.redirect('/users/home');
        // res.render('home',{user,tasks})
       console.log("goes to the home page now ")
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send("Server error during login.");
    }
};

const HomePage = async (req, res) => {
  try {
    const pool = getPool();  

    if (!req.session.user) {
      return res.redirect('/users/login'); 
    }

    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [req.session.user.user_id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = result.rows[0];

    const taskQuery = 'SELECT * FROM tasks WHERE user_id = $1';
    const taskResult = await pool.query(taskQuery, [user.user_id]);
    const tasks = taskResult.rows;

  
    res.render('home', { user, tasks });

  } catch (error) {
    console.error('Error in renderHomePage:', error.message);
    res.status(500).send('Internal server error');
  }
};

const logoutUser=async(req,res)=>{
    req.session.destroy(err =>{
      if(err){
       return res.status(400).json('error at logout of user');
    }
       res.clearCookie('connect.sid');
        res.send('User logged out successfully'); 
    });
}

module.exports={registeruser,loginUser,logoutUser,HomePage};
