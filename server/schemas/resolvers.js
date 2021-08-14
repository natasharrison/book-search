// import user model
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const bookSchema = require('../models/Book');
// import sign token function from auth
const { signToken } = require('../utils/auth');



const resolvers = {

  Query: {
    // get a single user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
    },
    //    get a single user by user id
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
    },
  },

  Mutation: {

    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Unable to find user');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    // user comes from `req.user` created in the auth middleware function
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const savedBooks = await bookSchema.create({ ...args, username: context.user.username });

        await User.findByIdandUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return savedBooks;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    // remove a book from `savedBooks`
    deleteBook: async (parent, args, context) => {
      if (context.user) {
        const savedBooks = await bookSchema.create({ ...args, username: context.user.username });

        await User.findByIdandUpdate(
          { _id: context.user._id },
          { $pull: { thoughts: thought._id } },
          { new: false }
        );

        return savedBooks;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;
