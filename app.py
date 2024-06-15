from flask import Flask, render_template, request
import pandas as pd
from io import StringIO
import sqlite3

app = Flask(__name__)

org_information = [['','','','','','']]

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
    return render_template('wav.html')

@app.route("/gpoa")
def gpoa():
    return render_template('gpoa.html', org_info=org_information)

@app.route("/home")
def home():
    return render_template('index.html')

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

@app.route("/submit", methods=['POST'])
def submit():
    # ON DEVELOPMENT PA (FOR GPOA TESTING)
    conn = sqlite3.connect("data.db")
    cur = conn.cursor()

    # Check from which link it came from then add to which table the data belongs
    html_link = request.headers.get('link')
    if html_link == "gpoa":
        gpoa_data = request.json.get('data')

        cur.executemany("""
            INSERT INTO gpoa(org_id,month,activity,objectives,organizer,proposed_budget,fund_src) VALUES(?,?,?,?,?,?,?)
            """,gpoa_data)
    # Close connection and cursor
    cur.close()
    conn.close()

    # Return user to main page with alert message
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)