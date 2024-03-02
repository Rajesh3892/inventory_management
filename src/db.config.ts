import { Pool } from "pg"
console.log((process.env));

const connectDB = new Pool({
    // user: 'postgres',
    // host: 'localhost',
    // database: 'e_grocery',
    // password: '12345',
    // port: 5432

    user: process.env.USERNAME || 'postgres',
    host: process.env.HOST_NAME || '65.2.71.93',
    database: process.env.DATABASE_NAME || 'postgres',
    password: String(process.env.DATABASE_PASSWORD) || 'postgres',
    port: Number(process.env.DATABASE_PORT) || 5432,
    
})


export default connectDB;
