import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            title
            description
            image
            link
        }
    }
  }
`;

export const QUERY_ME_MIN = gql`
  {
    me {
        _id
        username
    }
  }
`;
