"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// import {  } from "typeorm";
const connectDB = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e_grocery',
    password: '12345',
    port: 5432
});
exports.default = connectDB;
