import { Pool } from "pg"
console.log("Config FIle==",process.env);

const connectDB = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST_NAME,
    database: process.env.DATABASE_NAME,
    password: String(process.env.DATABASE_PASSWORD),
    port: Number(process.env.DATABASE_PORT),
    
})


export default connectDB;
