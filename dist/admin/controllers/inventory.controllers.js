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
exports.updateItem = exports.removeItem = exports.allItems = exports.addItem = void 0;
const db_config_1 = __importDefault(require("../../db.config"));
const addItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, sellingPrice, purchasePrice, stock } = req.body;
        const newItem = { name, sellingPrice, purchasePrice, stock };
        const result = yield db_config_1.default.query('INSERT INTO grocery (name, sellingPrice, purchasePrice, stock) VALUES ($1, $2, $3, $4)', [newItem.name, newItem.sellingPrice, newItem.purchasePrice, newItem.stock]);
        console.log(result);
        return res.status(200).json({ message: "product inserted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
});
exports.addItem = addItem;
const allItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield db_config_1.default.query('SELECT * FROM grocery');
        return res.status(200).json(items.rows);
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
});
exports.allItems = allItems;
const removeItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = req.params;
        yield db_config_1.default.query('DELETE FROM grocery WHERE id = $1', [item_id]);
        return res.json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
});
exports.removeItem = removeItem;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = req.params;
        const { name, price } = req.body;
        const hasUpdate = yield db_config_1.default.query('UPDATE grocery SET name = $1, sellingPrice=$2 WHERE id = $3 RETURNING *', [name, price, item_id]);
        if (hasUpdate.rowCount != 0) {
            return res.status(200).json({ message: 'Item updated successfully', data: hasUpdate.rows[0] });
        }
        else {
            return res.status(400).json({ message: 'Item does not exists' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error });
    }
});
exports.updateItem = updateItem;
