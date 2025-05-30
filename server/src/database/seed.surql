-- BEGIN TRANSACTION;

$defadmin = CREATE ONLY employee:defadmin CONTENT {
  name: "Default Administrator",
  email: "admin@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator"]
};

$deftchr = CREATE ONLY employee:deftchr CONTENT {
  name: "Default Teacher",
  email: "teacher@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

$invite1 = CREATE ONLY invite:1234 CONTENT {
  author: $defadmin.id,
  roles: ["teacher", "administrator"],
};

$ivett = CREATE ONLY employee:ivettvirag CONTENT {
  name: "Ivett Virág",
  email: "ivett@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator"]
};

$vrolandd = CREATE ONLY employee:vrolandd CONTENT {
  name: "V Rolandd",
  email: "vrolandd@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["administrator", "teacher"]
};

$kex = CREATE ONLY employee:kovacstamas CONTENT {
  name: "Kovács Tamás",
  email: "ugyesz@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

$varma = CREATE ONLY employee:varadimarcell CONTENT {
  name: "Váradi Marcell",
  email: "varma@example.com", 
  password: crypto::argon2::generate("1234"),
  roles: ["teacher"]
};

$scratch = CREATE ONLY subject:scratch CONTENT {
  name: "Scratch kezdő",
  description: "Legózás után első lépés a programozás felé"
};

$kodular = CREATE ONLY subject:kodular CONTENT {
  name: "Kodular",
  description: "Scratch-nél nehezebb, telefonos alkalmazás fejlesztés"
};

$appinventor = CREATE ONLY subject:appinventor CONTENT {
  name: "App Inventor",
  description: "Telefonos alkalmazás fejlesztés, javasolt a Scratch után"
};

$lego1 = CREATE ONLY subject:legowedo CONTENT {
  name: "Lego WeDo 1.0",
  description: "Belépő szintű kurzus, legozás 3-4. évfolyamnak"
};

$fohadiszallas = CREATE ONLY location:fohadiszallas CONTENT {
  name: "Főhadiszállás",
  address: "6000 Kecskemét, Batthyány utca 11.",
  contact_email: "admin@example.com",
  contact_phone: "+36301111111"
};

$ezi = CREATE ONLY location:kodaly CONTENT {
  name: "Kodály Zoltán Ének-Zenei Általános Iskola",
  address: "6000 Kecskemét, Dózsa György út 22.",
  contact_email: "valaki@kodaly-iskola.hu",
  contact_phone: "0676508821"
};

$arany = CREATE ONLY location:arany CONTENT {
  name: "Arany János Általános Iskola",
  address: "6000 Kecskemét, Lukányi János utca 10.",
  contact_email: "valaki@keszeiskola.hu",
  contact_phone: "0676478549"
};

$dok2 = CREATE ONLY group:dok2 CONTENT {
  name: "DOK Szombat 10:00",
  location: $fohadiszallas.id,
  teachers: [$deftchr.id, $kex.id],
};

$dok2ora0 = CREATE ONLY lesson:dok2ora0 CONTENT {
  group: $dok2.id,
  start: time::now() - 1w + 1d,
  end:  time::now() - 1w + 1h + 1d,
};

RELATE [$deftchr, $kex]->worked_at->$dok2ora0 CONTENT {
  start: $dok2ora0.start,
  end:   $dok2ora0.end,
};

$dok2ora1 = CREATE ONLY lesson:dok2ora1 CONTENT {
  group: $dok2.id,
  start: time::now() + 1d,
  end:  time::now() + 1h + 1d,
};

$dok2ora2 = CREATE ONLY lesson:dok2ora2 CONTENT {
  group: $dok2.id,
  start: time::now() + 1w + 1d,
  end:  time::now() + 1w + 1h + 1d,
};

$dok2ora3 = CREATE ONLY lesson:dok2ora3 CONTENT {
  group: $dok2.id,
  start: time::now() + 2w + 1d,
  end:  time::now() + 2w + 1h + 1d,
};

$dok1 = CREATE ONLY group:dok1 CONTENT {
  name: "DOK Hétfő 15:00",
  location: $fohadiszallas.id,
  teachers: [$vrolandd.id],
};

$cs1ora0 = CREATE ONLY lesson:dok1ora0 CONTENT {
  group: $dok1.id,
  start: time::now() - 1w,
  end:  time::now() - 1w + 1h,
};

RELATE $vrolandd->worked_at->$cs1ora0 CONTENT {
  start: $cs1ora0.start,
  end:   $cs1ora0.end,
};

$cs1ora1 = CREATE ONLY lesson:dok1ora1 CONTENT {
  group: $dok1.id,
  start: time::now(),
  end:  time::now() + 1h,
};

$cs1ora2 = CREATE ONLY lesson:dok1ora2 CONTENT {
  group: $dok1.id,
  start: time::now() + 1w,
  end:  time::now() + 1w + 1h,
};

$cs1ora3 = CREATE ONLY lesson:dok1ora3 CONTENT {
  group: $dok1.id,
  start: time::now() + 2w,
  end:  time::now() + 2w + 1h,
};

$kodaly1 = CREATE ONLY group:kodaly1 CONTENT {
  name: "Kodály Kedd 16:00",
  location: $ezi.id,
  teachers: [$varma.id],
};

$cs2ora1 = CREATE ONLY lesson:kodaly1ora1 CONTENT {
  group: $kodaly1.id,
  start: time::now() + 1d + 2h,
  end:  time::now() + 1d + 2h + 1h,
};

$cs2ora2 = CREATE ONLY lesson:kodaly1ora2 CONTENT {
  group: $kodaly1.id,
  start: time::now() + 1d + 1w + 2h,
  end:  time::now() + 1d + 1w + 2h + 1h,
};

$cs2ora3 = CREATE ONLY lesson:kodaly1ora3 CONTENT {
  group: $kodaly1.id,
  start: time::now() + 1d + 2w + 2h,
  end:  time::now() + 1d + 2w + 2h + 1h,
};

$arany1 = CREATE ONLY group:arany1 CONTENT {
  name: "Arany Szerda 15:00",
  location: $arany.id,
  teachers: [$kex.id],
};

$cs3ora1 = CREATE ONLY lesson:arany1ora1 CONTENT {
  group: $arany1.id,
  start: time::now() + 2d - 1h,
  end:  time::now() + 2d - 1h + 1h,
};

$cs3ora2 = CREATE ONLY lesson:arany1ora2 CONTENT {
  group: $arany1.id,
  start: time::now() + 2d + 1w - 1h,
  end:  time::now() + 2d + 1w - 1h + 1h,
};

$cs3ora3 = CREATE ONLY lesson:arany1ora3 CONTENT {
  group: $arany1.id,
  start: time::now() + 2d + 2w - 1h,
  end:  time::now() + 2d + 2w - 1h + 1h,
};

$elek = CREATE ONLY student:ebedelek CONTENT {
  name: "Ebéd Elek",
  grade: 5,
  parent: {
    name: "Ebéd Bakos",
    email: "support@bakos.hu",
    phone: "+36204171404"
  },
};

$joska = CREATE ONLY student:fozojozsi CONTENT {
  name: "Főznünk Kell Józsi",
  grade: 4,
  parent: {
    name: "Mr Fehér",
    email: "walter@citromail.hu",
    phone: "+36 72 696 969"
  },
};

$pisti = CREATE ONLY student:erospista CONTENT {
  name: "Erős Pista",
  grade: 5,
  parent: {
    name: "Univer-Product Zrt.",
    email: "informacio@univer.hu",
    phone: "+36 76 518 100"
  },
};

$peti = CREATE ONLY student:molnarpeter CONTENT {
  name: "Molnár Péter",
  grade: 3,
  parent: {
    name: "Molnár Katalin",
    email: "kati5337@example.com",
    phone: "+36301111111"
  },
};

$ferko = CREATE ONLY student:ferencjozsef CONTENT {
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

RELATE $pisti->enroled->$dok1 CONTENT {
  subject: $scratch.id,
  price: 990,
};

RELATE $joska->enroled->$kodaly1 CONTENT {
  subject: $lego1.id,
  price: 1500,
};

RELATE $ferko->enroled->$kodaly1 CONTENT {
  subject: $lego1.id,
  price: 1250,
};

RELATE $peti->enroled->$arany1 CONTENT {
  subject: $kodular.id,
  price: 1230,
};

RELATE $pisti->enroled->$arany1 CONTENT {
  subject: $kodular.id,
  price: 1400,
};

RELATE $pisti->enroled->$dok2 CONTENT {
  subject: $scratch.id,
  price: 1400,
};
RELATE $joska->enroled->$dok2 CONTENT {
  subject: $scratch.id,
  price: 1400,
};
RELATE $elek->enroled->$dok2 CONTENT {
  subject: $scratch.id,
  price: 1400,
};
RELATE $ferko->enroled->$dok2 CONTENT {
  subject: $kodular.id,
  price: 1400,
};

RELATE [$elek, $joska]->attended->$cs1ora0;

RELATE $pisti->replaced->$dok2ora0 CONTENT {
  original: $cs1ora0.id,
  extension: 30m,
};

RELATE [$pisti, $ferko, $joska, $elek]->attended->$dok2ora0;

-- COMMIT TRANSACTION;