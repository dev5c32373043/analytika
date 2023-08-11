export default () => ({
  env: process.env.NODE_ENV ?? 'development',

  host: process.env.HOST ?? '0.0.0.0',
  port: parseInt(process.env.PORT, 10) || 5555,
  db: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    salt: parseInt(process.env.JWT_SALT, 10) || 8,
  },
});
