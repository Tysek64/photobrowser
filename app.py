from flask import Flask, send_from_directory
from markupsafe import escape
import pathlib
import os
import re
import mimetypes

def numeric_order(name):
    result = re.findall(r'\d+', name)
    return name if len(result) == 0 else result[0]

path = pathlib.Path('')
files = [file for file in os.listdir(path) if 'image' in mimetypes.guess_type(file)[0] or 'video' in mimetypes.guess_type(file)[0]]
files = sorted(files, key=numeric_order)

app = Flask(__name__)

@app.route('/')
def main():
    return open('page.html').read()

@app.route('/script')
def get_script():
    return open('page.js').read()

@app.route('/image/<int:index>')
def get_image(index):
    if index < 0:
        index = 0
    elif index >= len(files):
        index = len(files) - 1
    return send_from_directory(path, files[index])
