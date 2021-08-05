import { NextApiRequest, NextApiResponse } from "next";

import { generateJwtAndRefreshToken } from "../../../services/jwt/auth";
import { seedUserStore, users } from "../../../services/jwt/database";
import { CreateSessionDTO } from "../../../services/jwt/types";

seedUserStore();

export default function auth(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body as CreateSessionDTO;
        const user = users.get(username || email);

        if (!user || password !== user.password) {
          res
            .status(401)
            .json({ 
              error: true, 
              message: 'E-mail or password incorrect.'
            });
          return;
        }
      
        const { token, refreshToken } = generateJwtAndRefreshToken(username || email, {
          permissions: user.permissions,
        })
      
        res.json({
          token,
          refreshToken,
          permissions: user.permissions,
        });      
    } else {
        res.setHeader('Allow','POST');
        res.status(405).end('Method Not Allowed!');
    }
}