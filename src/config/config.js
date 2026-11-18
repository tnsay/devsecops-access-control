import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/**
 * Validate application configuration.
 * Never expose secret values in error messages.
 */
function loadConfig() {
  const errors = [];

  // Validate PORT
  const rawPort = process.env.PORT || '3000';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push('PORT must be an integer between 1 and 65535.');
  }

  // Validate JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    errors.push('JWT_SECRET environment variable is missing.');
  } else if (jwtSecret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long.');
  }

  // Validate JWT issuer
  const jwtIssuer = process.env.JWT_ISSUER;

  if (!jwtIssuer) {
    errors.push('JWT_ISSUER environment variable is missing.');
  }

  // Validate JWT audience
  const jwtAudience = process.env.JWT_AUDIENCE;

  if (!jwtAudience) {
    errors.push('JWT_AUDIENCE environment variable is missing.');
  }

  // Stop startup if configuration is invalid
  if (errors.length > 0) {
    throw new Error(
      `Configuration validation failed:\n- ${errors.join('\n- ')}`
    );
  }

  return {
    env: process.env.NODE_ENV || 'development',
    port,
    jwt: {
      secret: jwtSecret,
      issuer: jwtIssuer,
      audience: jwtAudience,
      expiresIn: '15m',
    },
  };
}

const config = loadConfig();

export default config;
