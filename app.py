from flask import Flask, request, render_template, send_file
import os
import json
from datetime import datetime
import shutil

app = Flask(__name__)
app.static_folder = 'static'

@app.route('/get_files')
def Get_files():
    folder_path = request.args.get('path', '/')

    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        return json.dumps([])

    # Populate table with all files and folders in current folder
    files = []
    item_id = 0
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
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

        # Update id
        item_id += 1

        files.append({
            'id': item_id,
            'name': item,
            'dateModified': date_modified_str,
            'type': itemType,
            'size': size_str
        })

    return json.dumps(files)

@app.route('/download')
def Download():
    file_path = request.args.get('file')

    if os.path.isfile(file_path):
        print(file_path)
        return send_file(file_path, as_attachment=True)
    else:
        folder_name = file_path.split("/")[-1]
        shutil.make_archive(folder_name, "zip", file_path)
        return send_file(f"./{folder_name}.zip", as_attachment=True)
    # problem here

@app.route('/cleanupdl')
def DLCleanup():
    file_path = request.args.get('file')
    print(file_path)
    print(f"{file_path.split('/')[-1]}.zip")
    #os.remove(f"{file_path.split('/')[-1]}.zip")
    return "OK",200

@app.route('/')
def Index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=25565)