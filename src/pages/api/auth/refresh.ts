import { NextApiRequest, NextApiResponse } from "next";
import { generateJwtAndRefreshToken } from "../../../services/jwt/auth";
import { checkRefreshTokenIsValid, invalidateRefreshToken, users } from "../../../services/jwt/database";
import { addUserInformationToRequest } from "../../../services/jwt/middlewares";

const refresh = (req: NextApiRequest, res: NextApiResponse, email: string) => {
    const { refreshToken } = req.body;
  
    const user = users.get(email);
  
    if (!user) {
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
      permissions: user.permissions,
    });
  
    res.json({
      token,
      refreshToken: newRefreshToken,
      permissions: user.permissions,
    });  
}

const handle = (req: NextApiRequest, res: NextApiResponse) => addUserInformationToRequest(req, res, refresh);

export default handle;