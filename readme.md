# monotome

i wanted to start a wiki so i made this

![screenshot](media/screen.png)

### Get Started
**clone this project** and open `index.html` to give it a try

if you're using chrome as your browser:
* **open** a terminal
* **navigate** to the cloned directory
* **run** `python -m SimpleHTTPServer`
* **browse** to **`localhost:8000`** to use the wiki

---

### Structure
**subjects** are ordered into a simple directory structure which is mirrored by `index.json`. you can fill `index.json`'s `subjects` by hand if you want to avoid running a script to use your wiki

you can also run `node monotome/bin/generate.js` and it will fill `index.json` for you

this `readme.md` is the start page of your wiki, and each `readme.md` within a subject folder is the overview page for
that subject


