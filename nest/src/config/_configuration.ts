export default () => ({
  port: 9001,
  database: {
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
  },
  jwt: {
    secret: '',
    expiresIn: '',
  },
  redis: {
    host: 'localhost',
    port: 6379,
    ttl: 10800, // 3 часа
    auth: {
      user: '',
      pass: '',
    },
  },
});
