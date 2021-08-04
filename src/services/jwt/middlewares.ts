import jwt from 'jsonwebtoken'
import decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next';

import { auth } from './config';
import { DecodedToken } from './types';

export function checkAuthMiddleware(request: NextApiRequest, response: NextApiResponse, next: (req: NextApiRequest, res: NextApiResponse, user?: string) => void) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
  }

  const [, token] = authorization?.split(' ');

  if (!token) {
    return response 
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
  }

  try {
    const decoded = jwt.verify(token as string, auth.secret) as DecodedToken;

    return next(request, response, decoded.sub);
  } catch (err) {

    return response 
      .status(401)
      .json({  error: true, code: 'token.expired', message: 'Token invalid.' })
  }
}

export function addUserInformationToRequest(request: NextApiRequest, response: NextApiResponse, next: (req: NextApiRequest, res: NextApiResponse, user?: string) => void) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
  }

  const [, token] = authorization?.split(' ');

  if (!token) {
    return response 
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Token not present.' })
  }

  try {
    const decoded = decode(token as string) as DecodedToken;

    return next(request, response, decoded.sub);
  } catch (err) {
    return response 
      .status(401)
      .json({ error: true, code: 'token.invalid', message: 'Invalid token format.' })
  }
}

// app.get('/me', checkAuthMiddleware, (request, response) => {
//   const email = request.user;

//   const user = users.get(email);

//   if (!user) {
//     return response
//       .status(400)
//       .json({ error: true, message: 'User not found.' });
//   }

//   return response.json({
//     email,
//     permissions: user.permissions,
//     roles: user.roles,
//   })
// });
