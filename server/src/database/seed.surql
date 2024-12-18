BEGIN TRANSACTION;

CREATE employee SET 
  name = "Default Administrator",
  email = "admin@example.com", 
  password = crypto::argon2::generate("1234"),
  roles = ["administrator"];

CREATE employee SET 
  name = "Ivett Virág",
  email = "ivett@example.com", 
  password = crypto::argon2::generate("1234"),
  roles = ["administrator"];

CREATE employee SET 
  name = "V Rolandd",
  email = "vrolandd@example.com", 
  password = crypto::argon2::generate("1234"),
  roles = ["administrator", "teacher"];

CREATE employee SET 
  name = "Kovács Tamás",
  email = "lgfbugyesz@example.com", 
  password = crypto::argon2::generate("1234"),
  roles = ["teacher"];

CREATE employee SET 
  name = "Máté Manó Bárdos",
  email = "mano@example.com", 
  password = crypto::argon2::generate("1234"),
  roles = ["teacher"];

COMMIT TRANSACTION;