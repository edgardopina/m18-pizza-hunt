const { Pizza, Comment } = require('../models');
const commentController = {
   addComment({ params, body }, res) {
      Comment.create(body)
         .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
               { _id: params.pizzaId },
               { $push: { comments: _id } }, 
               { new: true } 
            )
         })
         .then(dbPizzaData => {
            if (!dbPizzaData) {
               res.status(404).json({ message: 'No pizza found with this id!' });
               return;
            }
            res.json(dbPizzaData);
         })
         .catch(err => res.json(err));
   },

   //* remove comment from pizza
   removeComment({ params }, res) {
      Comment.findOneAndDelete({ _id: params.commentId })
         .then(deletedComment => {
            if (!deletedComment) {
               return res.status(404).json({ message: 'No pizza found with this id!' });
            }
            return Pizza.findOneAndUpdate(
               { _id: params.pizzaId },
               { $pull: { comments: params.commentId } },
               { new: true }
            );
         })
         .then(dbPizzaData => {
            if (!dbPizzaData) {
               res.status(404).json({ message: 'No pizza found with this id!' });
               return;
            }
            res.json(dbPizzaData);
         })
         .catch(err => res.json(err));
   },

   getComments({ body }, res) {
      Comment.find({}).then(dbCommentData => res.json(dbCommentData));
   },
};

module.exports = commentController;
