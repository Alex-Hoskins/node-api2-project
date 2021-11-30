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
                    Post.findById(post.id)
                        .then(p=>{
                        res.status(201).json(p); 
                        })
                        .catch(err=>{
                            res.status(500).json({ message: "There was an error while saving the post to the database" });
                        })
            })
            .catch(error => {
                res.status(500).json({ message: "There was an error while saving the post to the database" });
            });
    }     
  });
//put post by id
router.put('/:id', (req, res) => {
    const changes = req.body;
    if(!changes.title || !changes.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }
    else{
        Post.update(req.params.id, changes)
        .then(post => {
            if (post) {
                Post.findById(req.params.id)
                    .then(p=>{
                    res.status(200).json(p)  
                    })
                    .catch(err=>{
                        res.status(500).json({ message: "The post information could not be modified" })
                    })
            } 
            else {
            res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "The post information could not be modified" });
        });
    }
  });
//delete by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params 
    const delPost = {}
    Post.findById(id)
        .then(pst=>{
            Post.remove(id)
                .then(deletedPost=>{
                    if (!deletedPost){
                        res.status(404).json({ message: "The post with the specified ID does not exist" })
                    }else{
                        res.json(pst)
                    }
                })
                .catch(err=>{
                    res.status(500).json({ message: "The post could not be removed" })
                })
        })
        .catch(err=>{
            res.status(500).json({ message: "The post could not be removed" })
        })
})
//get comments by post id
router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    Post.findById(req.params.id)
      .then(post => {
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
        else{
            Post.findPostComments(id)
                .then(comments => {
                    res.status(200).json(comments);
                })
                .catch(error => {
                    res.status(500).json({ message: "The comments information could not be retrieved" });
                });
        }
      }) 
  });

 module.exports = router