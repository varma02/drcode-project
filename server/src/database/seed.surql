BEGIN TRANSACTION;

CREATE employee SET 
  name = "Default Administrator",
  email = "admin@drcode.hu", 
  password = crypto::argon2::generate("1234"),
  roles = ["administrator"];

COMMIT TRANSACTION;