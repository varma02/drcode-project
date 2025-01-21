# KKK
- Életszerű, valódi problémára nyújt megoldást.
-  Adattárolási és -kezelési funkciókat is megvalósít.
- RESTful architektúrának megfelelő szerver és kliens oldali komponenseket egyaránt
tartalmaz.
- A kliens oldali komponens vagy komponensek egyaránt alkalmasak asztali és mobil
eszközökön történő használatra. Mobil eszközre kifejlesztett kliens esetén natív mobil
alkalmazás, vagy azzal hozzávetőlegesen megegyező felhasználói élményt nyújtó
webes kliens egyaránt alkalmazható. Asztali eszközökre fejlesztett kliens oldali
komponensnél mindenképpen szükséges webes megvalósítás is, de emellett
opcionálisan natív, asztali alkalmazás is a csomag része lehet. (pl. A felhasználóknak
szánt interfész webes megjelenítést használ, míg az adminisztrációs felület natív
asztali alkalmazásként készül el).
- A forráskódnak a tiszta kód elveinek megfelelően kell készülnie.
- A szoftver célját, komponenseinek technikai leírását, működésének műszaki feltételeit
és használatának rövid bemutatását tartalmazó dokumentáció is része a csomagnak. 

# Documentation
- [ ] Create README file
- [x] Add license
- [ ] Write front-end docs
- [ ] Write API docs

# Front-end
- [x] Login screen design
- [ ] Register page design
- [x] Teacher dashboard design
	- [x] Next lesson card
	- [x] Knowledge base card
	- [x] Notice board card
- [x] Sidebar design
- [x] Calendar / schedule page design
- [ ] Admin dashboard design
- [x] Profile page design
- [ ] Route transitions
- [ ] Add Poppins font

# Back-end
- [x] Create a cli for database management
- [x] Create initial db migration
- [x] Create base express.js app
- [x] Get started with testing
- Middlewares
	- [x] ensureauth
	- [x] ensureadmin
- Authentication
	- [x] Register
	- [x] Login
	- [x] Clear sessions
	- [x] Get logged in user
	- [x] Update user
	- [ ] docs
- Employees
	- [x] Default CRUD
	- [x] Invite new employees
	- [x] get unpaid work
	- [x] get groups where employee is a teacher
	- [ ] docs
- Groups
	- [x] Default CRUD
	- [x] get lessons
	- [x] get enroled students
	- [x] get subjects
	- [ ] docs
- Students
	- [x] Default CRUD
	- [ ] get groups where student is enroled
	- [ ] get attendance
	- [ ] docs
- Lessons
	- [x] Default CRUD
	- [x] get lessons between dates
	- [x] get attendance
	- [x] get replacing students
	- [ ] docs
- Locations
	- [x] Default CRUD
	- [ ] get groups at location
	- [ ] get lessons at location
	- [ ] docs
- Subjects
	- [x] Default CRUD
	- [ ] get groups with subject
	- [ ] get teachers who teach subject
	- [ ] docs
- Invites
	- [x] Default CRUD
	- [ ] docs
- Messaging
	- [x] Default CRUD
	- [x] get all addressed to user
	- [x] get all of author addressed to user
	- [x] attachments
	- [ ] docs