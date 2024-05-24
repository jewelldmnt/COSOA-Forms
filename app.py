from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('gpoa.html')

@app.route("/sign")
def sign():
    return render_template('signinup.html')

@app.route("/validate_csv", methods=['POST'])
def validate_csv():
    if 'csvfile' not in request.files:
        return 'No file part', 400
    file = request.files['csvfile']
    if file.filename == '':
        return 'No selected file', 400
    if file and file.filename.endswith('.csv'):
        # Process the CSV file here
        content = file.read().decode('utf-8')
        print(content)  # Print the CSV content to the console or process it as needed
        return 'File successfully uploaded and processed', 200
    else:
        return 'Invalid file type', 400 

@app.route("/submit", methods=['POST'])
def submit():
    return "submitted"

if __name__ == '__main__':
    app.run(debug=True)