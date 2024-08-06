Task Project Day 25 Bearmentor:

- Production: `https://restapihono.com`
- Local: `http://localhost:3000`

| Endpoint        | HTTP     | Description            |
| --------------- | -------- | ---------------------- |
| `/users`        | `GET`    | Get all users          |
| `/users/:id`    | `GET`    | Get user by id         |
| `/users/create` | `POST`   | P ost/Create data user |
| `/users`        | `DELETE` | Delete all data users  |
| `/users/:id`    | `DELETE` | Delete user by id      |
| `/users/:id`    | `PATCH`  | Patch/Edit user by id  |

Then send HTTP requests by using API clients such as:

- [Postman](https://postman.com)
- [Insomnia](https://insomnia.rest)
- [Hoppscotch](https://hoppscotch.io)
- [Apidog](https://apidog.com)
- [Yaak](https://yaak.app)
- [Thunder Client](https://thunderclient.com)
- [Firecamp](https://firecamp.io)
- [Firecamp Web](https://firecamp.dev)

Command CLI for install node modules

## Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications.

- [Docker Compose](https://docs.docker.com/compose)

With Compose, a YAML file is usd to configure the application’s services. Then, with a single command, it can create and start all the services from the configuration.

Key Concepts:

- Services: A service is a container that does a specific job within the application.
- Volumes: Volumes allow data to persist and be shared among containers.
- Networks: Networks allow containers to communicate with each other.

For example, to define services in a `docker-compose.yml` or `compose.yaml` file, for a simple application with a web and a database service.

> [!NOTE]
> 🗒️ Notes from Haidar: We'll cover about actually using the database in the next sessions. For now it's just to make sure everyone can run Docker and Docker Compose with a database on their computers.

```yaml
services:
  backend:
    image: example-backend # Remember to change the image name
    build:
      context: .
    ports:
      - "3000:3000"
    depends_on:
      - database
  database:
    image: postgres:alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: example_user
      POSTGRES_PASSWORD: example_password
      POSTGRES_DB: example_database
```

Then start the application using Docker Compose, assuming there's already either `docker-compose.yml` or `compose.yml` file:

```sh
docker compose up
```

To run with custom non-default file name:

```sh
docker compose -f compose-other.yaml up
```

To run in the background or detached mode:

```sh
docker compose up -d
```

To build the image again before running:

```sh
docker compose up --build
```

Although in the beginning it's quick to set the environment variables for the user, password, database in the Docker Compose file, it's not safe. It will be more secure using other methods which will not commit the credentials.

```
npm install
```

Open Output Project

```
http://localhost:3000
```
