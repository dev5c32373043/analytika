import { Transport } from '@nestjs/microservices';

export default () => ({
  env: process.env.NODE_ENV ?? 'development',

  tcpHost: process.env.TCP_HOST ?? '0.0.0.0',
  tcpPort: parseInt(process.env.TCP_PORT, 10) || 3001,
  httpPort: parseInt(process.env.HTTP_PORT, 10) || 3005,
  scylladb: {
    clientOptions: {
      contactPoints: [process.env.DB_HOST],
      keyspace: process.env.DB_KEYSPACE ?? 'dev',
      localDataCenter: process.env.DB_LOCAL_DATACENTER ?? 'datacenter1',
      protocolOptions: {
        port: parseInt(process.env.DB_PORT, 10),
      },
      credentials: {
        username: process.env.DB_USER ?? '',
        password: process.env.DB_PASSWORD ?? '',
      },
      queryOptions: {
        consistency: parseInt(process.env.DB_CONSISTENCY, 10) || 1,
      },
      socketOptions: {
        readTimeout: parseInt(process.env.DB_READ_TIMEOUT, 10) || 60000,
      },
    },
    ormOptions: {
      createKeyspace: true,
      defaultReplicationStrategy: {
        class: 'SimpleStrategy',
        replication_factor: 1,
      },
      migration: process.env.DB_MIGRATION_BEHAVIOUR ?? 'alter',
    },
    skipQueryTypeCheck: true,
  },
  pulsar: {
    serviceUrl: process.env.PULSAR_SERVICE_URL,
  },
  reportsService: {
    options: {
      host: process.env.REPORTS_SERVICE_HOST,
      port: process.env.REPORTS_SERVICE_PORT,
    },
    transport: Transport.TCP,
  },
  customersService: {
    options: {
      host: process.env.CUSTOMERS_SERVICE_HOST,
      port: process.env.CUSTOMERS_SERVICE_PORT,
    },
    transport: Transport.TCP,
  },
  notificationDelay: parseInt(process.env.NOTIFICATION_DELAY, 10) || 1000,
});
