import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

class bookInput {
  title: string
  author: string
}

class bookEdit {
  id: number
  title: string
  author: string
}

class bookID {
  id: number
}

const typeDefs = `
  type Book {
    title: String!
    author: String!
  }

  type Series {
    books: [Book]
  }

  input bookID {
    id: Int
  }

  type Query {
    books: [Book],
    book(id: Int): Book
    series: Series
  }

  type Mutation {
    addBook(title: String, author: String): Book
    editBook(id: Int, title: String, author: String): Book
    deleteBook(id: Int): [Book]
  }
`

var books = [

    {
  
      title: 'The Awakening',
  
      author: 'Kate Chopin',
  
    },
  
    {
  
      title: 'City of Glass',
  
      author: 'Paul Auster',
  
    },
  
  ];

  const series = {
    books: [
      {
        title: "Book 1",
        author: "Series Author"
      },
      {
        title: "Book 2",
        author: "Series Author"
      },
      {
        title: "Book 3",
        author: "Series Author"
      }
    ]
  };

  

  // Resolvers define how to fetch the types defined in your schema.

// This resolver retrieves books from the "books" array above.

const resolvers = {

    Query: {
      books: () => books,
      book: (_, input: bookID) => {
        if (input.id < 0 || input.id >= books.length) {
          return null;
        }
        return books[input.id];
      },
      series: () => series,
    },

    Mutation: {
      addBook: (_, input: bookInput) => {
        const book = {
          title: String(input.title),
          author: String(input.author)
        }
        books.push(book);
        return book;
      },
      editBook: (_, input: bookEdit) => {
        if (input.id < 0 || input.id >= books.length) {
          return null;
        }
        books[input.id].title = String(input.title);
        books[input.id].author = String(input.author);
        return books[input.id];
      },
      deleteBook: (_, input: bookID) => {
        if(input.id < 0 || input.id >= books.length) {
          return null;
        }
        const removeBook = books[input.id];
        books = books.filter(obj => obj != removeBook);
        return books;
      }
    } 
  
  };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);