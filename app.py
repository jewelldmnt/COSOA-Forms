from flask import Flask, render_template, request, redirect, url_for, jsonify
import pandas as pd
from io import StringIO
import sqlite3

app = Flask(__name__)

# GLOBAL DEFAULT VARIABLES
org_id = None

gpoa_info = [['', '', '', '', '', '']]

wav_info = {'cnso':'','coj':'','scoj':'','ntso':'','cnsoa':''}
officer_info = None #TODO: add a list that contains the officer_info

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/sign")
def sign():
    return render_template('signinup.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/waiver")
def waiver():
    return render_template('wav.html', wav_info=wav_info)

@app.route("/gpoa")
def gpoa():
    global gpoa_info
    return render_template('gpoa.html', org_info=gpoa_info)

@app.route("/home")
def home():
    return render_template('index.html')

@app.route("/officers")
def officers():
    print(wav_info)
    return render_template('officers.html')

# TODO: add a route storing the data of officers and going from officers.html to gpoa.html (parang ung "store_wav_data")

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
    global gpoa_info
    
    # Retrieve JSON data from request
    gpoa_info = request.json.get('data')
    print(gpoa_info)

    # Example: process or store data as needed
    # e.g., insert into database
    # conn = sqlite3.connect("data.db")
    # cur = conn.cursor()
    # cur.execute("INSERT INTO gpoa (column1, column2, ...) VALUES (?, ?, ...)", gpoa_info['data'])
    # conn.commit()
    # cur.close()
    # conn.close()

    # Redirect to another page after processing
    return jsonify({'message': 'Data received and processed successfully'})

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