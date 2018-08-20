# wikisoft

i wanted to start a wiki so i made this

![screenshot](screen.png)

### Structure
subjects are ordered into a simple directory structure which is mirrored by `index.json`

you can fill index.json's `subjects` key by hand if you want to avoid even running a script to use your wiki

or you can run `node generate-structure.js` to do that for you

this `readme.md` is the start page of your wiki, and each `readme.md` within a subject folder is the overview page for
that subject

clone this project and open `index.html` to give it a try
