from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
from io import StringIO
import sqlite3

app = Flask(__name__)

# GLOBAL DEFAULT VARIABLES
org_id = None

gpoa_info = [['', '', '', '', '', '']]

wav_info = {'cnso':'','coj':'','scoj':'','ntso':'','cnsoa':''}

officer_info = {
    'president': {
        'program': '', 
        'EO': '', 
        'AY': '', 
        'FN': '', 
        'MD': '', 
        'LN': '', 
        'pronouns': '', 
        'YS': '', 
        'DOB': '', 
        'age': '',
        'SN': '',
        'PN': '',
        'webmail': '',
        'email': '',
        'FB': ''
    }
}

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/sign")
def sign():
    return render_template('signinup.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/waiver", methods=['POST','GET'])
def waiver():
    return render_template('wav.html', wav_info=wav_info)

@app.route("/gpoa", methods=['POST','GET'])
def gpoa():
    print_officer_info(officer_info)
    global gpoa_info
    return render_template('gpoa.html', org_info=gpoa_info)

@app.route("/officers", methods=['POST','GET'])
def officers():
    return render_template('officers.html')

# TODO: add a route storing the data of officers and going from officers.html to gpoa.html (parang ung "store_wav_data")
@app.route("/store_officers_data", methods=['POST'])
def store_officers_data():
    global officer_info

    # Get the JSON data from the request
    data = request.get_json()

    # Extract the officers data
    officers = data.get('officers', [])

    # Iterate over each officer and update the officer_info dictionary
    for officer in officers:
        elected_office = officer.get('elected_office', '').lower()
        
        if elected_office not in officer_info:
            officer_info[elected_office] = {}

        officer_info[elected_office] = {
            'program': officer.get('program', ''),
            'EO': officer.get('elected_office', ''),
            'AY': officer.get('academic_year', ''),
            'FN': officer.get('first_name', ''),
            'MD': officer.get('middle_name', ''),
            'LN': officer.get('last_name', ''),
            'pronouns': officer.get('pronouns', ''),
            'YS': officer.get('year_section', ''),
            'DOB': officer.get('date_of_birth', ''),
            'age': officer.get('age', ''),
            'SN': officer.get('student_number', ''),
            'PN': officer.get('phone_number', ''),
            'webmail': officer.get('pup_webmail', ''),
            'email': officer.get('active_email', ''),
            'FB': officer.get('facebook_link', '')
        }

    return redirect('/gpoa')

# Function to print the dictionary of dictionaries
def print_officer_info(officer_info):
    for office, info in officer_info.items():
        print(f"Office: {office}")
        for key, value in info.items():
            print(f"  {key}: {value}")
            
@app.route("/store_wav_data", methods=['POST'])
def store_wav_data():
    global wav_info
    global org_id

    # Store information and create unique organization id
    wav_info = request.get_json()
    words = wav_info['cnso'].split()
    first_letters = [word[:2] for word in words]
    org_id = '2024_' + ''.join(first_letters)
    return redirect('/officers')

@app.route("/submit", methods=['POST'])
def submit():
    try:
        # Retrieve JSON data from request
        global gpoa_info, wav_info, officer_info
        gpoa_info = request.json.get('data')

        # Create connections and cursor
        conn = sqlite3.connect("data.db")
        cur = conn.cursor()

        # sql queries for each database
        query_wav = "INSERT INTO wav(org_id,org_name,juris,sub_juris,type,adviser) VALUES ('{}',:cnso,:coj,:scoj,:ntso,:cnsoa)".format(org_id)

        query_officers = """INSERT INTO officers(org_id,program,role,acad_yr,f_name,m_name,l_name,pronoun,year_sec,birth,age,student_num,phone_num,webmail,email,fb_link) 
        VALUES ('{}',:program,:EO,:AY,:FN,:MD,:LN,:pronouns,:YS,:DOB,:age,:SN,:PN,:webmail,:email,:FB)""".format(org_id)

        query_gpoa = "INSERT INTO gpoa(org_id,month,activity,objectives,organizer,proposed_budget,fund_src) VALUES ('{}',?,?,?,?,?,?)".format(org_id)

        officer_info = [
            {
                'program': 'College of Arts and Letters | CAL',
                'EO': 'President',
                'AY': '2324',
                'FN': 'ASDF',
                'MD': 'ASDF',
                'LN': 'Tolentino',
                'pronouns': 'he/him',
                'YS': '3-4',
                'DOB': '2024-06-07',
                'age': '18',
                'SN': '2021-1052-MN-0',
                'PN': '09000000000',
                'webmail': 'shs@pup.edu.ph',
                'email': 'shs@pup.edu.ph',
                'FB': 'https://www.facebook.com/Miguel3Tolentino'
            },
            {
                'program': 'College of Arts and Letters | CAL',
                'EO': 'vice pres',
                'AY': '2324',
                'FN': 'ASDF',
                'MD': 'ASDF',
                'LN': 'Tolentino',
                'pronouns': 'he/him',
                'YS': '3-4',
                'DOB': '2024-06-07',
                'age': '18',
                'SN': '2021-1052-MN-0',
                'PN': '09000000000',
                'webmail': 'shs@pup.edu.ph',
                'email': 'shs@pup.edu.ph',
                'FB': 'https://www.facebook.com/Miguel3Tolentino'
            },
            {
                'program': 'College of Arts and Letters | CAL',
                'EO': 'secretary',
                'AY': '2324',
                'FN': 'ASDF',
                'MD': 'ASDF',
                'LN': 'Tolentino',
                'pronouns': 'he/him',
                'YS': '3-4',
                'DOB': '2024-06-07',
                'age': '18',
                'SN': '2021-1052-MN-0',
                'PN': '09000000000',
                'webmail': 'shs@pup.edu.ph',
                'email': 'shs@pup.edu.ph',
                'FB': 'https://www.facebook.com/Miguel3Tolentino'
            }
        ]

        # Insert data to database
        cur.execute(query_wav, wav_info)
        cur.executemany(query_officers, officer_info)
        cur.executemany(query_gpoa, gpoa_info)

        # Commit and close connections and cursor
        conn.commit()
        cur.close()
        conn.close()
        print('succesfully integrated data')

        # Redirect to another page after processing
        return jsonify({'message': 'Data received and processed successfully'})
    except Exception as e:
        cur.close()
        conn.close()
        print(e)
        return jsonify({'error': 'Something went wrong with the server'})

@app.route("/validate_csv", methods=['POST'])
def validate_csv():
    if 'csv-file' not in request.files:
        return 'No file part', 400
    file = request.files['csv-file']
    if file.filename == '':
        return 'No selected file', 400
    if file and file.filename.endswith('.csv'):
        try:
            org_information = [['','','','','','']]
            # Read the CSV file using pandas
            df = pd.read_csv(StringIO(file.read().decode('utf-8')))

            # Define the expected column format
            expected_columns = {
                0: 'month',
                1: 'activity',
                2: 'objectives',
                3: 'organizer',
                4: 'proposed budget',
                5: 'source of funds'
            }

            # Get actual columns and their positions
            actual_columns = {index: column.lower() for index, column in enumerate(df.columns)}
            
            # Check if the actual columns match the expected format
            for position, name in expected_columns.items():
                if actual_columns.get(position) != name:
                    return f'Column {position} should be "{name}", but got "{actual_columns.get(position)}"\n Expected format is MONTH, ACTIVITY, OBJECTIVES, ORGANIZER, PROPOSED BUDGET, SOURCE OF FUNDS', 400

            # If no error, render same template with list of organization data      
            org_information = []
            for index, row in df.iterrows():
                org_information.append([row['month'],row['activity'],row['objectives'],row['organizer'],row['proposed budget'],row['source of funds']])
            return render_template("gpoa.html", org_info=org_information)
        except Exception as e:
            return 'Error processing file. Column length must be 6 (MONTH, ACTIVITY, OBJECTIVES, ORGANIZER, PROPOSED BUDGET, SOURCE OF FUNDS)', 500
    else:
        return 'Invalid file type', 400 

if __name__ == '__main__':
    app.run(debug=True)