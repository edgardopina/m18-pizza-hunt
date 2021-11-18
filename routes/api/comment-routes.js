//! file to set up express Comment router
const router = require('express').Router();

//! import comment-controller functionality and destructure comment-controller into method names
const { addComment, removeComment, getComments } = require('../../controllers/comment-controller');

router
   .route('/')
   //* get all comments
   .get(getComments);

router
   .route('/:pizzaId')
   //* call controller methods for this route
   .post(addComment);

router
   .route('/:pizzaId/:commentId')
   //* call controller methods for this route
   .delete(removeComment);

module.exports = router;
