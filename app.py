from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('gpoa.html')

@app.route("/sign")
def sign():
    return render_template('gpoa.html')

if __name__ == '__main__':
    app.run(debug=True)