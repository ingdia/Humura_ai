const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  // First, connect to default postgres db to create the new database
  const defaultPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  try {
    const dbName = process.env.DB_NAME;
    console.log(`Checking if database '${dbName}' exists...`);
    const res = await defaultPool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);
    
    if (res.rowCount === 0) {
      console.log(`Creating database '${dbName}'...`);
      await defaultPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    return;
  } finally {
    await defaultPool.end();
  }

  // Now connect to the new database to run the schema script
  const pool = require('./src/config/db');
  
  try {
    const sqlPath = path.join(__dirname, 'init_db.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing database initialization script...');
    await pool.query(sqlScript);
    console.log('Database tables created successfully.');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
