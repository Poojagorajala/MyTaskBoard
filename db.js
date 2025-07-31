const { Pool } = require('pg');

let pool;

const setupDatabase = async () => {
    const tempPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        password: 'pooja',
        port: 5432,
        database: 'postgres' 
    });

    try {
        await tempPool.query('CREATE DATABASE exampletask');
        console.log('Database "exampletask" created');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database "exampletask" already exists');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await tempPool.end();
    }

    //  Connect to the correct database: "exampletask"
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'exampletask', 
        password: 'pooja',
        port: 5432
    });

    try {
        await pool.query('SELECT NOW()');
        console.log('Connected to "exampletask"!');
    } catch (err) {
        console.error('Failed to connect to "exampletask":', err);
    }
};

const getPool = () => pool;

module.exports = {
    setupDatabase,
    getPool
};
