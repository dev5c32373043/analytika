# Basic Analytics Service

This service introduces a microservices-based approach, enabling the tracking of user activities.

## Architecture

The project adopts a microservice architecture, structured around four distinct services: activities, customers, reports, and gateway. Each service is implemented as a separate NestJS application. The gateway service plays a pivotal role in the architecture by directing incoming requests to their respective target services. The activities service manages the reception and storage of user-generated activities. On the other hand, the customers service handles the storage of customer-related data and provides authentication and authorization functionalities. The reports service, on its part, focuses on the generation of reports based on the recorded user activities. Inter-service communication is facilitated through the use of the TCP protocol, enabling seamless interaction between the services. The gateway service also acts as the interface between the backend services and the frontend application. The frontend application, constructed using React, is responsible for visually presenting reports and user activities, ensuring a user-friendly experience for interacting with the system.

![Representation of app architecture](https://github.com/dev5c32373043/analytika/blob/main/architecture.png?raw=true)

## Activity flow

An activity is submitted to the activities service via HTTP. The activities service then validates the API token by checking with the customers service. If the API token is found to be valid, it is stored for a duration of one day to prevent unnecessary repeated requests.

After successfully creating the activity, it is dispatched to the Apache Pulsar queue. Additionally, a notification message is sent to the reports service.

Subsequently, the reports service initiates a delayed job that is responsible for consuming the newly added activities from the queue. Within this job, various computations are performed on the activities, and the database is updated with the resulting new data.

## Getting started

To start the project install all dependencies in requrements section.
Add `.env` file in each project (`.test.env` as an example)

Install npm packages and run the following command:

```
npm run start:dev
```

## Running tests

To execute activities e2e tests run the following command:

```
npm run activities:e2e
```

To execute gateway e2e tests run the following command:

```
npm run gateway:e2e
```

To execute frontend e2e tests run the following command:

```
npm run frontend:e2e
```

## Requirements

- [nx][nx] 16.5.3+
- [Node.js][node] 18.16.0+
- [Nest.js][nestjs] 10.0.0+
- [PostgreSQL][postgresql] 12.11+
- [ScyllaDB][scylla] 5.2.2+
- [MongoDB][mongo] 5.0.2+
- [Redis][redis] 5.0.7+

[nx]: https://nx.dev/
[node]: https://nodejs.org/
[nestjs]: https://nestjs.com/
[postgresql]: https://www.postgresql.org/
[scylla]: https://www.scylladb.com/
[mongo]: https://www.mongodb.com/
[redis]: https://redis.io/
