import { Request, Response } from "express";
import connectDB from "../../db.config";

class GroceryController {
    public async getAllItems(req: Request, res:Response):Promise <Response> {
        try {
            const items = await connectDB.query('SELECT id, name, sellingPrice from grocery WHERE stock > 0')
            return res.status(200).json(items.rows)
        } catch (error) {
            console.error(error)
            return res.status(500).json({message:error})
        }
    }

    public async myOrders(req: Request, res: Response): Promise <Response> {
        try {
            const { items, user_id } = req.body;
            // console.log("hellooooooo", items);
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: 'Invalid request body' });
            }
        
            const client = await connectDB.connect();
        
            await client.query('BEGIN');

            for (const item of items) {
                
                const { item_Id, quantity } = item;
                const existingItem = await client.query('SELECT * FROM grocery WHERE id = $1 FOR UPDATE', [item_Id]);
                
                // console.log(existingItem.rows);
                if (existingItem.rows.length === 0) {
                    return res.status(404).json({ message: `Item with id ${item_Id} not found` });
                }

                const { stock } = existingItem.rows[0];
                if (stock < quantity) {
                    return res.status(400).json({ message: `Insufficient stock for item with id ${item_Id}` });
                }

                await client.query('UPDATE grocery SET stock = stock - $1 WHERE id = $2', [quantity, item_Id]);
                const order  = await client.query('SELECT * FROM orders WHERE user_id = $1 AND item_id = $2', [user_id, item_Id]);
                
                if (order.rows.length !== 0) {
                    const value = await client.query('UPDATE orders SET quantity = quantity + $1 WHERE user_id = $2 AND item_id = $3 RETURNING *', [quantity, user_id, item_Id])
                    console.log(value.rows[0]);
                } else {
                    await client.query(`INSERT INTO orders (user_id, item_id, quantity) VALUES (${user_id}, ${item_Id}, ${quantity}) RETURNING *`)
                }
            }

            await client.query('COMMIT');
            return res.json({ message: 'Order placed successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}


// export {getAllItems, myOrders};  

export default new GroceryController();