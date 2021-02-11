//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//Connecting to database
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true, useUnifiedTopology: true});
//creating the schema
const articleSchema={
    title:String,
    content:String
};
// creating the model
const Article= mongoose.model("Article",articleSchema);
///////////////Requests targetting article collection//////////////////
//Get Request
app.get("/articles", function(req,res){
Article.find(function(err, result){
    if(!err){
        res.send(result);
    }else{
        res.send(err);
    }
});
});
//Post Request
app.post("/articles", function(req,res){
const newArticle= new Article({
    title:req.body.title,
    content:req.body.content
});
newArticle.save(function(err){
if(!err){
    res.send("Successfully added a new article");
}else{
    res.send(err);
}
});
});

//Delete Request
app.delete("/articles", function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully Deleted all the requests");
        }else{
            res.send(err);
        }
    });
});

/////////////////////////Requests targetting specific article///////////
/////////Using Chaining in express//////////
app.route("/articles/:articleTitle")
.get(function(req,res){
 Article.findOne({title:req.params.articleTitle}, function(err, result){
     if(!err){
         res.send(result);
     }else{
         res.send(err);
     }
 });
})
.put(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err,result){
            if(!err){
                res.send("Successfully Updated");
            }else{
                res.send(err);
            }
        }
    );
})
.patch(function(req,res){
    Article.updateOne( 
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err, result){
            if(!err){
                res.send("Success");
            }else{
                res.send(err);
            }
    });
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err,result){
            if(!err){
                res.send("Successfully deleted the Article");
            }else{
                res.send(err);
            }
        }

    );
});

app.listen(3000, function() {
  console.log("Server listening on port 3000");
});
