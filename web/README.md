# DR. CODE project frontend

This is the frontend part of our management application for DR. CODE. This directory contains the express.js API server and the database management cli.

The source code is written in JavaScript XML and TypeScript and uses the following notable technologies:
- **React**: Core UI library for building component-driven interfaces.
- **Vite**: A fast development environment and build tool.
- **Bun.js**: Fast JavaScript runtime Node.js alternative.
- **Tailwindcss**: Utility-first CSS framework for styling.
- **Shadcn**: Accessible, themeable, and customizable UI components built on Radix and Tailwind.
- **Axios**: Promise-based HTTP client for API communication.
- and **Docker** to make it simpler to deploy.

## Table of Contents

- [The devcontainer](#the-devcontainer)
- [Running the web server](#running-the-web-server)
- [Code Structure](#code-structure)
- [Backend functions](#backend-functions)
- [How to](#how-to)
  - [Create a new page](#create-a-new-page)
  - [Add a new endpoint](#add-a-new-endpoint)

## The devcontainer

This project comes with a devcontainer configuration that allows you to run everything in a containerized environment. This is useful for development and testing purposes, as it ensures that the application runs in a consistent environment.

Setting up the devcontainer is explained in the README file in the root of the project.
[Take me there](../README.md#devcontainer).

## Running the web server

You need the [devcontainer](#the-devcontainer) or some other surrealdb instance to run the server.
After that follow these steps get setup and run:
here](#environment)
- Setup the server [More details here](../server/README.md#running-the-server)
- Run `bun install` to install the dependencies.
- Run `bun dev` to run.


## Project structure

The code is organized into the following directories
(with **/** representing the frontend directory within the project):
- `/`: Contains configuration file and scripts for building and running the frontend.
  - `README.md`: This file, providing an overview of the frontend project.
  - `package.json`: Contains project metadata and dependencies.
  - `bun.lockb`: Lock file for Bun.js dependencies.
  - `.gitignore` and `.dockerignore`: Specifies files and directories that should not be present in the Git repo and the production build.
  - `nginx.conf`: Configures how the Nginx web server handles requests, including routing, proxying, security, and performance settings.
  - `LICENSE`: Contains the project license.
- `/src/`: Contains the source code of the application.
  - `index.css`: Style configuration file.
  - `main.jsx`: The entry point of the application, where the web is initialized.
  - `types.d.ts`: Global type definitions and overrides for the application.
  - `routes/`: Contains the web routes.
  - `components/`: Contains all the custom and [shadcn](https://ui.shadcn.com/docs/components) components.
  - `lib/`: Contains libraries and modules that provide additional functionality.
  - `hooks/`: Contains custom react hooks.

## Backend functions
| Method   | Args | Description                                                  |
|----------|-------------|--------------------------------------------------------------------------|
| `getAll` | token: string <br> endpoint: Endpoint <br> fetch?: string  |  Returns all the data from a given endpoint |
| `get`    | token: string <br> endpoint: Endpoint <br> ids: string[] <br> fetch?: string <br> include?: string | Returns one data based on the id from a given endpoint |
| `update` | token: string <br> endpoint: Endpoint <br> id: string <br> data: object | Updates one data based on the id from a given endpoint |
| `remove` | token: string <br> endpoint: Endpoint <br> ids: string[] | Removes a on or more data from the database from a given endpoint|
| `create` | token: string <br> endpoint: Endpoint <br> data: object | Creates a new record from the data given based on the endpoint |
| `register` | invite_id: string <br> name: string <br> email: string <br> password: string | Registers a new user |
| `getAllLessonsBetweenDates` | token: string <br> start: Date <br> end: Date <br> fetch?: string <br> include?: string | Gets all the lessons between 2 dates |
| `attendLesson` | token: string <br> lessonID: string <br> students: Array<string> | Save if the student attended a lesson |
| `getNextLesson` | token: string <br> fetch?: string <br> include?: string | Gets the next lesson |
| `getWorksheet` | token: string <br> id: string <br> paid?: boolean <br> fetch?: string <br> include?: string | Returns the worksheet of the logged is user |
| `getStats` | token: string | Returns useful stats for admins |


## How to

### Create a new page
To create a new page, make a new `.jsx` file inside the `/src/routes/` folder. Add a lazy import in the `main.jsx` file like this
```js
const NewPage = lazy(() => import('@/routes/NewPage'))
```
```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarWrapper />,
    children: [
      ...
      // add is as an unrestricted route
      {path: "/newPage", element: <NewPage />},
      // or add route protection
      {path: "/newPage", element: <AdminOnlyRoute children={<NewPage/>} />},
      ...
    ],
    ...
  }
])
```

### Add a new endpoint
Append the name of the new endpoint to the `endpoints` constant in the `api.ts` file. This will create a `getAll`, `get`, `update`, `remove` and `create` methods.

It also updates the build-in dev command menu (chortcut: `Ctrl+K`), where you can log the result of the `getAll` generated function.



