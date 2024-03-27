document.getElementById('searchBtn').addEventListener('click', function() {
    const query = document.getElementById('searchQuery').value;
    if (query.length >= 3) {
        searchBooks(query);
    }
});

const selectedBooks = [];

function searchBooks(query) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.items);
        })
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    books.forEach((book, index) => {
        const bookDiv = document.createElement('div');
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = 'book' + index;
        checkBox.dataset.bookId = book.id; // Store book ID in dataset for later retrieval
        bookDiv.appendChild(checkBox);

        const label = document.createElement('label');
        label.htmlFor = 'book' + index;
        label.textContent = book.volumeInfo.title;
        bookDiv.appendChild(label);

        resultsContainer.appendChild(bookDiv);
    });
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear previous display
    
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const bookId = checkbox.dataset.bookId;
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
            .then(response => response.json())
            .then(book => {
                const bookDiv = document.createElement('div');
                const title = document.createElement('p');
                title.textContent = 'Title: ' + book.volumeInfo.title;
                bookDiv.appendChild(title);

                const author = document.createElement('p');
                author.textContent = 'Author: ' + book.volumeInfo.authors.join(', ');
                bookDiv.appendChild(author);

                const rating = document.createElement('p');
                rating.textContent = 'Rating: ' + book.volumeInfo.averageRating;
                bookDiv.appendChild(rating);

                if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                    const img = document.createElement('img');
                    img.src = book.volumeInfo.imageLinks.thumbnail;
                    img.alt = 'Book cover';
                    bookDiv.appendChild(img);
                }

                selectedBooksContainer.appendChild(bookDiv);
            })
            .catch(error => console.error('Error fetching book details:', error));
    });
});

