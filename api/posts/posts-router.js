// implement your posts router here
const PostModel = require('./posts-model')

const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    PostModel.find()
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    })
})
router.get('/:id', (req, res) => {
        const { id } = req.params;
    PostModel.findById(id)
    .then(response => {
        if(response === undefined) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json({ message: "The post information could not be retrieved" })
    })
})
router.post('/', (req,res) => {
    const { title, contents } = req.body;
    if(!title ||!contents || title.trim() === "" || contents.trim() === "") {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        PostModel.insert({title, contents})
        .then(response => {
            return PostModel.findById(response.id);
        })
        .then(response => {
            res.status(201).json(response)
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
    }
})
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if(!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        PostModel.findById(id)
        .then(response => {
            if(!response) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                PostModel.update(id, {title, contents})
                .then(response => {
                    PostModel.findById(response)
                    .then(response => res.status(200).json(response))
                })
                .catch(err => {
                    res.status(500).json({ message: "The post information could not be modified" })
                })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be modified" })
        })
    }  
})
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findById(id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            PostModel.remove(id)
            .then(response => {
                res.status(200).json(post);
            })
            .catch(err => {
                res.status(500).json({ message: "The comments information could not be retrieved" })
            })
        }
})
router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const post = await PostModel.findById(id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            PostModel.findPostComments(id)
            .then(response => {
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({ message: "The comments information could not be retrieved" })
            })
        }
})

module.exports = router;