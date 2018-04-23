# PickUp
PickUp Web App for CS 115
Some Documentation:

package.json:
-----------------------------------------------------------------------------------------
=>lists all dependencies.

webpack.config.js
-----------------------------------------------------------------------------------------
=>bundles files and allows babel usage. Uses server.js for server.

server.js
-----------------------------------------------------------------------------------------
=>simple server. Calls main html on path "/" and sets "dist" to serve static files.

dist
-----------------------------------------------------------------------------------------
=>serves static files
  bundle.js
  =>output of webpack
  
  main.html
  =>main html
  
  public
  =>contains static js scripts
    map.js
    =>implements google maps
src
-----------------------------------------------------------------------------------------
=>serves sources to be bundled.
  components
  =>contains react components
  
  css
  =>contains stylesheets
  
  index.js
  =>entry file for webpack, where the bundling begins
  
  initdata.js
  =>inserts data into database. Will create duplicates elements if used more than once.
