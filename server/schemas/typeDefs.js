const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]!
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    // user(id: ID!): User
    user(username: String!): User
    userById(_id: ID!): User
    users: [User]
  }

  type Mutation {
    login(username: String, email: String, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: Book!): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
