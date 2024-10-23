OPTION IMPORT;

DEFINE TABLE role SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD name ON TABLE role TYPE string;
DEFINE FIELD created ON role TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD teacher ON role TYPE bool;
DEFINE FIELD view_knowledge ON role TYPE bool;
DEFINE FIELD view_timetable ON role TYPE bool;
DEFINE FIELD manage_knowledge ON role TYPE bool;
DEFINE FIELD manage_roles ON role TYPE bool;
DEFINE FIELD manage_timetable ON role TYPE bool;
DEFINE FIELD manage_users ON role TYPE bool;


DEFINE TABLE user SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD name ON TABLE user TYPE string;
DEFINE FIELD email ON TABLE user TYPE string;
DEFINE FIELD password ON TABLE user TYPE string;
DEFINE FIELD created ON user TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD role ON user TYPE record<role>;
DEFINE FIELD session_key ON user TYPE string DEFAULT rand::string(32);

DEFINE INDEX email_unique ON user FIELDS email UNIQUE;