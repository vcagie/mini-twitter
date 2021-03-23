const { Router } = require("express");
const { getAllTweets, postTweet, deleteTweet, updateTweet } = require("../controllers/tweets.controller");
const { getUsers, createUser, getUserByUsername, deleteUser, updateUser } = require('../controllers/user.controller');
const router = Router();


//user
router.get("/users", getUsers);
router.post('/loginUser', getUserByUsername);
router.put('/users/:id', updateUser);
router.post('/registerUser', createUser);
router.delete('/users/:id', deleteUser);

//tweets
router.get('/tweets', getAllTweets);
router.post('/tweets', postTweet);
router.put('/tweets/:id', updateTweet);
router.delete('/tweets/:id', deleteTweet);

module.exports = router;
