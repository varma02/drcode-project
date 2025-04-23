# DR.CODE Kecskemét - Management App

DR.CODE Kecskemét provides interactive, hands-on programming courses for kids. Our primary focus is to make this company's day-to-day operations simpler. This application will them assist employees in more effectively managing their classes, students and lessons, organizing the learning environment, looking up study material and much more.

### Features

1. **Employee management**  
	With a two role system (admin and teacher) the company can track everyone's working hours and therefore their salary
2. **Classes and lessons**  
	Admins create classes, enrol students, assign them teachers, and see lessons that those teachers gave
3. **Asset management**  (coming soon™)
	Admins can manage the company's assets such as Laptops, PCs, lego sets and more
4. **Knowledge base**  (comign soon)
	Important documents can be stored in the app for easy access to all employees
5. **And much more**

### Running the application

**The project is under active development and is not ready for production use yet.**

## Developer Documentation

### Devcontainer

The devcontainer is a configured development enviornment for the project using docker. This makes collaboration and consistency with the future production enviornment easier.

The easiest way to get started with the devcontainer (assuming you already have docker installed and running on your machine) is by:
 1. Cloning the repo on your machine
 2. Opening the folder in VSCode
 3. Installing the [Devcontainers](https://marketplace.visualstudio.com/items/?itemName=ms-vscode-remote.remote-containers) extension
 4. And running `Reopen in container`

Once the containers are downloaded and running, inside the devcontainer you should have access to a surrealdb instance on `http://db:8000/` and NGINX is also configured to proxy ports `5173` at `/` and `3000` at `/api`. Note that the NGINX port is not forwarded by default so you need to do that from VSCode by adding `nginx:80` to the ports tab.

### Repo structure

This repository contains every part of the application, kind-of like a monorepo.  
 - The `server` folder has the API written in ExpressJS
 - And the `web` folder has the React frontend with shadcn/ui
 - Also there is an `nginx.conf` and a `docker-compose.yaml` file in the root folder, which contain the production config

### Server environment

The ExpressJS API part of the app needs a few environment variables to work. There is a `.env.template` file that explains what the variables do.  
After configutring the environment, you will need to apply migrations to the database and optionally seed data aswell. To do that, open a terminal, `cd` into the `server` directory and run `bun db reset`.

### Starting the dev server 

Now you are ready to start the devserver. Both the frontend and backend are configured to automatically refresh whem you make changes to the code. To start them, open 2 terminals and -
 - In the first one run the server by `cd`-ing into it's directory and running `bun dev`
 - In the second one run the frontend by `cd`-ing into it's directory and running `bun dev`

Now the application should be accessible on `localhost:PORT` where `PORT` is the NGINX port you forwarded earlier.

### REST API endpoints

The ExpressJS API validates every endpoint at input and output phase to match the OpenAPI configuration file found in the `server` directory. This file (`openapi.spec.json`) also acts as the documentation for the APi routes. You can open it with any OpenAPI 3.0 viewer you like, for example [this VSCode extension](https://marketplace.visualstudio.com/items/?itemName=AndrewButson.vscode-openapi-viewer).

The developer documentation is currently under construction, if you need information about the API endpoints please consult the [`openapi.spec.json`](https://github.com/varma02/drcode-project/blob/main/server/openapi.spec.json) file.

### Dev docs to be continued...

## Authors

- **Kovács Tamás** – Front-end developer  
	[MaalnaKeX@GitHub](https://github.com/MaalnaKeX)
	
- **Váradi Marcell** – Back-end developer  
	[varma02@GitHub](https://github.com/varma02)

- **Nagy Bianka Rebeka**  
	[Bianka191122@Github](https://github.com/Bianka191122)

---

This project is under the MIT License - see the [LICENSE](https://github.com/varma02/drcode-project/blob/main/LICENSE.md) for more details.
