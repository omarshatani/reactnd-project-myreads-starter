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
    searchedBooks: [],
    favourites: [],
    path: ''
  }

  componentWillMount() {

    //Get current favourites books
    BooksAPI.getFav().then((favourites) => {
      this.setState({ favourites })
      console.log('Favourites', favourites)
    })

    //Get current books on the shelf
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
      console.log('Books', books)
    })

  }

  //Updates dynamically the search result and add it on the searchedBooks array
  updateQuery = (query) => {
    this.setState({ query })
    if (query) {
      BooksAPI.search(query)
      .then(searchedBooks => {
        if (!searchedBooks.error) {
          this.setState({ searchedBooks })
        }
      })
    }
  }
  //Update a books shelf when its own state changes
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

  updateFav = () => {
    console.log('Updated')
    BooksAPI.getFav().then((favourites) => {
      this.setState({ favourites })
      console.log('Favourites', favourites)
    })

  }

  render() {

  let showingBooks;

  if (window.location.pathname === '/search') {
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query.split(' ').join('')), 'i')
        showingBooks = this.state.searchedBooks.filter(book => match.test(book.title.split(' ').join('')))
        /** 
         * Case found no match in book's title
         * Look for a match in book's authors
        */
        if (showingBooks.length < 1)
          showingBooks = this.state.searchedBooks.filter(book => book.authors ? match.test(book.authors.toString().split(' ').join('')) : '')
      
      // Check if the book on the search page is on a shelf, and update its shelf
      for (let book of showingBooks) {
        this.state.books.map(b => {
          if (b.id === book.id) {
            book.shelf = b.shelf
            return true
          }
          else
            return book
        })
      }
      showingBooks.sort(sortBy('title'));
    } else {
      showingBooks = []
    }
  }

  if (window.location.pathname === '/favourites') {
    
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query.split(' ').join('')), 'i')
        showingBooks = this.state.favourites.filter(book => match.test(book.title.split(' ').join('')))
        /** 
         * Case found no match in book's title
         * Look for a match in book's authors
        */
        if (showingBooks.length < 1)
          showingBooks = this.state.favourites.filter(book => book.authors ? match.test(book.authors.toString().split(' ').join('')) : '')
      
      // Check if the book on the search page is on a shelf, and update its shelf
      for (let book of showingBooks) {
        this.state.books.map(b => {
          if (b.id === book.id) {
            book.shelf = b.shelf
            return true
          } else
            return book
        })
      }
        showingBooks.sort(sortBy('title'));
      } else {
        showingBooks = this.state.favourites;
      }
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
                    <Book onUpdateFavs={() => this.updateFav()} onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)} books={book} key={book.id} favs = {this.state.favourites} />
                    ))
                }
                </ol>
              </div>
            </div>
          )} />

          <Route exact path="/" render={() => (
            <BooksList books={this.state.books}  onUpdateFavs={() => this.updateFav()} onUpdateShelfs={(book, shelf) => this.updateShelf(book, shelf)} favs = {this.state.favourites} />
          )} />

          <Route exact path="/favourites" render={() => (
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
                      <Book onUpdateFavs={() => this.updateFav()} onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)} books={book} key={book.id} favs = {this.state.favourites} />
                      ))
                  }
                  </ol>
                </div>
            </div>
          )} />

        </div>
    )
  }
}

export default BooksApp
