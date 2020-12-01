# monotome
i wanted to start a wiki so i made this

![screenshot](media/screen.png)

### Get Started
* **Clone** this project
* **Open** a terminal
* **Navigate** to the cloned directory
* **Run** `python -m http.server 8900`
* **Browse** to **`localhost:8900`** to use the wiki

---

### Structure
**Subjects** are ordered into a simple directory structure which is mirrored by `index.json`.

You can fill `index.json`'s `subjects` by hand if you want to avoid running a script. You can also run `node monotome/bin/generate.js` and it will write `index.json` for you.

This `readme.md` is the start page of your wiki and each `readme.md` within a subject folder is the overview page for that subject.

### Inlined articles
Monotome supports a link syntax for inlining other monotome articles into a source article.

![inlined-wiki](https://user-images.githubusercontent.com/3862362/100735405-717b0080-33d1-11eb-9911-8e210a5cb713.gif)

Any link `<a>` with a href referring to the local domain & which
has the anchor-tag attribute `download` will be inlined into the document.

e.g. if one file has some content and then:
`<a href="example/first.md" download></a>`

the file `example/first.md` will be inlined in place of the anchor tag, at the place where the tag is defined.

### Backlinks
Monotome keeps track of backlinks, i.e. links from one article inside monotome to another. To discover backlinks, run `node monotome/bin/generate.js`. For a taste of what backlinks look like in practice, see the gif below.

![monotome backlinks](https://user-images.githubusercontent.com/3862362/89731988-c58d5e00-da4b-11ea-82fc-0fa2f20b2505.gif)

### P2P
Fork it in [Beaker Browser](https://beakerbrowser.com/): `dat://35addfbd705e84c4ef734d07484c8f2c54773596ed32b63ee507b3c86bcc268c`


### License
monotome's code and resources are licensed under AGPL. 

`marked.js` is MIT-licensed and Inter UI is available under `SIL OPEN FONT LICENSE Version 1.1`

Read the respective license files for more information.
