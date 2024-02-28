import { Request, Response } from "express";
import { Grocery } from "../../models/grocery.models";
import connectDB from "../../db.config";


class InventoryController {
  public async addItem(req: Request, res: Response): Promise <Response> {
    try {
      const { name, sellingPrice, purchasePrice, stock} = req.body;
      const newItem: Grocery = { name, sellingPrice, purchasePrice, stock };

      const result = await connectDB.query('INSERT INTO grocery (name, sellingPrice, purchasePrice, stock) VALUES ($1, $2, $3, $4)', [newItem.name, newItem.sellingPrice, newItem.purchasePrice, newItem.stock]);
      console.log(result);
      
      return res.status(200).json({message: "product inserted successfully"});
    } catch (error) {
    console.error(error)
    return res.status(400).json({ message: error });
    }
  }

  public async allItems(req: Request, res: Response): Promise <Response> {
    try {
      const items = await connectDB.query('SELECT * FROM grocery') 
      return res.status(200).json(items.rows)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error })
    }
  }

  public async removeItem(req: Request, res: Response):Promise <Response> {
    try {
      const {item_id} = req.params
      await connectDB.query('DELETE FROM grocery WHERE id = $1', [item_id]);
      return res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error)
      return res.status(400).json({message: error})
    }
  }

  public async updateItem(req: Request, res: Response): Promise <Response> {
    try {
      const {item_id} = req.params;
      const {name, price} = req.body;

      const hasUpdate = await connectDB.query('UPDATE grocery SET name = $1, sellingPrice=$2 WHERE id = $3 RETURNING *', [name, price, item_id])
      if(hasUpdate.rowCount != 0){
        return res.status(200).json({ message: 'Item updated successfully', data: hasUpdate.rows[0] });
      } else {
        return res.status(400).json({ message: 'Item does not exists' });
      }
    } catch (error) {
      console.error(error)
      return res.status(400).json({message: error})
    }
  }
}
export default new InventoryController()