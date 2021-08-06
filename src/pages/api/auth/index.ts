import { NextApiRequest, NextApiResponse } from "next";

import { find } from "@/src/services/database/find";
import { generateJwtAndRefreshToken } from "../../../services/jwt/auth";
import { CreateSessionDTO } from "../../../services/jwt/types";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body as CreateSessionDTO;
        const {success, searched} = await find('users', {email: username || email});

        if (!searched || password !== searched.password) {
          res
            .status(401)
            .json({ 
              error: true, 
              message: 'E-mail ou senha incorretos!'
            });
          return;
        }
      
        const { token, refreshToken } = generateJwtAndRefreshToken(username || email, {
          permissions: null,
        })
      
        res.json({
          token,
          refreshToken,
          permissions: null,
        });      
    } else {
        res.setHeader('Allow','POST');
        res.status(405).end('Method Not Allowed!');
    }
}