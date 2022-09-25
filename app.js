const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const port = 3000

let items = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function (req, res) {
    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };

    let day = today.toLocaleDateString('en-US', options);

    res.render("list", { kindOfDay: day, newListItems: items});
});

app.post("/", function (req, res) {
    let item = req.body.newItem;
    
    items.push(item);
    
    // res.render("list", {kindOfDay: day, newListItem: item});
    res.redirect("/");
});

app.listen(port, function () {
    console.log("App started running on port: " + port);
});