const ROLE_PERMISSIONS = {
  waiter: [
    'orders:read',
    'orders:create',
  ],

  cashier: [
    'orders:read',
    'payments:create',
  ],

  manager: [
    'orders:read',
    'orders:create',
    'payments:create',
    'reports:read',
  ],

  admin: [
    'orders:read',
    'orders:create',
    'payments:create',
    'reports:read',
    'users:manage',
  ],
};

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    const permissions = ROLE_PERMISSIONS[req.user.role] || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permission.',
      });
    }

    next();
  };
}

export { ROLE_PERMISSIONS };
export default requirePermission;