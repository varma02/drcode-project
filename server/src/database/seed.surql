-- BEGIN TRANSACTION;

$constid1 = CREATE ONLY employee:12345 CONTENT {
  name: "Const Id For Testing",
  email: "12345@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator"]
};

$constid2 = CREATE ONLY employee:54321 CONTENT {
  name: "Const Id For Testing",
  email: "54321@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

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

$varma = CREATE ONLY employee CONTENT {
  name: "Váradi Marcell",
  email: "varma@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

$scratch = CREATE ONLY subject CONTENT {
  name: "Scratch kezdő",
  notes: "Legózás után első lépés a programozás felé"
};

$kodular = CREATE ONLY subject CONTENT {
  name: "Kodular",
  notes: "Scratch-nél nehezebb, telefonos alkalmazás fejlesztés"
};

$lego1 = CREATE ONLY subject CONTENT {
  name: "Lego WeDo 1.0",
  notes: "Belépő szintű kurzus, legozás 3-4. évfolyamnak"
};

$fohadiszallas = CREATE ONLY location CONTENT {
  name: "Főhadiszállás",
  address: "6000 Kecskemét, Batthyány utca 11.",
  contact_email: "admin@example.com",
  contact_phone: "+36301111111"
};

$ezi = CREATE ONLY location CONTENT {
  name: "Kodály Zoltán Ének-Zenei Általános Iskola",
  address: "6000 Kecskemét, Dózsa György út 22.",
  contact_email: "valaki@kodaly-iskola.hu",
  contact_phone: "0676508821"
};

$arany = CREATE ONLY location CONTENT {
  name: "Arany János Általános Iskola",
  address: "6000 Kecskemét, Lukányi János utca 10.",
  contact_email: "valaki@keszeiskola.hu",
  contact_phone: "0676478549"
};

$dok1 = CREATE ONLY group CONTENT {
  name: "DOK Hétfő 15:00",
  location: $fohadiszallas.id,
  teachers: [$vrolandd.id],
};

$cs1ora1 = CREATE ONLY lesson CONTENT {
  group: $dok1.id,
  start: time::now(),
  end:  time::now() + 1h,
};

$cs1ora2 = CREATE ONLY lesson CONTENT {
  group: $dok1.id,
  start: time::now() + 1w,
  end:  time::now() + 1w + 1h,
};

$cs1ora2 = CREATE ONLY lesson CONTENT {
  group: $dok1.id,
  start: time::now() + 2w,
  end:  time::now() + 2w + 1h,
};

$kodaly1 = CREATE ONLY group CONTENT {
  name: "Kodály Kedd 16:00",
  location: $ezi.id,
  teachers: [$varma.id],
};

$cs2ora1 = CREATE ONLY lesson CONTENT {
  group: $kodaly1.id,
  start: time::now() + 1d + 2h,
  end:  time::now() + 1d + 2h + 1h,
};

$cs2ora2 = CREATE ONLY lesson CONTENT {
  group: $kodaly1.id,
  start: time::now() + 1d + 1w + 2h,
  end:  time::now() + 1d + 1w + 2h + 1h,
};

$cs2ora2 = CREATE ONLY lesson CONTENT {
  group: $kodaly1.id,
  start: time::now() + 1d + 2w + 2h,
  end:  time::now() + 1d + 2w + 2h + 1h,
};

$arany1 = CREATE ONLY group CONTENT {
  name: "Arany Szerda 15:00",
  location: $arany.id,
  teachers: [$nepirtas.id],
};

$cs3ora1 = CREATE ONLY lesson CONTENT {
  group: $arany1.id,
  start: time::now() + 2d - 1h,
  end:  time::now() + 2d - 1h + 1h,
};

$cs3ora2 = CREATE ONLY lesson CONTENT {
  group: $arany1.id,
  start: time::now() + 2d + 1w - 1h,
  end:  time::now() + 2d + 1w - 1h + 1h,
};

$cs3ora2 = CREATE ONLY lesson CONTENT {
  group: $arany1.id,
  start: time::now() + 2d + 2w - 1h,
  end:  time::now() + 2d + 2w - 1h + 1h,
};

$elek = CREATE ONLY student CONTENT {
  name: "Ebéd Elek",
  grade: 5,
  parent: {
    name: "Ebéd Bakos",
    email: "support@bakos.hu",
    phone: "+36204171404"
  },
};

$joska = CREATE ONLY student CONTENT {
  name: "Főznünk Kell Józsi",
  grade: 4,
  parent: {
    name: "Mr Fehér",
    email: "walter@citromail.hu",
    phone: "+36 72 696 969"
  },
};

$pisti = CREATE ONLY student CONTENT {
  name: "Erős Pista",
  grade: 5,
  parent: {
    name: "Univer-Product Zrt.",
    email: "informacio@univer.hu",
    phone: "+36 76 518 100"
  },
};

$peti = CREATE ONLY student CONTENT {
  name: "Molnár Péter",
  grade: 3,
  parent: {
    name: "Molnár Katalin",
    email: "kati5337@example.com",
    phone: "+36301111111"
  },
};

$ferko = CREATE ONLY student CONTENT {
  name: "Ferenc József",
  grade: 4,
  parent: {
    name: "Ferenc Károly",
    email: "info@amonarchiaorok.hu",
    phone: "06761848122"
  },
};

RELATE $elek->enroled->$dok1 CONTENT {
  subject: $kodular.id,
  price: 620,
};

RELATE $joska->enroled->$dok1 CONTENT {
  subject: $scratch.id,
  price: 1500,
};

RELATE $joska->enroled->$kodaly1 CONTENT {
  subject: $lego1.id,
  price: 1500,
};

RELATE $pisti->enroled->$dok1 CONTENT {
  subject: $scratch.id,
  price: 990,
};

RELATE $peti->enroled->$arany1 CONTENT {
  subject: $kodular.id,
  price: 1230,
};

RELATE $pisti->enroled->$arany1 CONTENT {
  subject: $kodular.id,
  price: 1400,
};

-- COMMIT TRANSACTION;