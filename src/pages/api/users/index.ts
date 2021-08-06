import { find } from "@/src/services/database/find";
import { insert } from "@/src/services/database/insert";
import { UserData } from "@/src/services/database/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.method);
    switch (req.method) {
        case 'POST': {
            if (req.body) {
                const data = req.body as UserData;
                const result = await insert('users', { email: data.email }, data);
                if (result.success) {
                    res.status(201).json(result.inserted);
                } else {
                    if (result.error) {
                        res.status(500).json({ error: result.error });
                    } else {
                        res.status(400).json({ error: 'Já cadastrado.' });
                    }
                }
            }
        }
        case 'PUT': {

        }
        case 'DELETE': {

        }
        case 'GET': {
            const findKey = !!req.query.id ? { email: req.query.id } : {};
            const result = await find('users', findKey);
            console.log('depois do find');
            if (result.success) {
                res.status(200).json(result.searched);
            } else {
                if (result.error) {
                    res.status(500).json({ error: result.error });
                } else {
                    res.status(404).json([]);
                }
            }
        }
        default: {
            res.setHeader('Allow', ['POST', 'PUT', 'GET', 'DELETE']);
            res.status(405).end('Method Not Allowed');
        }
    }
}