DEFINE TABLE role SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE role TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE role TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD permissions ON TABLE role TYPE set<
  "teacher" |
	"view_knowledge" |
	"view_timetable" |
	"manage_knowledge" |
	"manage_roles" |
	"manage_timetable" |
	"manage_users"
> DEFAULT [];


DEFINE TABLE user SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE user TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE user TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD email ON TABLE user TYPE string ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE user TYPE string;
DEFINE FIELD role ON TABLE user TYPE record<role>;
DEFINE FIELD session_key ON TABLE user TYPE string DEFAULT rand::string(32);

DEFINE INDEX email_unique ON user FIELDS email UNIQUE;


DEFINE TABLE message SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE message TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD subject ON TABLE message TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD content ON TABLE message TYPE string ASSERT string::len($value) <= 2048;
DEFINE FIELD author ON TABLE message TYPE record<user> READONLY;
DEFINE FIELD recipients ON TABLE message TYPE set<record<user>> DEFAULT [] READONLY;


DEFINE TABLE subject SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE subject TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE subject TYPE string ASSERT string::len($value) <= 48;


DEFINE TABLE student SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE student TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD name ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent_name ON TABLE student TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD parent_email ON TABLE student TYPE string ASSERT string::is::email($value);
DEFINE FIELD telephone ON TABLE student TYPE string ASSERT string::len($value) <= 20;
DEFINE FIELD comment ON TABLE student TYPE string ASSERT string::len($value) <= 2048;


DEFINE TABLE class SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE class TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD subjects ON TABLE class TYPE set<record<subject>> ASSERT array::len($value) > 0;
DEFINE FIELD teachers ON TABLE class TYPE set<record<user>> ASSERT array::len($value) > 0;
DEFINE FIELD students ON TABLE class TYPE set<record<student>> ASSERT array::len($value) > 0;
DEFINE FIELD schedule ON TABLE class TYPE datetime;


DEFINE TABLE event SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD created ON TABLE event TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD type ON TABLE event TYPE 
  "substitution" |
  "recruitment" |
  "misc"
READONLY;
DEFINE FIELD text ON TABLE event TYPE string ASSERT string::len($value) <= 2048;
DEFINE FIELD signups ON TABLE event TYPE set<record<user>> DEFAULT [];
DEFINE FIELD signup_limit ON TABLE event TYPE int;
DEFINE FIELD start ON TABLE event TYPE datetime;
DEFINE FIELD end ON TABLE event TYPE datetime;
DEFINE FIELD class ON TABLE event TYPE option<record<class>>;