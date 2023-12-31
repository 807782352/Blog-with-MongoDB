//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGO_PATH = "mongodb://127.0.0.1:27017/";
const COLLECTION = "posts";
mongoose.connect(MONGO_PATH + COLLECTION);

/** Posts Schema */
const postSchema = new Schema({
  title: String,
  content: String,
});

/** Post Model */
const Post = mongoose.model("post", postSchema);

/** Post related functions */
async function insertPost(title, content) {
  try {
    await new Post({
      title,
      content,
    }).save();
    console.log("Successfully insert a post!");
  } catch (error) {
    console.error(error);
  }
}

async function showAllPosts() {
  try {
    const posts = await Post.find({});
    console.log("Successfully show all posts!");
    return posts;
  } catch (error) {
    console.error(error);
  }
}

async function findPostById(postId) {
  try {
    const foundPost = await Post.findById(postId);
    if (foundPost) {
      console.log("Successfully find the post!");
    } else {
      console.log("No such post!");
    }
    return foundPost;
  } catch (error) {
    console.error(error);
  }
}

let posts = [];

app.get("/", async function (req, res) {
  try {
    posts = await showAllPosts();
  } catch (error) {
    console.error(log);
  }

  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  const title = req.body.postTitle;
  const content = req.body.postBody;

  await insertPost(title, content);

  res.redirect("/");
});

// app.get("/posts/:postName", function (req, res) {
//   const requestedTitle = _.lowerCase(req.params.postName);

//   // posts.forEach(function (post) {
//   //   const storedTitle = _.lowerCase(post.title);

//   //   if (storedTitle === requestedTitle) {
//   //     res.render("post", {
//   //       title: post.title,
//   //       content: post.content,
//   //     });
//   //   }
//   // });

//   const foundPost = posts.find((post) => {
//     const storedTitle = _.lowerCase(post.title);
//     // console.log(storedTitle, requestedTitle)
//     return storedTitle === requestedTitle;
//   });

//   if (foundPost) {
//     res.render("post", {
//       title: foundPost.title,
//       content: foundPost.content,
//     });
//   } else {
//     console.error("No such post.");
//   }
// });

app.get("/posts/:postId", async function (req, res) {
  const postId = req.params.postId;

  const foundPost = await findPostById(postId);
  
  if (foundPost) {
    res.render("post", {
      title: foundPost.title,
      content: foundPost.content,
    });
  } else {
    console.log("No such post");
    res.render("post", {
      title: "Error",
      content: "Error",
    });
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
