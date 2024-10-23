OPTION IMPORT;

DEFINE TABLE role SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD name ON TABLE role TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD created ON role TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD permissions ON role TYPE set<string>;


DEFINE TABLE user SCHEMAFULL CHANGEFEED 2w;

DEFINE FIELD name ON TABLE user TYPE string ASSERT string::len($value) <= 48;
DEFINE FIELD email ON TABLE user TYPE string ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE user TYPE string;
DEFINE FIELD created ON user TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD role ON user TYPE record<role>;
DEFINE FIELD session_key ON user TYPE string DEFAULT rand::string(32);

DEFINE INDEX email_unique ON user FIELDS email UNIQUE;