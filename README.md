Created a reusable express-like web framework that one can use to write simple web applications.
Specifically webby.js hosts a webpage on the local host server on port 3000.

Used the net module to create a TCP server that will allow connections from clients. It handles an incoming http request from a client by parsing the http request, determining what do based on the request, and finally sending back an http response.

webby.js mimics a subset of Express functionality, creating a Response, Request and App object.

Furthermore I created static server middleware to upload local files to the browser


node modules used:
- path
- net
