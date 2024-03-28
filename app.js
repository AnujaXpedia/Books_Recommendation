document.getElementById('searchQuery').addEventListener('input', function(e) {
    const query = e.target.value;
    if (query.length >= 3) {
        searchBooks(query);
    }
});

let selectedBooks = [];

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

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title;
        bookDiv.addEventListener('click', () => {
            selectBook(book);
            document.getElementById('searchQuery').value = ''; // Clear the search field
            searchBooks(''); // Clear previous results
        });
        resultsContainer.appendChild(bookDiv);
    });
}

function selectBook(book) {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear previous details
    selectedBooks.push(book); // Add the new selection

    selectedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        
        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
            img.alt = 'Book cover';
            bookDiv.appendChild(img);
        }

        const details = document.createElement('div');

        const title = document.createElement('p');
        title.textContent = 'Title: ' + book.volumeInfo.title;
        details.appendChild(title);

        if (book.volumeInfo.authors) {
            const author = document.createElement('p');
            author.textContent = 'Author: ' + book.volumeInfo.authors.join(', ');
            details.appendChild(author);
        }

        if (book.volumeInfo.averageRating) {
            const rating = document.createElement('p');
            rating.textContent = 'Rating: ' + book.volumeInfo.averageRating;
            details.appendChild(rating);
        }

        bookDiv.appendChild(details);
        selectedBooksContainer.appendChild(bookDiv);
    });
}

