import { NextApiRequest, NextApiResponse } from "next";

import { find } from "@/src/services/database/find";
import { checkAuthMiddleware } from "../../../services/jwt/middlewares";

const me = async (request: NextApiRequest, response: NextApiResponse, email: string) => {
  if (request.method === 'GET') {
    const { success, searched } = await find('users', { email: email });

    if (!searched) {
      return response
        .status(400)
        .json({ error: true, message: 'User not found.' });
    }

    return response.json({
      email,
      name: searched.name,
      permissions: null,
    })
  } else {
    response.setHeader('Allow', 'GET');
    response.status(405).end('Method Not Allowed');
  }
};

const handle = (req: NextApiRequest, res: NextApiResponse) => checkAuthMiddleware(req, res, me);

export default handle;