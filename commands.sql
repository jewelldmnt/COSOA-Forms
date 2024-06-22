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
VALUES("gdsc-2024", "google developer student club", "univ wide", "univ wider", "cult", "mama mo");

INSERT INTO officers(org_id, program, role, acad_yr, f_name, m_name, l_name, pronoun, year_sec, birth, age, student_num, phone_num, webmail, email, fb_link) 
VALUES("gdsc-2024", "college of tae", "pres", "2021-2022", "mt", "nade", "tol", "he-him", "3-4", "02-01-2003", "19", "2021-19532-MN-0", "092445242", "xxx@iskolarngbayan.edu.ph", "mdf02010@gmail.com", "https://www.facebook.com");

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


