const express = require('express');
const bodyParser = require("body-parser");
const mongoose =require('mongoose');

const app = express();
const port = 3000;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

try {
    mongoose.connect(
        "mongodb+srv://kotaproluhemanth:mongodb@cluster1.49ync9e.mongodb.net/todolistDB?retryWrites=true&w=majority",
        connectionParams
    );
    console.log("DB connected!");
} catch(error) {
    console.log(error);
    console.log("Connection failure");
}

const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<---- Hit this to delete the item"
});

// Item.insertMany([item1, item2, item3], function(error){
//     if(error) {
//         console.log(error);
//     } else {
//         console.log("Added items successfully");
//     }
// });



// const items = [];
const workItems= [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function (req, res) {
    
    
    Item.find({},function(error, foundItems) {
        if(foundItems.length === 0) {
            Item.insertMany([item1, item2, item3], function(error){
            if(error) {
                console.log(error);
            } else {
                console.log("Added items successfully");
            }});
            res.redirect("/");
        } else {
            console.log(foundItems);
            res.render("list", { listTitle: "Today", newListItems: foundItems});
        }
        // console.log(error);
    });
    
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    
    const item = new Item({
        name: itemName
    });
    
    item.save();
    res.redirect("/");
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res){
    let item = req.body.newItem;
    
    workItems.push(item);
});

app.get("/about", function(req, res) {
    res.render("about");
})

app.listen(port, function () {
    console.log("App started running on port: " + port);
});