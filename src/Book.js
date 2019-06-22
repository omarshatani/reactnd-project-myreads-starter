import React from 'react'
import * as BooksAPI from './BooksAPI'

class Book extends React.Component {

	state = {
		shelf: 'none'
	}

	componentDidMount () {
		if (this.props.books)
			this.setState({
				shelf: this.props.books.shelf
			})
	}

	update = (event) => {
		const { books, onUpdateBook } = this.props;
		this.setState({
			shelf: event.target.value
		})
		onUpdateBook(books, event.target.value);
	}

	addDeleteFav = (e) => {
		const { books, onUpdateFavs } = this.props;
		e.stopPropagation()
		console.log(e.target)
		console.log(books)
		switch (e.target.className) {
			case 'favButton deleteFav': 
				BooksAPI.deleteFav({
					id: books.id,
					title: books.title,
					authors: books.authors ? books.authors[0] : '',
					imageLinks: books.imageLinks.thumbnail ? books.imageLinks : ''
				})
				.then(res => {
					onUpdateFavs()
				})
				.catch(err => console.log(err))
				break;
			case 'favButton addFav': 
				BooksAPI.addFav({
					id: books.id,
					title: books.title,
					authors: books.authors ? books.authors[0] : '',
					imageLinks: books.imageLinks.thumbnail ? books.imageLinks : ''
				})
				.then(res => {
					onUpdateFavs()
				})
				.catch(err => console.log(err))
			break;
			default:;
		}
		
	}

	getClass = (book) => {
		let favs = this.props.favs.filter((favBook) => favBook.title === book.title);
		return favs.length > 0
	}

	render () {
		if (window.location.pathname === "/favourites") {
			console.log(this.props)
		}
		const { books } = this.props;
		return (
				<li>
					<div className="book">
					  <div className="book-top">
							<div className={this.getClass(books) ? 'favButton deleteFav' : 'favButton addFav'} onClick={this.addDeleteFav}></div>
					    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: books.imageLinks ? `url(${books.imageLinks.thumbnail})` : '' }}></div>
					    <div className="book-shelf-changer">
					      <select
					      value={this.state.shelf}
					      onChange={this.update}
					      >
					        <option value="move" disabled>Move to...</option>
					        <option value="currentlyReading">Currently Reading</option>
					        <option value="wantToRead">Want to Read</option>
					        <option value="read">Read</option>
					        <option value="none">None</option>
					      </select>
					    </div>
					  </div>
					  <div className="book-title">{books.title}</div>
					  <div className="book-authors">{books.authors ? books.authors.toString() : ''}</div>
					</div>
				</li>
			)
	}
}

export default Book