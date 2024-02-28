import { Request, Response } from 'express';
import { User } from '../../models/user.models';
import connectDB from '../../db.config';

  
class UserController {
  public async createUser(req: Request, res: Response): Promise<Response> {
    const { name, email, userType } = req.body as User;
    try {
      const newUser = await connectDB.query('INSERT INTO users (name, email, userType) VALUES ($1, $2, $3)', [name, email, userType]);
      return res.status(201).json({message: "user created successfully"});
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}


export default new UserController();
