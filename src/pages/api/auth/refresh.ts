import { NextApiRequest, NextApiResponse } from "next";

import { find } from "@/src/services/database/find";
import { generateJwtAndRefreshToken } from "../../../services/jwt/auth";
import { checkRefreshTokenIsValid, invalidateRefreshToken } from "../../../services/jwt/database";
import { addUserInformationToRequest } from "../../../services/jwt/middlewares";

const refresh = async (req: NextApiRequest, res: NextApiResponse, email: string) => {
    const { refreshToken } = req.body;
    const { success, searched } = await find('users', { email: email });

    if (!searched) {
      res
        .status(401)
        .json({ 
          error: true, 
          message: 'User not found.'
        });
    }
  
    if (!refreshToken) {
      res
        .status(401)
        .json({ error: true, message: 'Refresh token is required.' });
    }
  
    const isValidRefreshToken = checkRefreshTokenIsValid(email, refreshToken)
  
    if (!isValidRefreshToken) {
      res
        .status(401)
        .json({ error: true, message: 'Refresh token is invalid.' });
    }
  
    invalidateRefreshToken(email, refreshToken);
  
    const { token, refreshToken: newRefreshToken } = generateJwtAndRefreshToken(email, {
      permissions: searched.permissions,
    });
  
    res.json({
      token,
      refreshToken: newRefreshToken,
      permissions: searched.permissions,
    });  
}

const handle = (req: NextApiRequest, res: NextApiResponse) => addUserInformationToRequest(req, res, refresh);

export default handle;