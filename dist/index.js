"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const grocery_controllers_1 = require("./user/controllers/grocery.controllers");
const inventory_controllers_1 = require("./admin/controllers/inventory.controllers");
const user_controllers_1 = __importDefault(require("./user/controllers/user.controllers"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5020;
app.use(express_1.default.json());
dotenv_1.default.config({
    path: './.env'
});
const server = http_1.default.createServer(app);
// User routes
app.get("/", grocery_controllers_1.getAllItems);
app.post("/create_user", user_controllers_1.default);
app.post("/orders", grocery_controllers_1.myOrders);
// Admin routes
app.post('/admin', inventory_controllers_1.addItem);
app.get('/admin', inventory_controllers_1.allItems);
app.delete('/admin/:item_id', inventory_controllers_1.removeItem);
app.put('/admin/:item_id', inventory_controllers_1.updateItem);
server.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});
