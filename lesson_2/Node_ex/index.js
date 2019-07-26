const http = require("http");

// http
//   .createServer(function(req, res) {
//     console.log("HTTP server running on port 3002");
//   })
//   .listen(3002);

http
  .createServer(function(req, res) {
    console.log("HTTP server running on port 3003");
    res.writeHead(200, { "Content-Type": "text/plain" });
    // res.write("Hello World!");
    res.end("<h1>im alive</h1>");
  })
  .listen(3003);
