-- REQUIRES RESET

-- BEGIN TRANSACTION;
DEFINE PARAM OVERWRITE $db_version VALUE 1;


DEFINE TABLE employee SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE employee TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE employee TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD email ON TABLE employee TYPE string ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE employee TYPE string;
DEFINE FIELD roles ON TABLE employee TYPE set<"teacher" | "administrator">;
DEFINE FIELD session_key ON TABLE employee TYPE string DEFAULT rand::string(32);

DEFINE INDEX email_unique ON employee FIELDS email UNIQUE;


DEFINE TABLE invite SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE invite TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD author ON TABLE invite TYPE record<employee> READONLY ASSERT $value.exists();
DEFINE FIELD roles ON TABLE invite TYPE set<"teacher" | "administrator"> READONLY;


DEFINE TABLE file SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE file TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD author ON TABLE file TYPE record<employee> READONLY ASSERT $value.exists();
DEFINE FIELD name ON TABLE file TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD mime_type ON TABLE file TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD path ON TABLE file TYPE string ASSERT string::len($value) <= 256 DEFAULT string::join("/", author, id, name);
DEFINE FIELD shared_with ON TABLE file TYPE set<record<employee>> DEFAULT [] ASSERT array::all($value, |$v| $v.exists());
DEFINE FIELD size ON TABLE file TYPE int;

DEFINE INDEX path_unique ON file FIELDS path UNIQUE;


DEFINE TABLE subject SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE subject TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE subject TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD description ON TABLE subject TYPE string ASSERT string::len($value) <= 2048 DEFAULT "";


DEFINE TABLE student SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE student TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD grade ON TABLE student TYPE option<int>;
DEFINE FIELD parent ON TABLE student TYPE option<object>;
DEFINE FIELD parent.name ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent.email ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent.phone ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD email ON TABLE student TYPE option<string> ASSERT string::is::email($value);
DEFINE FIELD phone ON TABLE student TYPE option<string> ASSERT string::len($value) <= 48;


DEFINE TABLE location SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE location TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE location TYPE string ASSERT string::len($value) <= 256;
DEFINE FIELD address ON TABLE location TYPE string ASSERT string::len($value) <= 256;
DEFINE FIELD contact_email ON TABLE location TYPE string ASSERT string::is::email($value);
DEFINE FIELD contact_phone ON TABLE location TYPE string ASSERT string::len($value) <= 48;


DEFINE TABLE group SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE group TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE group TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD location ON TABLE group TYPE record<location> ASSERT $value.exists();
DEFINE FIELD teachers ON TABLE group TYPE set<record<employee>> ASSERT array::all($value, |$v| $v.exists());
DEFINE FIELD archived ON TABLE group TYPE bool DEFAULT false;


DEFINE TABLE enroled SCHEMAFULL TYPE RELATION IN student OUT group CHANGEFEED 4w;

DEFINE FIELD created ON TABLE enroled TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD subject ON TABLE enroled TYPE record<subject> ASSERT $value.exists();
DEFINE FIELD price ON TABLE enroled TYPE int;

DEFINE INDEX enroled_unique ON enroled FIELDS in, out UNIQUE;


DEFINE TABLE lesson SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE lesson TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD group ON TABLE lesson TYPE option<record<group>> ASSERT $value.exists();
DEFINE FIELD name ON TABLE lesson TYPE option<string> ASSERT string::len($value) <= 48;
DEFINE FIELD location ON TABLE lesson TYPE option<record<location>> ASSERT $value.exists();
DEFINE FIELD teachers ON TABLE lesson TYPE option<set<record<employee>>> ASSERT array::all($value, |$v| $v.exists());
DEFINE FIELD start ON TABLE lesson TYPE datetime;
DEFINE FIELD end ON TABLE lesson TYPE datetime;


DEFINE TABLE replaced SCHEMAFULL TYPE RELATION IN student OUT lesson CHANGEFEED 4w;

DEFINE FIELD created ON TABLE replaced TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD original ON TABLE replaced TYPE record<lesson> ASSERT $value.exists();


DEFINE TABLE attended SCHEMAFULL TYPE RELATION IN student OUT lesson CHANGEFEED 4w;

DEFINE FIELD created ON TABLE attended TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD paid ON TABLE attended TYPE bool DEFAULT false;

DEFINE INDEX attended_unique ON attended FIELDS in, out UNIQUE;


DEFINE TABLE worked_at SCHEMAFULL TYPE RELATION IN employee OUT lesson CHANGEFEED 4w;

DEFINE FIELD created ON TABLE worked_at TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD paid ON TABLE worked_at TYPE bool DEFAULT false;
DEFINE FIELD start ON TABLE worked_at TYPE datetime DEFAULT out.start;
DEFINE FIELD end ON TABLE worked_at TYPE datetime DEFAULT out.end;

DEFINE INDEX worked_at_unique ON worked_at FIELDS in, out UNIQUE;


-- COMMIT TRANSACTION;