const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function(req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 15);

    // Post.find({}, function(err, posts) {
    //     return res.render('home', {
    //         title: "Home",
    //         posts: posts
    //     });
    // });

    // populate the user of each post
    // Post.find({})
    // .populate('user')
    // .populate({
    //     path: 'comments',
    //     populate: {
    //         path: 'user'
    //     }
    // })
    // .exec(function(err, posts) {
    //     // console.log(posts);

    //     User.find({}, function(err, users){
    //         return res.render('home', {
    //             title: "Home",
    //             posts: posts,
    //             all_users: users
    //         });
    //     });
    // });

// }

// converting above callback code to async-await

module.exports.home = async function(req, res) {
    try {
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        
        let users = await User.find({});
        
        return res.render('home', {
            title: "Home",
            posts: posts,
            all_users: users
        });
    } catch (error) {
        console.log("Error", error);
        return;
    }
}
