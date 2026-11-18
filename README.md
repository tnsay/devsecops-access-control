# DineDesk API – DevSecOps Access Control

A demonstration restaurant ordering and payment API built with Node.js and Express. The project implements authentication, role-based permissions, branch-level authorization, secure configuration, and automated security tests.

## Features

- Password hashing with bcrypt.
- JWT authentication with a 15-minute expiry.
- Token verification using an explicit algorithm, issuer, and audience.
- Role-based permissions for waiters, cashiers, managers, and administrators.
- Branch-level access control for Bole and Piassa.
- Protected order, payment, report, and administration routes.
- Automated tests using Jest and Supertest.
- GitHub Actions workflow for continuous integration.
- Environment-based configuration and secret handling.

## Requirements

- Node.js 22 or later
- npm

## Setup

```bash
npm install
cp .env.example .env
```

Set a strong, random `JWT_SECRET` of at least 32 characters in your local `.env` file. Keep this file private and never commit it.

## Run the application

```bash
npm start
```

The API runs on port 3000 by default.

## Run tests

```bash
npm test
```

The test suite covers authentication, role permissions, branch isolation, and unauthorized access.

## Demo

This project uses fictional users, branches, orders, and payment responses for coursework demonstration. It does not connect to a real payment processor.

## Security

- `.env` is excluded from Git.
- `.env.example` contains placeholders only.
- JWT configuration is validated at startup.
- CI tests use a dummy test-only signing key, not a production secret.
