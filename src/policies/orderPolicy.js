function canAccessOrder(user, order) {
  if (!user || !order) {
    return false;
  }

  // Chain-wide administrators can access every branch
  if (user.role === 'admin') {
    return true;
  }

  // Other users can access orders only from their assigned branch
  return user.branchId === order.branchId;
  // return true;
}

export { canAccessOrder };