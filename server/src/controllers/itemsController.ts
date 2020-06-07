import {Request, Response} from 'express';
import knex from '../database/connection'

class ItemsController {
    
    async index(req: Request, res: Response) {
        try {
            const items = await knex('items').select('*');
            const serializedItems = items.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    imageUrl: `http://192.168.100.11:8000/uploads/${item.image}`
                }
            });
            return res.json(serializedItems);
    
        } catch (error) {
    
            res.status(404)
            return res.send(error);
        }
    }
}

export default ItemsController;