from flask import Flask, send_from_directory
from markupsafe import escape
from MainApp import MainApp
from threading import Thread
import pathlib
import os
import re
import mimetypes
import time

def numeric_order(name):
    result = re.findall(r'\d+', name)
    return name if len(result) == 0 else result[0]

def load_images(path):
    for file in os.listdir(path):
        print(file, mimetypes.guess_type(file))
    files = [file for file in os.listdir(path) if mimetypes.guess_type(file)[0] is not None and ('image' in mimetypes.guess_type(file)[0] or 'video' in mimetypes.guess_type(file)[0])]
    files = sorted(files, key=numeric_order)
    skipped = {}

    return files, skipped

app = Flask(__name__)

with app.app_context():
    preview = MainApp()
    create_window = Thread(target=preview.createApp)
    create_window.daemon = True
    create_window.start()
    time.sleep(0.1)
    preview.set_label('Waiting for connection...')

    path = preview.get_path()
    files, skipped = load_images(path)

@app.route('/')
def main():
    global path, files, skipped
    files, skipped = load_images(path)

    return open('page.html').read()

@app.route('/script')
def get_script():
    return open('page.js').read()

@app.route('/image/<int:index>')
def get_image(index):
    global preview, files
    if index < 0:
        index = 0
    elif index >= len(files):
        index = len(files) - 1
    preview.set_image(path / pathlib.Path(files[min(index + 1, len(files) - 1)]))
    return send_from_directory(path, files[index])

@app.route('/skip/<int:index>')
def skip_image(index):
    global preview, files, skipped
    if index >= 0 and index < len(files):
        skipped[index] = files[index]
        files.remove(files[index])
        preview.set_image(path / pathlib.Path(files[index]))
    return ''
