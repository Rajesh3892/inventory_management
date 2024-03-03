import dotenv from "dotenv"
import express, { Application, Request, Response } from "express"
import http from "http"
import GroceryController from "./user/controllers/grocery.controllers";
import InventoryController from "./admin/controllers/inventory.controllers";
import UserController from "./user/controllers/user.controllers";
import connectDB from "./db.config";

const app: Application = express();

const port = process.env.PORT



app.use(express.json());

dotenv.config({ 
    path: './.env' 
})

console.log("INDEX FILE====",process.env)
const server = http.createServer(app)



// app.post('/', async (req: Request, res: Response) => {
//   try {
//     res.json({message: "This is home page json"});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


// User routes
app.get("/", GroceryController.getAllItems)
app.post("/create_user", UserController.createUser)
app.post("/orders", GroceryController.myOrders)

// Admin routes
app.post('/admin', InventoryController.addItem);
app.get('/admin', InventoryController.allItems);
app.delete('/admin/:item_id', InventoryController.removeItem);
app.put('/admin/:item_id', InventoryController.updateItem);



// server.listen(port, ()=>{
//     console.log(`Server listen on port ${port}`);
// })
connectDB.connect().then(() => {
    server.listen(port, ()=>{
        console.log(`Server listen on port ${port}`);
    })
}).catch((err)=>{
    console.error(err);
})
