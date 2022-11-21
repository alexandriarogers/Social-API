const router = require('express').Router();
const { getAllPosts, createPost, getPostById, updatePost, deletePost, createReaction, deleteReaction } = require('../../controllers/post-controller');

router.route('/').get(getAllPosts);

router.route('/:userId').post(createPost);

router.route('/:postId').get(getPostById).put(updatePost);

router.route('/:userId/:postId').delete(deletePost);

router.route('/:postId/:reactions').post(createReaction);

router.route('/:postId/:reactions/:reactionId').delete(deleteReaction);

module.exports = router;