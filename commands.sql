--commands
-- TABLE OF ORG SIGN IN AND UP CREDENTIALS
PRAGMA foreign_keys = ON;

CREATE TABLE org_creds(
    org_id VARCHAR(255) NOT NULL,
	org_name VARCHAR(255) NOT NULL,
  	email VARCHAR(255) NOT NULL,
  	password VARCHAR(255),
    PRIMARY KEY(org_id)
);

CREATE TABLE gpoa(
    org_id VARCHAR(255) NOT NULL,
    month VARCHAR(64) NOT NULL,
    activity TEXT NOT NULL,
    objectives TEXT NOT NULL,
    organizer TEXT NOT NULL,
    proposed_budget TEXT NOT NULL,
    fund_src TEXT NOT NULL,
    FOREIGN KEY (org_id) REFERENCES org_creds(org_id)
);

--inserting values
INSERT INTO org_creds(org_id, org_name, email, password) 
VALUES("gdsc-2024", "google developer student club", "mdfl020103@gmail.com", "asdfawefasdfwe");

INSERT INTO gpoa(org_id, month, activity, objectives,organizer,proposed_budget,fund_src) 
VALUES("gdsc-2024", "november", "pintura ng red", "magpaint ng red", "mama mo red", "888888", "papa mo red");

--table checking
SELECT * FROM gpoa JOIN org_creds
WHERE gpoa.org_id == org_creds.org_id;

--delete all data
DELETE FROM org_creds;
DELETE FROM gpoa;


