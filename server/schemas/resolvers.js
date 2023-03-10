// import necessary modules
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

// define resolvers
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        return userData;
      }

      throw new AuthenticationError('You are not logged in!');
    },
    users: async () => {
      return User.find().select('-__v -password').populate('savedBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).select('-__v -password').populate('savedBooks');
    },
    books: async () => {
      return Book.find();
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ bookId });
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email or password!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      throw new AuthenticationError('You are not logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }

      throw new AuthenticationError('You are not logged in!');
    }
  }
};

// export resolvers
module.exports = resolvers;
