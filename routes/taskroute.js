const express = require('express');
const router = express.Router();
const tasks = require('../controllers/taskController');


// GET Show the form to create a new task
router.get('/create', tasks.showCreateTaskForm);

// POST /task/create - Handle the submission of the new task form
router.post('/create', tasks.createTask);

// GET /task/all - Display all tasks
router.get('/all', tasks.getAllTasks);

router.get('/update/:id', tasks.getUpdateTaskForm);


// POST /task/update/:id - Handle the submission of the update form.
router.post('/update/:id', tasks.updatetask);

// POST /task/delete/:id - Handle the deletion of a task
router.post('/delete/:id', tasks.deletetask);


module.exports = router;