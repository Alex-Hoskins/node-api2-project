// implement your posts router here
const express = require('express')
const Post = require('./posts-model')
const router = express.Router()

// get all posts
router.get('/', (req, res) => {
    Post.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "The posts information could not be retrieved" });
      });
  });

//get post by id
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
        else{
            res.status(200).json(post);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: "The post information could not be retrieved" });
      });
  });
//post to posts
router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents){
            res.status(400).json({ message: "Please provide title and contents for the post" })
        }
    else{
        Post.insert(req.body)
            .then(post => {
                    res.status(201).json(post);
            })
            .catch(error => {
                res.status(500).json({ message: "There was an error while saving the post to the database" });
            });
    }     
  });
//put post by id
//delete by id
//get comments by post id

 module.exports = router