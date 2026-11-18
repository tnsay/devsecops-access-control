import bcrypt from 'bcryptjs';

export const BRANCHES = {
  BOLE: 1,
  PIASSA: 2,
};

// Fictional users for development and automated testing
const rawUsers = [
  {
    id: 1,
    email: 'waiter.bole@dinedesk.test',
    password: 'WaiterBole123!',
    role: 'waiter',
    branchId: BRANCHES.BOLE,
  },
  {
    id: 2,
    email: 'waiter.piassa@dinedesk.test',
    password: 'WaiterPiassa123!',
    role: 'waiter',
    branchId: BRANCHES.PIASSA,
  },
  {
    id: 3,
    email: 'cashier.bole@dinedesk.test',
    password: 'CashierBole123!',
    role: 'cashier',
    branchId: BRANCHES.BOLE,
  },
  {
    id: 4,
    email: 'cashier.piassa@dinedesk.test',
    password: 'CashierPiassa123!',
    role: 'cashier',
    branchId: BRANCHES.PIASSA,
  },
  {
    id: 5,
    email: 'manager.bole@dinedesk.test',
    password: 'ManagerBole123!',
    role: 'manager',
    branchId: BRANCHES.BOLE,
  },
  {
    id: 6,
    email: 'manager.piassa@dinedesk.test',
    password: 'ManagerPiassa123!',
    role: 'manager',
    branchId: BRANCHES.PIASSA,
  },
  {
    id: 7,
    email: 'admin@dinedesk.test',
    password: 'AdminDineDesk123!',
    role: 'admin',
    branchId: null,
  },
];

// Hash passwords before storing users
const users = await Promise.all(
  rawUsers.map(async ({ password, ...user }) => ({
    ...user,
    passwordHash: await bcrypt.hash(password, 12),
  }))
);

export { users };

// Sample orders belonging to both branches
export const orders = [
  {
    id: 101,
    branchId: BRANCHES.BOLE,
    tableNumber: 5,
    items: ['Burger', 'Juice'],
    total: 650,
    status: 'pending',
  },
  {
    id: 102,
    branchId: BRANCHES.BOLE,
    tableNumber: 3,
    items: ['Pizza', 'Water'],
    total: 850,
    status: 'pending',
  },
  {
    id: 201,
    branchId: BRANCHES.PIASSA,
    tableNumber: 2,
    items: ['Pasta', 'Coffee'],
    total: 550,
    status: 'pending',
  },
  {
    id: 202,
    branchId: BRANCHES.PIASSA,
    tableNumber: 7,
    items: ['Chicken', 'Juice'],
    total: 900,
    status: 'pending',
  },
];
