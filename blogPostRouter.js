const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model');


//creating sample data
BlogPosts.create(
    'First Entry', 'This is my first blog post.', 'Shakespeare', 'July 4'
);
BlogPosts.create(
    'Second Entry', 'This is my second blog post.', 'Shakespeare', 'August 4'
);

//send back JSON representation of all blog posts
//on GET requests to root
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/blog-posts', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'date'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body.`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.date);
    res.status(201).json(item);
});

router.delete('/blog-posts/:id', (req,res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog entry \`${req.params.ID}\``);
    res.status(204).end();
});

router.put('/blog-posts/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'date'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body.`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
          `Request path id (${req.params.id}) and request body id `
          `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog entry \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: req.body.date
    });
    res.status(204).end();
})

module.exports = router;