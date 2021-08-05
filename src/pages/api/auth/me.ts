import { NextApiRequest, NextApiResponse } from "next";

import { users } from "../../../services/jwt/database";
import { checkAuthMiddleware } from "../../../services/jwt/middlewares";

const me = (request: NextApiRequest, response: NextApiResponse, email: string) => {
    if (request.method === 'GET') {
        const user = users.get(email);
      
        if (!user) {
          return response
            .status(400)
            .json({ error: true, message: 'User not found.' });
        }
      
        return response.json({
          email,
          permissions: user.permissions,
        })
    } else {
        response.setHeader('Allow','GET');
        response.status(405).end('Method Not Allowed');
    }
};

const handle = (req: NextApiRequest, res: NextApiResponse) => checkAuthMiddleware(req, res, me);

export default handle;