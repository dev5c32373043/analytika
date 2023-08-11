export default () => ({
  env: process.env.NODE_ENV ?? 'development',

  host: process.env.HOST ?? '0.0.0.0',
  port: parseInt(process.env.PORT, 10) || 3333,
  db: {
    mongoURI: process.env.MONGO_URI,
  },
  pulsar: {
    serviceUrl: process.env.PULSAR_SERVICE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  computeActivitiesDelay: parseInt(process.env.COMPUTE_ACTIVITIES_DELAY, 10) || 1000,
  pulsarReceiveTimeout: parseInt(process.env.PULSAR_RECEIVE_TIMEOUT, 10) || 5000,
});
