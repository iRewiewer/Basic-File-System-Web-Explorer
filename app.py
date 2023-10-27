from flask import Flask, request, render_template, send_from_directory
import os
import json
from datetime import datetime

app = Flask(__name__)
app.static_folder = 'static'

# Define the root directory where the files are located
ROOT_DIR = "../ROMs"

@app.route('/get_files')
def get_files():
    path = request.args.get('path', '/')
    abs_path = os.path.join(ROOT_DIR, path)

    if not os.path.exists(abs_path) or not os.path.isdir(abs_path):
        return json.dumps([])

    # Populate table with all files and folders in current folder
    files = []
    for item in os.listdir(abs_path):
        item_path = os.path.join(abs_path, item)
        size = os.path.getsize(item_path)

        # Format file size
        size_str = f"{size:.2f} B"
        if size > 1024:
            size_str = f"{size / 1024:.2f} KB"
        if size > 1024 * 1024:
            size_str = f"{size / (1024 * 1024):.2f} MB"
        if size > 1024 * 1024 * 1024:
            size_str = f"{size / (1024 * 1024 * 1024):.2f} GB"
        if size > 1024 * 1024 * 1024 * 1024:
            size_str = f"{size / (1024 * 1024 * 1024 * 1024):.2f} TB"

        if os.path.isfile(item_path):
            itemType = "File"
        else:
            itemType = "Folder"
            size_str = ""

        # Date modified
        unix_timestamp = os.path.getctime(item_path)
        date_modified = datetime.utcfromtimestamp(unix_timestamp)
        date_modified_str = date_modified.strftime('%B %d, %Y %H:%M:%S')

        files.append({
            'name': item,
            'dateModified': date_modified_str,
            'type': itemType,
            'size': size_str
        })

    return json.dumps(files)

@app.route('/download')
def download():
    file_name = request.args.get('file')
    abs_path = os.path.join(ROOT_DIR, file_name)
    return send_from_directory(ROOT_DIR, file_name, as_attachment=True)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=25565)