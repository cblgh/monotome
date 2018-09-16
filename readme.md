# monotome
i wanted to start a wiki so i made this

![screenshot](media/screen.png)

### Get Started
**Clone this project** and open `index.html` to give it a try

if you're using **chrome** as your browser:
* **Open** a terminal
* **Navigate** to the cloned directory
* **Run** `python -m SimpleHTTPServer`
* **Browse** to **`localhost:8000`** to use the wiki

---

### Structure
**Subjects** are ordered into a simple directory structure which is mirrored by `index.json`.

You can fill `index.json`'s `subjects` by hand if you want to avoid running a script. You can also run `node monotome/bin/generate.js` and it will write `index.json` for you.

This `readme.md` is the start page of your wiki and each **`readme.md`** within a subject folder is the overview page for that subject.

### License
monotome's code and resources are licensed under AGPL. 

`marked.js` is MIT, and Inter UI is available under `SIL OPEN FONT LICENSE Version 1.1`. Read the respctive license files for more information
