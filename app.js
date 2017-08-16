//setup
var express = require("express");
var app = express();
//used to parse data... data comes into the body and we use body-parser to display it
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var mongoose = require("mongoose");

//creates and connects to database
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));

//needed to have a put and delete request in our edit route
app.use(methodOverride("_method"))

app.use(express.static("public"));

app.set("view engine", "ejs");

var port = 3004;

//Mongoose setup
//this is your schema where you set up your data types 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//is neeeded in order to set up a model pattern. It returns an object of methods to use.
var Blog = mongoose.model("Blog", blogSchema)

//starter data
// Blog.create(
//     {title: "I love my new job", 
//     image:"http://www.fuzzyduck.com/wp-content/uploads/2014/05/ley_0009_Feature.png", 
//     body:"My job is so awesome. I love coding and its so cool how I make money with code"}, function(err, blog){
//         if(err){
//             console.log("something went wrong")
//         } else{
//             console.log("new blog added")
//             console.log(blog)
//         }
//     })
    

//RESTful Routes

//Landing page route
app.get("/", function(req, res){
    res.redirect("/blog")
})

//INDEX ROUTE - Displays all the blogs
app.get("/blog", function(req, res){
    Blog.find({}, function(err, blogs){
    if(err){
        console.log("something went wrong")
    } else {
        console.log("here you go")
         res.render("index", {blogs: blogs})
    }
})
   
})

//NEW ROUTE
app.get("/blog/new", function(req, res){
    res.render("new")
})

//CREATE ROUTE
app.post("/blog", function(req, res){
  Blog.create(req.body.blog, function(err, newBlog){
      if(err){
          console.log("oops, something went wrong")
      } else {
          res.redirect("/blog")
      }
  })
})
//since we gave the input fields of the form name = blog, we do not need to create seperate variables that 
//contain req.body.name but instead just pass in req.body.blog as an argument in the create function

//SHOW ROUTE
app.get("/blog/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("oops cannot proceed with your request")
        } else {
            res.render("show", {blog: foundBlog})
        }
    })
})

//EDIT ROUTE
app.get("/blog/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("oops something went wrong")
        } else {
            res.render("edit", {blog: foundBlog})
        }
    })
})

//UPDATE ROUTE
app.put("/blog/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            console.log("sorry could not update")
        } else {
            res.redirect("/blog/" + req.params.id)
        }
    })
})
// the second argument in the redirect has to be req.params.id to redirect to the accurate post that we updated.

//DESTROY/DELETE ROUTE
app.delete("/blog/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log("could not delete this item")
       } else{
           res.redirect("/blog")
       }
   })
})


app.listen(port, function() {
  console.log("Started server on port", port);
});

