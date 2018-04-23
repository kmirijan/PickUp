# PickUp
PickUp Web App for CS 115
Some Documentation:

package.json:
-----------------------------------------------------------------------------------------
=>lists all dependencies. <br />

webpack.config.js
-----------------------------------------------------------------------------------------
=>bundles files and allows babel usage. Uses server.js for server. <br />

server.js
-----------------------------------------------------------------------------------------
=>simple server. Calls main html on path "/" and sets "dist" to serve static files. <br />

dist
-----------------------------------------------------------------------------------------
=>serves static files <br />
  bundle.js <br />
  =>output of webpack <br />
  
  main.html <br />
  =>main html <br />
  
  public <br />
  =>contains static js scripts <br />
    map.js <br />
    =>implements google maps <br />
src
-----------------------------------------------------------------------------------------
=>serves sources to be bundled. <br />
  components <br />
  =>contains react components <br />
  
  css <br />
  =>contains stylesheets <br />
  
  index.js <br />
  =>entry file for webpack, where the bundling begins <br />
  
  initdata.js <br />
  =>inserts data into database. Will create duplicates elements if used more than once. <br />
