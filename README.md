# Basic File System Web Explorer (BFSWE)

A simple file system explorer that runs in your browser.

The goal was to have a web version of my external HDD that I could let my friends grab files from without having to bother sending them through \<insert platform here>.

Due to its simple nature, this app completely lacks any concept of security - it's more of a template to build upon.
Due to the no security whatsoever, this is more of a "use at your own risk" app in this state, which if you're using, you should turn off as soon as you're done.

All you need is Python 3.x and Flask:
`pip install flask`

Steps in order to run the app:
1) Go into `scripts.js` and modify the ROOT_DIR variable at the top of the file to whatever you want your root directory to be.
2) Place the "Server" folder on the same drive as the ROOT_DIR.
3) Open up a terminal and run it with `python app.py`.
