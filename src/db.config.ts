import { Pool } from "pg"

const connectDB = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e_grocery',
    password: '12345',
    port: 5432

    // user: process.env.USERNAME || 'postgres',
    // host: process.env.HOST_NAME || 'localhost',
    // database: process.env.DATABASE_NAME || 'e_grocery',
    // password: String(process.env.DATABASE_PASSWORD) || '12345',
    // port: Number(process.env.DATABASE_PORT) || 5432,
    
})


export default connectDB;