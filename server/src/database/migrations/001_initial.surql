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
DEFINE FIELD author ON TABLE invite TYPE record<employee> READONLY;
DEFINE FIELD roles ON TABLE invite TYPE set<"teacher" | "administrator"> READONLY;


DEFINE TABLE event SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE event TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD author ON TABLE event TYPE record<employee> READONLY;
DEFINE FIELD name ON TABLE event TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD notes ON TABLE event TYPE string ASSERT string::len($value) <= 2048 DEFAULT "";
DEFINE FIELD signups ON TABLE event TYPE set<record<employee>> DEFAULT [] ASSERT array::len($value) <= signup_limit;
DEFINE FIELD signup_limit ON TABLE event TYPE int DEFAULT 0;
DEFINE FIELD start ON TABLE event TYPE datetime;
DEFINE FIELD end ON TABLE event TYPE datetime;


DEFINE TABLE subject SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE subject TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE subject TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD description ON TABLE subject TYPE option<string> ASSERT string::len($value) <= 2048;
DEFINE FIELD suggested_lesson_count ON TABLE subject TYPE int;


DEFINE TABLE student SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE student TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent ON TABLE student TYPE option<object>;
DEFINE FIELD parent.name ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent.email ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent.phone ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD email ON TABLE student TYPE option<string> ASSERT string::is::email($value);
DEFINE FIELD phone ON TABLE student TYPE option<string> ASSERT string::len($value) <= 48;
DEFINE FIELD extra_fields ON TABLE student FLEXIBLE TYPE option<object>;
DEFINE FIELD notes ON TABLE student TYPE string ASSERT string::len($value) <= 2048 DEFAULT "";


DEFINE TABLE class SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE class TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD location ON TABLE class TYPE object;
DEFINE FIELD location.name ON TABLE class TYPE string ASSERT string::len($value) <= 256;
DEFINE FIELD location.address ON TABLE class TYPE string ASSERT string::len($value) <= 256;
DEFINE FIELD location.contact_email ON TABLE class TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD location.contact_phone ON TABLE class TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD notes ON TABLE class TYPE string ASSERT string::len($value) <= 2048 DEFAULT "";
DEFINE FIELD teachers ON TABLE class TYPE set<record<employee>>;
DEFINE FIELD archived ON TABLE class TYPE bool DEFAULT false;


DEFINE TABLE enroled SCHEMAFULL TYPE RELATION IN student OUT class CHANGEFEED 4w;

DEFINE FIELD created ON TABLE enroled TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD subject ON TABLE enroled TYPE record<subject>;
DEFINE FIELD price ON TABLE enroled TYPE int;
DEFINE FIELD notes ON TABLE enroled TYPE string ASSERT string::len($value) <= 2048 DEFAULT "";


DEFINE TABLE lesson SCHEMAFULL CHANGEFEED 4w;

DEFINE FIELD created ON TABLE lesson TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD classes ON TABLE lesson TYPE set<record<class>>;
DEFINE FIELD notes ON TABLE lesson TYPE string ASSERT string::len($value) <= 2048 DEFAULT "";
DEFINE FIELD teachers ON TABLE lesson TYPE option<set<record<employee>>>;
DEFINE FIELD start ON TABLE lesson TYPE datetime;
DEFINE FIELD end ON TABLE lesson TYPE datetime;


DEFINE TABLE attended SCHEMAFULL TYPE RELATION IN student OUT lesson CHANGEFEED 4w;
DEFINE FIELD created ON TABLE attended TYPE datetime DEFAULT time::now() READONLY;


DEFINE TABLE worked_at SCHEMAFULL TYPE RELATION IN employee OUT lesson | event CHANGEFEED 4w;
DEFINE FIELD created ON TABLE worked_at TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD paid ON TABLE worked_at TYPE bool DEFAULT false;
DEFINE FIELD notes ON TABLE worked_at TYPE string DEFAULT "";


-- DEFINE TABLE announcement SCHEMAFULL CHANGEFEED 4w;

-- DEFINE FIELD created ON TABLE announcement TYPE datetime DEFAULT time::now() READONLY;
-- DEFINE FIELD subject ON TABLE announcement TYPE string ASSERT string::len($value) <= 48;
-- DEFINE FIELD content ON TABLE announcement TYPE string ASSERT string::len($value) <= 4096;
-- DEFINE FIELD author ON TABLE announcement TYPE record<employee> READONLY;
-- DEFINE FIELD recipients ON TABLE announcement TYPE set<record<employee>> DEFAULT [] READONLY;
-- DEFINE FIELD attachents ON TABLE announcement TYPE set<record<event | knowledge | file>> DEFAULT [];


-- COMMIT TRANSACTION;