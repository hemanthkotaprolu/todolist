const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const port = 3000

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    
    switch (currentDay) {
        case 0:
            day = "sunday! :)";
            break;
        case 1:
            day = "monday! :(";
            break;
        case 2:
            day = "tuesday";
            break;
        case 3:
            day = "wednesday";
            break;
        case 4:
            day = "thursday";
            break;
        case 5:
            day = "friday! :|";
            break;
        case 6:
            day = "saturday :)";
            break;
        default:
            break;
    }
    
    res.render("list", { kindOfDay : day });
});

app.listen(port, function () {
    console.log("App started running on port: " + port);
});