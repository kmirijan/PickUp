To do:
---
1. Fix upload image.
2. email validation check

PickUp
---
PickUp Web App for CS 115 <br />
Some Documentation:

__package.json:__ <br />
lists all dependencies. <br />

__webpack.config.js__ <br />
bundles files and allows babel usage. Uses server.js for server. <br />

__server.js__ <br />
simple server. Calls main html on path "/" and sets "dist" to serve static files. <br />

dist
---
* __bundle.js__ <br />
output of webpack <br />

* __index.html__ <br />
main html <br />

* __public__ <br />
contains static js scripts <br />
  * map.js <br />
  implements google maps <br />

src
---
* __index.js__ <br />
entry file for webpack, where the bundling begins <br />

* __initdata.js__ <br />
inserts data into database. Will create duplicates elements if used more than once. <br />

* __components__ <br />
contains react components <br />
  * data.js <br />
  contains function for search
  * main.jsx <br/ >
  contains components "Main" and "Rest"

* __server__ <br />

* __css__ <br />
contains stylesheets <br />
  * main.css <br />
  css stylesheet for main page
