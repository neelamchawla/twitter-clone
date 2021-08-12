const express = require('express');
const router = express.Router();
const Post = require('../../models/posts');
const { isLoggedIn } = require('../../middleware');
const User = require('../../models/user');

// 1. Get all the post
router.get('/api/post', isLoggedIn, async (req, res) => {
    // we'll get postedBy user's id
    // console.log(req.query);

    // add filter to filter out users
    const filter = req.query;
    
    // All post will be res
    const results = await Post.find(filter)
    .populate("postedBy")
    .populate("replyTo");

    // populate wrt user replied to post
    posts = await User.populate(results, { path: "replyTo.postedBy" });

    res.json(posts);
});

// 4. Get post id
router.get('/api/posts/:id', async (req, res) => {

    const post = await Post.findById(req.params.id).populate('postedBy');
    // console.log(post);
    res.status(200).json(post);
});

// 2. Create the new post
router.post('/api/post', isLoggedIn, async (req, res) => {
    console.log(req.body);

    let post = {
        postedBy: req.user,
        content: req.body.content
    }

    // check if replyTo exist ie whether we clicked on replyto button/its a new post
    // pass this a replyFlag
    if (req.body.replyTo) {
        post = {
            ...post,
            replyTo: req.body.replyTo
        }
    }

    // else create new post
    const newPost = await Post.create(post);
    res.json(newPost);
    // res.json("hello");
});

// 3. Update like request
router.patch('/api/posts/:id/like', isLoggedIn, async (req, res) => {

    // res.send("You liked the post")
    const postId = req.params.id;
    const userId = req.user._id;

    // check wx current user liked post before
    const isLiked = req.user.likes && req.user.likes.includes(postId);

    // disliked post -> pull    //  liked post -> addToSet
    const option = isLiked ? '$pull' : '$addToSet';
    
    // add/remove likes from user;
    // new:true => return new/updated ooption
    req.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true });    
    
    // add/remove likes from post
    const post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true });

    res.status(200).json(post);
});

module.exports = router;