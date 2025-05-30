# DR. CODE project backend

This is the backend part of our management application for DR. CODE. This directory contains the express.js API server and the database management cli.

The source code is written in TypeScript and uses the following notable technologies:
- **Express.js**: A web framework for Node.js to build APIs.
- **SurrealDB**: A real-time database for storing and managing data.
- **Bun.js**: A fast JavaScript Node.js replacement for running, building and testing.
- and **Docker** to make it simpler to deploy.

## Table of Contents

- [The devcontainer](#the-devcontainer)
- [Code Structure](#code-structure)
- [Environment](#environment)
- [Database CLI](#database-cli)

## The devcontainer

This project comes with a devcontainer configuration that allows you to run everything in a containerized environment. This is useful for development and testing purposes, as it ensures that the application runs in a consistent environment.

Setting up the devcontainer is explained in the README file in the root of the project.
[Take me there](../README.md#devcontainer).

## Running the server

You need the [devcontainer](#the-devcontainer) or some other surrealdb instance to run the server.

## Code Structure

The code is organized into the following directories
(with **/** representing the server directory within the project):
- `/`: Contains configuration file and scripts for building and running the server.
  - `README.md`: This file, providing an overview of the backend project.
  - `package.json`: Contains project metadata and dependencies.
  - `bun.lockb`: Lock file for Bun.js dependencies.
  - `tsconfig.json`: TypeScript configuration file.
  - `Dockerfile`: Used for building the server image.
  - `.gitignore` and `.dockerignore`: Specifies files and directories that should not be present in the Git repo and the production build.
  - `.env` and `.env.template`: Environment variable configuration files. [More details here.](#environment)
- `/src/`: Contains the source code of the application.
  - `index.ts`: The entry point of the application, where the server is initialized.
  - `openapi.spec.json`: OpenAPI specification for the API, defining endpoints and data structures.
  - `types.d.ts`: Global type definitions and overrides for the application.
  - `routes/`: Contains the API route handlers.
  - `middleware/`: Functions that process requests before they reach the route handlers.
  - `lib/`: Contains libraries and modules that provide additional functionality.
  - `database/`: Contains database-related code, including models, migrations and code for the db cli. [More details here.](#database-cli)
- `/tests/`: Contains unit and integration tests for the application.
  - `cases.test.ts`: Test definitions for the API endpoints.
  - `utils.ts`: Utility functions for testing.

## Environment

The application uses environment variables to configure various settings. The `.env` file should contains the actual values, while `.env.template` provides a template with default values and descriptions for what they do.

| Name             | Default          | Description                                                            |
|------------------|------------------|------------------------------------------------------------------------|
| API_PORT         | 3000             | The port on which the API server listens.                              |
| API_MODE         | dev              | The mode in which the API server runs. Can be `dev`, `prod` or `test`. |
| AUTHTOKEN_SECRET | verysecure       | Secret key used to sign authentication tokens.                         |
| FILETOKEN_SECRET | verysecure       | Secret key used to sign file handling tokens.                          |
| DB_URL           | ws://db:8000/rpc | URL of the SurrealDB instance.                                         |
| DB_NAMESPACE     | DRCODE           | Namespace to use in the SurrealDB instance.                            |
| DB_DATABASE      | main             | Database to use in the namespace.                                      |
| DB_USERNAME      | root             | Username for the SurrealDB instance.                                   |
| DB_PASSWORD      | root             | Password for the SurrealDB instance.                                   |

## Database CLI

The database CLI is a command-line tool that helps automate some tasks related to managing the database. While it is not a fully featured ORM like Prisma, it provides a simple way to reset, migrate and seed the database the latter being especially important during development.

Using it is as simple as,
- opening a terminal,
- navigating to the server directory via `cd server`,
- and running `bun db` to see the available commands.

Here are a list of the available commands and their descriptions
(note that all of them require the `bun db` "prefix" to run):

| Command          | Description                                                               |
|------------------|---------------------------------------------------------------------------|
| `status`  | Displays the current status of the database, including migrations and seed data. |
| `migrate` | Applies any pending migrations to the database.                                  |
| `reset`   | Resets the database by dropping and recreating it by applying all migrations. Use the `--no-seed` argument if you want to create and empty database without the seed data |
| `seed`    | Seeds the database with initial data.                                            |
| `create_migration` | Creates a new migration file in the approperiate directory.             |

## How to

This section looks at some common tasks and explains how to do them.

### Create a new endpoint

- First describe the endpoint in the OpenAPI specification file `src/openapi.spec.json`. This is important for documentation and validation.
- Then have a look in the `/src/routes/` directory and decide to either create a new file for the endpoint or add it to an existing file.
  - If you create a new file make sure to name it according to the base path of the endpoint, e.g. `auth.ts` for `/auth`.
  - The file must export an `express.Router` instance that contains the route handlers for the endpoint.
  - You will also need to import it in `/src/index.ts` so that it is registered with the express application.
- Implement the route handlers in the file. You can use functions and helpers from the `/lib/`, `/middleware/` and `/database/` directories.
- Lastly, make sure to add tests for the endpoint in the `/tests/cases.test.ts` file. This is important to ensure that the endpoint works as expected and to prevent regressions in the future. [More details here.](#testing)

