const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const SERVE_PORT = 3000;

let app = express();
app.use(morgan("common"));

app.use("/static/js", express.static(path.join(__dirname, "bower_components")));
app.use("/static/assets", express.static(path.join(__dirname, "assets")));
app.use("/static/components", express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/assets/:infoType", (req, res) => {
    switch (req.params["infoType"]) {
        default: {
            res.sendStatus(500);
            break;
        }
        case "fileList": {
            // Set Content-Type
            res.contentType("application/json");
            // Disable Caching
            res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.header("Pragma", "No-Cache");
            fs.readdir(path.join(__dirname, "assets"),(err, files) => {
                res.send(JSON.stringify(
                    {
                        fileNames: files,
                        fileLength: files.length
                    }
                ))}
            );
            break;
        }
    }
});

app.listen(SERVE_PORT);