"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../../db.config"));
class GroceryController {
    getAllItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield db_config_1.default.query('SELECT id, name, sellingPrice from grocery WHERE stock > 0');
                return res.status(200).json(items.rows);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: error });
            }
        });
    }
    myOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { items, user_id } = req.body;
                // console.log("hellooooooo", items);
                if (!items || !Array.isArray(items) || items.length === 0) {
                    return res.status(400).json({ message: 'Invalid request body' });
                }
                const client = yield db_config_1.default.connect();
                yield client.query('BEGIN');
                for (const item of items) {
                    const { item_Id, quantity } = item;
                    const existingItem = yield client.query('SELECT * FROM grocery WHERE id = $1 FOR UPDATE', [item_Id]);
                    // console.log(existingItem.rows);
                    if (existingItem.rows.length === 0) {
                        return res.status(404).json({ message: `Item with id ${item_Id} not found` });
                    }
                    const { stock } = existingItem.rows[0];
                    if (stock < quantity) {
                        return res.status(400).json({ message: `Insufficient stock for item with id ${item_Id}` });
                    }
                    yield client.query('UPDATE grocery SET stock = stock - $1 WHERE id = $2', [quantity, item_Id]);
                    const order = yield client.query('SELECT * FROM orders WHERE user_id = $1 AND item_id = $2', [user_id, item_Id]);
                    if (order.rows.length !== 0) {
                        const value = yield client.query('UPDATE orders SET quantity = quantity + $1 WHERE user_id = $2 AND item_id = $3 RETURNING *', [quantity, user_id, item_Id]);
                        console.log(value.rows[0]);
                    }
                    else {
                        yield client.query(`INSERT INTO orders (user_id, item_id, quantity) VALUES (${user_id}, ${item_Id}, ${quantity}) RETURNING *`);
                    }
                }
                yield client.query('COMMIT');
                return res.json({ message: 'Order placed successfully' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
// export {getAllItems, myOrders};  
exports.default = new GroceryController();
