import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book.js'

class BooksList extends React.Component {

	updateBook = (book, shelf) => {
		this.props.onUpdateShelfs(book, shelf);
  }
  
  updateFav = () => {
    this.props.onUpdateFavs();
  }

	render () {
		const { books } = this.props;
		return (
		<div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
						{
							books.filter((book) => book.shelf === "currentlyReading")
							.map((book) => (
								<Book onUpdateFavs={() => this.updateFav()} onUpdateBook={(book, shelf) => this.updateBook(book, shelf)} books={book} key={book.id} favs = {this.props.favs} />
							))
						}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
						{
							books.filter((book) => book.shelf === "wantToRead")
							.map((book) => (
								<Book onUpdateFavs={() => this.updateFav()} onUpdateBook={(book, shelf) => this.updateBook(book, shelf)} books={book} key={book.id} favs = {this.props.favs} />
							))
						}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
						{
							books.filter((book) => book.shelf === "read")
							.map((book) => (
								<Book onUpdateFavs={() => this.updateFav()} onUpdateBook={(book, shelf) => this.updateBook(book, shelf)} books={book} key={book.id} favs = {this.props.favs} />
							))
						}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search" id="add" >Add a book</Link>
              <Link to="/favourites" id="fav" >Go to favourites</Link>
            </div>
          </div>
              )
	}
}

export default BooksList