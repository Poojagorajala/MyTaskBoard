const {getPool}=require('../db');

const createUserTable=async()=>{
     const pool = getPool();
    try{
    const query=`
    CREATE TABLE IF NOT EXISTS users(
    user_id serial PRIMARY KEY,
    user_name text NOT NULL,
    user_email varchar(100) NOT NULL,
    password varchar(50) not null
    );
    `;
    await pool.query(query);
    console.log("users table is created successfully")
    }
    catch(error){
        console.error('error in creating an user:',error.message);

    }
}
module.exports={createUserTable}; 