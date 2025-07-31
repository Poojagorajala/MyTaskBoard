const {getPool}=require('../db');

const createTaskTable=async()=>{
     const pool = getPool();
    try{
    const query=`
    create table if not exists tasks(
    task_id serial primary key,
    task_name varchar(20),
    task_description text,
    task_author varchar(30) NOT NULL,
    user_id integer references users(user_id),
    created_at timestamp default current_timestamp
    );
    `;
    await pool.query(query);
    console.log("tasks table is created successfully");
    }
    catch(error){
        console.error('the error in creating the task',error.message);
    }
}
module.exports={createTaskTable};