const { Post, User } = require('../models');

const postController = {

//GET all posts
  getAllPosts(req, res) {
    Post.find({})
      .populate({
        path: "reactions",
        select: "__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//GET post by id
  getPostById({ params }, res) {
    Post.findOne({ _id: params.postId })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//POST post
  createPost({ params, body }, res) {
    console.log(body);
    Post.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { posts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id"});
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
//PUT update post
  updatePost({ params, body }, res) {
    Post.findOneAndUpdate({ _id: params.postId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: "No post found with this id" });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
  },
//DELETE post
  deletePost({ params }, res) {
    Post.findOneAndDelete({ _id: params.postId })
      .then((deletedPost) => {
        if (!deletedPost) {
          return res.status(404).json({ message: "No post with this id" });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { posts: params.postId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

//POST reaction
  createReaction({ params, body }, res) {
    Post.findOneAndUpdate(
      { _id: params.postId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbPostData) => {
        if (!dbPostData) {
          return res
            .status(404)
            .json({ message: "No post found with this id" });
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
  },
//DELETE reaction
  deleteReaction({ params }, res) {
    Post.findOneAndUpdate(
      { _id: params.postId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbPostData) => {
        if (!dbPostData) {
          return res
            .status(404)
            .json({ message: "No post found with this id!" });
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = postController;