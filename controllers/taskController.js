const { getPool } = require('../db.js');

const showCreateTaskForm = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  res.render('createtask');
};

const createTask = async (req, res) => {
  const userId = req.session.user?.user_id; 
  const { task_name, task_description } = req.body;

  if (!userId) {
  
    res.redirect('/users/login'); 
    console.log("redirected to the login page")
  }
  try {
    const pool = getPool();
    const userResult = await pool.query(
      'SELECT user_name FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    const task_author = userResult.rows[0].user_name;
    console.log(userResult.rows[0]);
    await pool.query(
      `INSERT INTO tasks (task_name, task_description, task_author, user_id)
       VALUES ($1, $2, $3, $4);`,
      [task_name, task_description, task_author, userId]
    );
    console.log("here is the all tasks")
    res.redirect('/task/all');
    // res.render('alltasks')
  } catch (error) {
    console.error('Error creating the task:', error.message);
    res.status(500).send('Internal server error.');
  }
};

const getAllTasks = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT task_id, task_name, task_description, task_author, user_id FROM tasks"); 
    res.render("alltasks", {
      tasks: result.rows,
      sessionUserId: req.session.user?.user_id 
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Server Error");
  }
};

const getUpdateTaskForm = async (req, res) => {
  const taskId = req.params.id; 
  const userId = req.session.user?.user_id; 

  try {
    const pool = getPool(); 
    const result = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1',
      [taskId]
    );

    const task = result.rows[0];

    if (!task) {
      return res.status(404).send('Task not found');
    }

    if (task.user_id !== userId) {
      return res.status(403).send('You are not authorized to edit this task.');
    }

    res.render('edittask', { task });
  } catch (err) {
    console.error('Error loading update form:', err);
    res.status(500).send('Internal Server Error');
  }
};

const updatetask = async (req, res) => {
  const taskId = req.params.id; 
  console.log("taskId",taskId)
   const { task_name, task_description } = req.body;
  const userId = req.session.user?.user_id; 

  try {
    const pool = getPool(); 
    console.log("first1")
    const taskResult = await pool.query('SELECT user_id FROM tasks WHERE task_id = $1', [taskId]);

    if (taskResult.rows.length === 0) {
      return res.status(404).send('Task not found');
    }

    console.log("second2")
    if (taskResult.rows[0].user_id !== userId) {
      return res.status(403).send('You are not allowed to update this task');
    }
 
    console.log("third3")
    await pool.query(
      'UPDATE tasks SET task_name = $1, task_description = $2 WHERE task_id = $3',
      [task_name, task_description, taskId]
    );

    const query=`select * from tasks`;
    const result=await pool.query(query);
  

   res.render("alltasks", {
      tasks: result.rows,
      sessionUserId: req.session.user?.user_id 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating task');
  }
};

const deletetask = async (req, res) => {
  const taskId = req.params.id; 
  console.log(taskId)
  const userId = req.session.user?.user_id; 

  try {
    const pool = getPool(); 
    // const taskResult = await pool.query('SELECT user_id FROM tasks WHERE task_id = $1', [taskId]);

    // console.log(taskResult.rows[0])

    // if (taskResult.rows.length === 0) {
    //   return res.status(404).send('Task not found');
    // }

    // // Crucial security check: Ensure the task belongs to the logged-in user
    // if (taskResult.rows[0].user_id !== userId) {
    //   return res.status(403).send('You are not allowed to delete this task');
    // }

    await pool.query('DELETE FROM tasks WHERE task_id = $1', [taskId]);
    res.redirect('/task/all'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting task');
  }
};

module.exports = { createTask, getAllTasks, updatetask, deletetask, showCreateTaskForm,getUpdateTaskForm};