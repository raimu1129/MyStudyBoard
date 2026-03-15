const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const { error } = require("console");

const postRoutes = require("./routes/posts");

const mongoose = require("mongoose");

mongoose
    .connect("mongodb://127.0.0.1:27017/mystudyboard")
    .then(() => {
        console.log("Mongodb接続完了");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log("METHOD:", req.method, "URL:", req.url);
    next();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
