// webby.js
// app.js
const webby = require('./webby.js');

const net = require('net');
const fs = require('fs');
const path = require('path');

HTTP_STATUS_CODES = {
    200: "OK", 
    404: "Not Found", 
    500: "Internal Server Error",
    400: "Bad Request",
    302: "Found" 
};

MIME_TYPES = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "html": "text/html",
    "css": "text/css",
    "txt": "text/plain"
};

function getExtension(fileName) {
    if (fileName.includes(".") != true) {
        return ''; 
    }
    let ext = fileName.split("."); 
    ext = ext[ext.length-1] 
    return ext.toLowerCase(); 
}

function getMIMEType(fileName) {
    let type = getExtension(fileName); 
    if (type == '') {return type;}
    else if (type == "png") {
        return MIME_TYPES.png; 
    }
    else if (type == "jpg") {
        return MIME_TYPES.jpg; 
    }
    else if (type == "jpeg") {
        return MIME_TYPES.jpg; 
    }
    else if (type == "gif") {
        return MIME_TYPES.gif; 
    }
    else if (type == "html") {
        return MIME_TYPES.html; 
    }
    else if (type == "css") {
        return MIME_TYPES.css; 
    }
    else if (type == "txt") {
        return MIME_TYPES.txt; 
    }
}


class Request {
    constructor(s) {
      const [method, path] = s.split(' ');  
      this.method = method;
      this.path = path; 
    }
}

class Response {
    constructor(socket, statusCode=200, version="HTTP/1.1") {
        this.sock = socket; 
        this.statusCode = statusCode; 
        this.version = version; 
        this.headers = {}; 
        //this.body = ""; 
    }

    set(name, value) {
        this.headers[name] = value; 
    }

    end() {
        this.sock.end(); 
    }

    statusLineToString() {
        return this.version + ' ' + this.statusCode + ' ' + HTTP_STATUS_CODES[this.statusCode] + '\r\n';
    }

    headersToString() {
        let str = ""; 
        for (let i in this.headers){ 
            str += i + ": " + this.headers[i] + "\r\n"; 
        }
        return str; 
    }

    send(body) {
        this.body = body; 
        if (!this.headers.hasOwnProperty("Content-Type")) {
            this.headers["Content-Type"] = "text/html"; 
        }
        let responseData = this.statusLineToString() + this.headersToString() + "\r\n";
        this.sock.write(responseData); 
        this.sock.write(body); 
        this.end(); 
    }

    status(statusCode) {
        this.statusCode = statusCode; 
        return this; 
    }

}


class App {
    constructor() {
        this.server = net.createServer(sock => this.handleConnection(sock)); 
        this.routes = {}; 
        this.middleware = null; 
    }

    normalizePath(path) {
        path = path.toLowerCase(); 
        path = path.split("?"); 
        path = path[0].split("#"); 
        path = path[0];
        if (path[path.length-1] === "/") {
            path = path.slice(0, path.length-1);
        }
        return path; 
    }

    createRouteKey(method, path) {
        return method.toUpperCase() + " " + this.normalizePath(path); 
    }

    get(path, cb) {
        this.routes[this.createRouteKey("GET", path)] = cb; 
    }

    use(cb) {
        this.middleware = cb; 
    }

    listen(port, host) {
        this.server.listen(port, host); 
    }

    handleConnection(sock) {
        sock.on('data', (data) => this.handleRequest(sock, data));
    }

    handleRequest(sock, binaryData) {
        const req = new Request("" + binaryData );
        const res = new Response(sock);
        if (this.middleware !== null) {
            this.middleware(req, res, () => {this.processRoutes(req, res)});
        }
        else {
            this.processRoutes(req, res);
        }
    }

    processRoutes(req, res){
        const router = this.createRouteKey(req.method, req.path);
        if(this.routes.hasOwnProperty(router)){
            this.routes[router](req, res);
        } else {
            res.statusCode = 404; 
            res.send("Page not found"); 
        }
    }
}

function serveStatic(basePath) {
    return (req, res, next) => {
        const directory = path.join(basePath, req.path); 
        fs.readFile(directory, (err, data) => {
            if (err) {
                next();
            }
            else {
                res.set("Content-Type", getMIMEType(req.path)); 
                res.status(200).send(data); 
            }
        });
    };
};

module.exports = {
    HTTP_STATUS_CODES: HTTP_STATUS_CODES,
    MIME_TYPES: MIME_TYPES,
    getExtension: getExtension,
    getMIMEType: getMIMEType,
    Request: Request,
    App: App,
    serveStatic: serveStatic,
    Response: Response,     
    static: serveStatic
}


