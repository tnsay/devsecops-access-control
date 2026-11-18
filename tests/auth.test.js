import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../src/app.js';
import config from '../src/config/config.js';

let waiterBoleToken;
let cashierBoleToken;
let managerBoleToken;
let managerPiassaToken;
let adminToken;

async function login(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  expect(response.status).toBe(200);
  return response.body.token;
}

beforeAll(async () => {
  waiterBoleToken = await login(
    'waiter.bole@dinedesk.test',
    'WaiterBole123!'
  );

  cashierBoleToken = await login(
    'cashier.bole@dinedesk.test',
    'CashierBole123!'
  );

  managerBoleToken = await login(
    'manager.bole@dinedesk.test',
    'ManagerBole123!'
  );

  managerPiassaToken = await login(
    'manager.piassa@dinedesk.test',
    'ManagerPiassa123!'
  );

  adminToken = await login(
    'admin@dinedesk.test',
    'AdminDineDesk123!'
  );
});

describe('DineDesk authentication and authorization security', () => {
  test('1. rejects requests without a token', async () => {
    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(401);
  });

  test('2. rejects a token signed with the wrong secret', async () => {
    const badToken = jwt.sign(
      {},
      'this-is-the-wrong-signing-secret',
      {
        subject: '1',
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
        expiresIn: '15m',
        algorithm: 'HS256',
      }
    );

    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${badToken}`);

    expect(response.status).toBe(401);
  });

  test('3. rejects an expired token', async () => {
    const expiredToken = jwt.sign(
      {},
      config.jwt.secret,
      {
        subject: '1',
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
        expiresIn: -1,
        algorithm: 'HS256',
      }
    );

    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });

  test('4. rejects a malformed Bearer token', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(response.status).toBe(401);
  });

  test('5. prevents a waiter from accessing admin users', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${waiterBoleToken}`);

    expect(response.status).toBe(403);
  });

  test('6. allows an admin to list users without password hashes', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(7);
    expect(response.body.every((user) => !('passwordHash' in user))).toBe(true);
  });

  test('7. allows a waiter to create an order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${waiterBoleToken}`)
      .send({
        tableNumber: 9,
        items: ['Coffee'],
        total: 120,
      });

    expect(response.status).toBe(201);
    expect(response.body.branchId).toBe(1);
  });

  test('8. prevents a cashier from creating an order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${cashierBoleToken}`)
      .send({
        tableNumber: 10,
        items: ['Tea'],
        total: 80,
      });

    expect(response.status).toBe(403);
  });

  test('9. allows a Bole manager to read a Bole order', async () => {
    const response = await request(app)
      .get('/api/orders/101')
      .set('Authorization', `Bearer ${managerBoleToken}`);

    expect(response.status).toBe(200);
    expect(response.body.branchId).toBe(1);
  });

  test('10. denies a Bole manager access to a Piassa order', async () => {
    const response = await request(app)
      .get('/api/orders/201')
      .set('Authorization', `Bearer ${managerBoleToken}`);

    expect(response.status).toBe(404);
  });

  test('11. allows a Piassa manager to read a Piassa order', async () => {
    const response = await request(app)
      .get('/api/orders/201')
      .set('Authorization', `Bearer ${managerPiassaToken}`);

    expect(response.status).toBe(200);
    expect(response.body.branchId).toBe(2);
  });

  test('12. denies a Piassa manager access to a Bole order', async () => {
    const response = await request(app)
      .get('/api/orders/101')
      .set('Authorization', `Bearer ${managerPiassaToken}`);

    expect(response.status).toBe(404);
  });

  test('13. prevents a waiter from reading branch reports', async () => {
    const response = await request(app)
      .get('/api/reports/branch')
      .set('Authorization', `Bearer ${waiterBoleToken}`);

    expect(response.status).toBe(403);
  });

  test('14. ignores a requested branch ID when generating reports', async () => {
    const response = await request(app)
      .get('/api/reports/branch?branchId=1')
      .set('Authorization', `Bearer ${managerPiassaToken}`);

    expect(response.status).toBe(200);
    expect(response.body.branchId).toBe(2);
    expect(response.body.orders.every((order) => order.branchId === 2)).toBe(true);
  });
});