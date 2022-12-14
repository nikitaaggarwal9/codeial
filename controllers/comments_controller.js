const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");

const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");

const commentEmailWorker = require("../workers/comment_email_worker");

module.exports.create = async function (req, res) {
  // console.log(req.body);
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();
      //   console.log(comment);
      comment = await comment.populate("user", "email");

      //   commentsMailer.newComment(comment);
      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          console.log("error in enqueing the comment in queue");
          return;
        }

        console.log("33", job.id);
      });

      //   if (req.xhr) {
      //     return res.status(200).json({
      //       data: {
      //         post: post,
      //       },
      //       message: "Post created!",
      //     });
      //   }

      req.flash("success", "Post published");

      res.redirect("/");
    }
  } catch (err) {
    console.log("error", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    // console.log("line 27", comment.user, req.user.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      // console.log(postId);
      comment.remove();

      let post = Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: req.params.id } },
        function (err, post) {
          return res.redirect("back");
        }
      );

      // CHANGE :: Delete the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: 'Comment'});
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
