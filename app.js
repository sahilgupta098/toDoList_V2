//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
  let todoItems = [];
app.set('view engine', 'ejs');
mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://IAmPinior:thisisMyDBSPASSS123@cluster0.fvgg8d1.mongodb.net/todoListDB');
const itemSchema = new mongoose.Schema({
  name : String
});
const item = mongoose.model('Item',itemSchema);

const item1 = new item({
  name : 'webDevelopment'
});
const item2 = new item({
  name : 'English Conversation'
});
const item3 = new item({
  name : 'Booking reading'
});

const listNameSchema = new mongoose.Schema({
  name : String,
  itemList : [itemSchema]
});

const list = mongoose.model('List',listNameSchema);

let defaultItems = [item1,item2,item3];



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.post("/delete", function(req, res) {
  console.log(req.body);
  let idOfItemToDelete = req.body.selectedItemToDelete;
  console.log(idOfItemToDelete);
  if(req.body.listName == date.getDate()){
    item.findByIdAndRemove(idOfItemToDelete,function(err,items){
   
      console.log(items);
      res.redirect('/');
    
  });
  }
  else{
    list.findOneAndUpdate({ name: req.body.listName }, {$pull: {itemList: { _id: req.body.selectedItemToDelete }}},function(err,docs){
      if(!err){
        console.log('removed===',docs);
        res.redirect('/'+req.body.listName);
      }
      else{
        console.log('error===');
      }
    }
    
);
  
  }
  
});
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {

  item.find(function(err,items){
  if(err){
    console.log(err);
  }
  else{
    if(items.length == 0 ){
      item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log('items inserted successfully');
        }
      });
        res.redirect('/');
    }
    else{
      res.render("list", {listTitle: day, newListItems: items});
    }
    // console.log('items==',items);

     // mongoose.connection.close();


  }
});
const day = date.getDate();



});

app.post("/", function(req, res){

  // const item = req.body.list;
  console.log('lists==',req.body.parentParameter);
  const listName = req.body.parentParameter;
  const newItem = new item({
    name : req.body.newItem
  });
   
  list.findOne({name : listName},function(err,docs){
    if( date.getDate() == listName){
      newItem.save();
      res.redirect('/');
    } else{
          docs.itemList.push(newItem);
           docs.save();
           console.log('listName',docs);
           res.redirect('/'+listName);
        }
        
      
  });
});

app.get('/:listName',function(req,res){
  const listName = req.params.listName;
  // console.log(req.params.listName);
  list.findOne({name : listName},function(err,docs){
    if(err){
        console.log(err);
    }
    else{
      // console.log('founded==',docs);
      if(docs){
        res.render("list", {listTitle: docs.name, newListItems: docs.itemList});
      }
      else{
        const listNameToShow = new list({
          name : req.params.listName,
          itemList : defaultItems
        });
        listNameToShow.save();
        res.redirect('/'+req.params.listName);
      }

    }
  });

});





// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
