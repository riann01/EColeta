import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');

        const serializedItems = items.map((element) => {
            return {
                id: element.id,
                name: element.title,
                imageUrl: `http://192.168.0.106:3333/uploads/${element.image}`
            }
        });

        return response.json(serializedItems);
    }
}

export default ItemsController;