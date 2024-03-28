function updateSelectedBooksDisplay() {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear the container for selected books

    selectedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'selected-book';

        // Title
        const title = document.createElement('p');
        title.textContent = book.volumeInfo.title;
        bookDiv.appendChild(title);

        // Details Button
        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = 'Details';
        detailsBtn.onclick = () => showBookDetails(book); // Show book details when button is clicked
        bookDiv.appendChild(detailsBtn);

        selectedBooksContainer.appendChild(bookDiv);
    });
}

function showBookDetails(book) {
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'book-details';

    // Clear previous details
    if (document.querySelector('.book-details')) {
        document.querySelector('.book-details').remove();
    }

    // Cover Picture
    if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        const img = document.createElement('img');
        img.src = book.volumeInfo.imageLinks.thumbnail;
        detailsContainer.appendChild(img);
    }

    // Rating
    if (book.volumeInfo.averageRating) {
        const rating = document.createElement('p');
        rating.textContent = `Rating: ${book.volumeInfo.averageRating}`;
        detailsContainer.appendChild(rating);
    }

    // Author
    if (book.volumeInfo.authors) {
        const author = document.createElement('p');
        author.textContent = `Author: ${book.volumeInfo.authors.join(', ')}`;
        detailsContainer.appendChild(author);
    }

    // Published Year
    if (book.volumeInfo.publishedDate) {
        const publishedYear = document.createElement('p');
        publishedYear.textContent = `Published Year: ${book.volumeInfo.publishedDate.split('-')[0]}`; // Assuming the date is in format YYYY-MM-DD
        detailsContainer.appendChild(publishedYear);
    }

    // Genre
    if (book.volumeInfo.categories) {
        const genre = document.createElement('p');
        genre.textContent = `Genre: ${book.volumeInfo.categories.join(', ')}`;
        detailsContainer.appendChild(genre);
    }

    // Append the details container to the selected book's div
    document.getElementById('selectedBooks').appendChild(detailsContainer);
}
