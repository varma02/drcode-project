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

## Contents
- [Installation](#running-the-application)
- [Administrator's guide](#administrators-guide)
	- [Registering new employees](#registering-new-employees)
	- [Management](#managing-stuff)
- [Developer Documentation](#developer-documentation)
	- [Devcontainer](#devcontainer)
	- [Repo structure](#repo-structure)
	- [Server environment](#server-environment)
	- [Starting the dev server](#starting-the-dev-server)
	- [REST API](#rest-api)
		- [OpenAPI](#openapi)
		- [Testing](#testing)
	- [Frontend environment](#frontend-environment)

### Running the application

***!! The project is under active development and is not ready for production use yet !!***

 1. Download or clone this repository.  
    `git clone https://github.com/varma02/drcode-project`
 2. Modify the environment variables in `docker-compose.yaml`, especially the secrets and passwords.
 3. Run the containers.  
    `docker-compose up -d`
 4. Login with the default credentials
```
	Username: admin@example.com
	Password: 1234
```

### Administrator's guide

As an administrator you can manage everything in the application. You can create classes, assign students to them, assign teachers to classes, manage employees and their roles, and much more. The application is designed to be intuitive and easy to use. You can navigate through the different sections using the sidebar on the left.
You will find all the management pages in the admin section of the sidebar.

#### Registering new employees

Navigate to the `Alkalmazottak` tab via the sidabar and click on `+ Meghívás`. Select what roles the new employee should have and click submit. You will be presented with a link, copy it and send it to the new employee.  
Note that every invite is single use only and gets deleted after. You can see active/unused invites in the top of the `Alkalmazottak` tab.

### Creating groups/classes

Go to the `Csoportok` tab via the sidebar and click on `+ Hozzáadás`. Fill out the form and optionally select `Órák Generálása` to generate lessons. After you created the group you can assign students to it by selecting the group then clicking on `+ Hozzáadás` in the `Diákok` section.


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

### REST API

The application's main backend is a REST API written in ExpressJS. It is responsible for handling all the requests from the frontend and returning the appropriate data. The API is designed to be simple and easy to use.

#### OpenAPI

The ExpressJS API validates every endpoint at input and output phase to match the OpenAPI configuration file found in the `server` directory. This file (`openapi.spec.json`) also acts as the documentation for the APi routes. You can open it with any OpenAPI 3.0 viewer you like, for example [this VSCode extension](https://marketplace.visualstudio.com/items/?itemName=AndrewButson.vscode-openapi-viewer).

#### Testing

Tests are defined in the `test/cases.test.ts` file. The testing framework used is [bun](https://bun.sh/)'s built in test module. You can run the tests by opening a terminal in the `server` directory and running `bun test`.

### Frontend environment

The frontend part is a React application using:
   - [tailwindcss](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com/) for styling the UI components,
   - [react-router](https://reactrouter.com/home) for routing between pages,
   - [axios](https://axios-http.com/) for making requests to the API,
   - and [lucide](https://lucide.dev/) for the icons.
  

## Authors

- **Kovács Tamás** – Front-end developer  
	[MaalnaKeX@GitHub](https://github.com/MaalnaKeX)
	
- **Váradi Marcell** – Back-end developer  
	[varma02@GitHub](https://github.com/varma02)

- **Nagy Bianka Rebeka**  
	[Bianka191122@Github](https://github.com/Bianka191122)

---

This project is under the MIT License - see the [LICENSE](https://github.com/varma02/drcode-project/blob/main/LICENSE.md) for more details.
