--commands
-- TABLE OF ORG SIGN IN AND UP CREDENTIALS
PRAGMA foreign_keys = ON;

CREATE TABLE wav(
    org_id TEXT NOT NULL,
	org_name TEXT NOT NULL,
  	juris TEXT NOT NULL,
  	sub_juris TEXT NOT NULL,
    type TEXT NOT NULL,
    adviser TEXT NOT NULL,
    PRIMARY KEY(org_id)
);

CREATE TABLE officers(
    org_id TEXT NOT NULL,
    program TEXT NOT NULL,
    role TEXT NOT NULL,
    acad_yr TEXT NOT NULL,
    f_name TEXT NOT NULL,
    m_name TEXT,
    l_name TEXT NOT NULL, 
    pronoun TEXT NOT NULL,
    year_sec TEXT NOT NULL,
    birth TEXT NOT NULL,
    age TEXT NOT NULL,
    student_num TEXT NOT NULL,
    phone_num TEXT NOT NULL,
    webmail TEXT NOT NULL,
    email TEXT NOT NULL,
    fb_link TEXT NOT NULL,
    FOREIGN KEY (org_id) REFERENCES org_creds(org_id)
);

CREATE TABLE gpoa(
    org_id TEXT NOT NULL,
    month VARCHAR(64) NOT NULL,
    activity TEXT NOT NULL,
    objectives TEXT NOT NULL,
    organizer TEXT NOT NULL,
    proposed_budget TEXT NOT NULL,
    fund_src TEXT NOT NULL,
    FOREIGN KEY (org_id) REFERENCES org_creds(org_id)
);

--inserting values
INSERT INTO wav(org_id,org_name,juris,sub_juris,type,adviser) 
VALUES("gdsc-2024", "google developer student club", "", "asdfawefasdfwe");

INSERT INTO gpoa(org_id, month, activity, objectives,organizer,proposed_budget,fund_src) 
VALUES("gdsc-2024", "november", "pintura ng red", "magpaint ng red", "mama mo red", "888888", "papa mo red");

--table checking
SELECT * FROM gpoa;
SELECT * FROM officers;
SELECT * FROM wav;

--delete all data
DELETE FROM officers;
DELETE FROM gpoa;
DELETE FROM wav;


