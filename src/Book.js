import React from 'react'

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

	render () {
		const { books } = this.props;
		return (
				<li>
					<div className="book">
					  <div className="book-top">
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