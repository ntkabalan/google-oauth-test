const express = require('express');

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const User = require('../models/User');
const Story = require('../models/Story');

const router = express.Router();

// Stories index
router.get('/', (req, res) => {
    Story.find({ status: 'public' })
    .populate('user')
    .sort({ date: 'desc' })
    .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    })
});

// Add story page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Add story post route
router.post('/add', (req, res) => {
    const newStory = {
        user: req.user.id,
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: req.body.allowComments === 'on',
        comments: []
    }
    new Story(newStory).save().then(story => {
        res.redirect(`/stories/show/${story._id}`);
    });
});

// Edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({ _id: req.params.id }).then(story => {
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story: story
            });
        }
    });
});

// Edit story put request
router.put('/:id', ensureAuthenticated, (req, res) => {
    const updatedStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: req.body.allowComments === 'on',
    }
    Story.findByIdAndUpdate(req.params.id, updatedStory).then(story => {
        res.redirect('/stories');
    });
});

// Story delete request
router.delete('/:id', (req, res) => {
    Story.findByIdAndRemove(req.params.id).then(() => {
        res.redirect('/dashboard');
    });
});

// Comment post route
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
    }
    Story.findById(req.params.id).then(story => {
        story.comments.unshift(newComment);
        story.save().then(() => {
            res.redirect('/stories/show/' + req.params.id);
        });
    });
});

// Story page
router.get('/show/:id', (req, res) => {
    Story.findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments.commentUser')
        .then(story => {
            if (story.status === 'public') {
                res.render('stories/show', {
                    story: story
                });
            } else {
                if (req.user) {
                    if (story.user.id === req.user.id) {
                        res.render('stories/show', {
                            story: story
                        });
                    } else {
                        res.redirect('/stories');
                    }
                } else {
                    res.redirect('/stories')
                }
            }
        })
});

// View a specific user's public stories
router.get('/user/:id', (req, res) => {
    Story.find({ user: req.params.id, status: 'public' })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        });
});

// View logged in user's stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            })
        });
});

module.exports = router;