import { Transport } from '@nestjs/microservices';

export default () => ({
  env: process.env.NODE_ENV ?? 'development',
  host: process.env.HOST ?? 'localhost',
  port: parseInt(process.env.HTTP_PORT, 10) || 3000,
  cookieSecret: process.env.COOKIE_SECRET,

  activitiesService: {
    options: {
      host: process.env.ANALYTICS_SERVICE_HOST,
      port: process.env.ANALYTICS_SERVICE_PORT,
    },
    transport: Transport.TCP,
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
});
