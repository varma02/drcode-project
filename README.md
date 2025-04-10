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

This guide assumes that you have `git` and `Docker` already on your system.

1. **Clone the repository:**
	Open a terminal in a directory of your chosing on you machine and type:
	```bash
	git clone https://github.com/varma02/drcode-project
	```
	 
3. **Navigate to the project directory:**
	```bash
	cd drcode-project
	```

4. **Make the necessary configurations**  
	Edit enviornment variables in the `docker-compose.yml` file (line 31-37)

5. **Run docker-compose:**
	Make sure that the 80 and 443 port is not occupied on your machine.
	```bash
	docker-compose up -d
	```

### Developer Documentation

The developer documentation is currently under construction, if you need information about the API endpoints please consult the [`openapi.spec.json`](https://github.com/varma02/drcode-project/blob/main/server/openapi.spec.json) file.
~~For more detailed information about the architecture, API endpoints, and how to contribute to the development of this project, please refer to the [Developer Documentation](https://github.com/varma02/drcode-project/blob/main/docs/dev.md).~~

### Authors

- **Kovács Tamás** – Front-end developer  
	[MaalnaKeX@GitHub](https://github.com/MaalnaKeX)
	
- **Váradi Marcell** – Back-end developer  
	[varma02@GitHub](https://github.com/varma02)

- **Nagy Bianka Rebeka**
	[Bianka191122@Github]([https://github.com/Bianka191122)

---

This project is under the MIT License - see the [LICENSE](https://github.com/varma02/drcode-project/blob/main/LICENSE.md) for more details.
