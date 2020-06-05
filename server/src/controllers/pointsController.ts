import {Request, Response, response} from 'express';
import knex from '../database/connection'


class PointsController {

    async show(req:Request, res: Response) {
        const {id} = req.params;

        const point = await knex('point').where('id', id).first();

        if(!point) {
            return res.status(400).json({message: 'Point Not Found.'})
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({ point, items });
    }

    async index (req: Request, res: Response) {
        const {city, uf, items} = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('point')
            .join('point_items', 'point.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('point.*');

        return res.json(points);
    } 

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

    
        const trx = await knex.transaction();

        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };
    
        try {
            const insertedIds = await trx('point').insert(point);
    
            const pointId = insertedIds[0];
    
            const pointItem = items.map((item_id: number) => {
                return {
                    item_id,
                    point_id: pointId
                }
            });
    
            await trx('point_items').insert(pointItem);
            await trx.commit();
            return res.json({
                id: pointId,
                ...point,
                
            });

        } catch (error) {
            res.status(400);
            return res.json({success: false});
        }
    }


}

export default PointsController;