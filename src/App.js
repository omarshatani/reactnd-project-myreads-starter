import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route, Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import BooksList from './BooksList.js'
import Book from './Book.js'

class BooksApp extends React.Component {
  state = {
    query: '',
    books: [],
    searchedBooks: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
      console.log(books)
    })
  }

  updateQuery = (query) => {
    this.setState({ query })
    if (query) {
      BooksAPI.search(query)
      .then(searchedBooks => {
        if (!searchedBooks.error)
          this.setState({ searchedBooks })
        else
          console.log(searchedBooks)
      })
    }
  }

  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.includes(book)) {
      books = this.state.books.map(b => {
        if (b.id === book.id)
          return {...book, shelf}
        else
          return b
      })
    } else {
      books = [...this.state.books, {...book, shelf}];
    }
    this.setState({ books })
    BooksAPI.update(book, shelf)
  }

  render() {

  let showingBooks;
  if (this.state.query) {
    const match = new RegExp(escapeRegExp(this.state.query.split(' ').join('')), 'i')   
    showingBooks = this.state.searchedBooks.filter(book => match.test(book.title.split(' ').join('')))
    /** 
     * Case found no match in book's title
     * Look for a match in book's authors
    */
    if (showingBooks.length < 1)
      showingBooks = this.state.searchedBooks.filter(book => book.authors ? match.test(book.authors.toString().split(' ').join('')) : '')
    console.log(showingBooks)

    showingBooks.sort(sortBy('title'));

  } else {
    showingBooks = []
  }
    return (
        <div className="app">
          <Route exact path="/search" render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/" className="close-search">Close</Link>
                <div className="search-books-input-wrapper">
                  <input 
                  type="text" 
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(event) => this.updateQuery(event.target.value)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                {
                  showingBooks.map((book) => (
                    <Book onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)} books={book} key={book.id} />
                    ))
                }
                </ol>
              </div>
            </div>
          )} />

          <Route exact path="/" render={() => (
            <BooksList books={this.state.books} onUpdateShelfs={(book, shelf) => this.updateShelf(book, shelf)} />
          )} />

        </div>
    )
  }
}

export default BooksApp
