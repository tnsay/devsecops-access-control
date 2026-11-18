import jwt from 'jsonwebtoken';

import config from '../config/config.js';
import { users } from '../data/seed.js';

function authenticate(req, res, next) {
  const authHeader = req.get('authorization') || '';

  // Accept only the Bearer token format
  const match = authHeader.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      message: 'Authentication required.',
    });
  }

  try {
    const decoded = jwt.verify(match[1], config.jwt.secret, {
      algorithms: ['HS256'],
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    });

    // Retrieve the user from trusted server-side data
    const user = users.find(
      (item) => String(item.id) === decoded.sub
    );

    if (!user) {
      return res.status(401).json({
        message: 'Invalid or expired token.',
      });
    }

    // Never trust role or branch information from the request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.',
    });
  }
}

export default authenticate;