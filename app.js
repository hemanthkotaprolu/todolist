const express = require('express');
const bodyParser = require("body-parser");
const mongoose =require('mongoose');
const _ = require('lodash');

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

try {
    mongoose.connect(
        <mongodb connecting string> ,
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

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);


app.get('/', function (req, res) {
    
    
    Item.find({},function(error, foundItems) {
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(error){
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
    });
    
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const item = new Item({
        name: itemName
    });
    
    if(listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(error, foundList){
            if(error) {
                console.log(error);
            } else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+listName);
            }
        });
    }
    
});

app.get("/:customeListName", function(req, res) {
    const customeListName = _.capitalize(req.params.customeListName);
    
    List.findOne({name: customeListName}, function(error,foundList){
        if(error) {
            console.log(error);
        }
        
        if(!foundList) {
            const list = new List({
                name: customeListName,
                items: defaultItems
            });
            
            list.save();
            
            res.redirect("/"+customeListName);
        } else {
            // console.log("Found!!");
            res.render("list", {listTitle: customeListName, newListItems: foundList.items});
        }
        // console.log(foundList);
    });
    
    
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

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        }
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });
    }
  
  
  });

app.listen(port, function () {
    console.log("App started running on port: " + port);
});
