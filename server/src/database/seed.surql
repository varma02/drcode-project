BEGIN TRANSACTION;

$defadmin = CREATE ONLY employee CONTENT {
  name: "Default Administrator",
  email: "admin@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator"]
};

$ivett = CREATE ONLY employee CONTENT {
  name: "Ivett Virág",
  email: "ivett@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator"]
};

$vrolandd = CREATE ONLY employee CONTENT {
  name: "V Rolandd",
  email: "vrolandd@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator", "teacher"]
};

$nepirtas = CREATE ONLY employee CONTENT {
  name: "Kovács Tamás",
  email: "ugyesz@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

$mano = CREATE ONLY employee CONTENT {
  name: "Máté Manó Bárdos",
  email: "mano@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

$scratch = CREATE ONLY subject CONTENT {
  name: "Scratch kezdő",
  description: "Legózás után első lépés a programozás felé"
};

$kodular = CREATE ONLY subject CONTENT {
  name: "Kodular",
  description: "Scratch-nél nehezebb, telefonos alkalmazás fejlesztés"
};

$elek = CREATE ONLY student CONTENT {
  name: "Ebéd Elek",
  parent: {
    name: "Ebéd Bakos",
    email: "support@bakos.hu",
    phone: "+36204171404"
  },
};

$joska = CREATE ONLY student CONTENT {
  name: "Főznünk Kell Józsi",
  parent: {
    name: "Mr Fehér",
    email: "walter@citromail.hu",
    phone: "+36 72 696 969"
  },
};

$fohadiszallas = CREATE ONLY location CONTENT {
  name: "Főhadiszállás",
  address: "123 Itta Rendőrség",
  contact_email: "admin@example.com",
  contact_phone: "+36301111111"
};

$csoport1 = CREATE ONLY group CONTENT {
  location: $fohadiszallas.id,
  teachers: [$nepirtas.id],
};

$cs1ora1 = CREATE ONLY lesson CONTENT {
  group: $csoport1.id,
  start: d'2024-12-02T16:10:00+01:00',
  end: d'2024-12-02T17:10:00+01:00',
};

$cs1ora2 = CREATE ONLY lesson CONTENT {
  group: $csoport1.id,
  start: d'2024-12-09T16:10:00+01:00',
  end: d'2024-12-09T17:10:00+01:00',
};

RELATE $elek->enroled->$csoport1 CONTENT {
  subject: $kodular.id,
  price: 620,
};

RELATE $joska->enroled->$csoport1 CONTENT {
  subject: $scratch.id,
  price: 1500,
};

COMMIT TRANSACTION;