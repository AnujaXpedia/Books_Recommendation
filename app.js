document.getElementById('searchQuery').addEventListener('input', function(e) {
    const query = e.target.value;
    if (query.length >= 3) {
        searchBooks(query); // Initiate search with the query
    }
});

let selectedBooks = []; // Initialize an array to hold selected books

function searchBooks(query) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.items))
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous search results

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.textContent = book.volumeInfo.title;
        bookDiv.addEventListener('click', () => {
            selectBook(book);
            document.getElementById('searchQuery').value = ''; // Clear search input upon selection
        });
        resultsContainer.appendChild(bookDiv);
    });
}

function selectBook(book) {
    if (!selectedBooks.find(b => b.id === book.id)) { // Avoid duplicates
        selectedBooks.push(book); // Add book to selected list
        updateSelectedBooksDisplay(); // Refresh the display
    }
}

function updateSelectedBooksDisplay() {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear the container

    selectedBooks.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'selected-book';

        // Display book details including the cover, title, and author
        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
            bookDiv.appendChild(img);
        }

        const title = document.createElement('p');
        title.textContent = book.volumeInfo.title;
        bookDiv.appendChild(title);

        if (book.volumeInfo.authors) {
            const author = document.createElement('p');
            author.textContent = `Author: ${book.volumeInfo.authors.join(', ')}`;
            bookDiv.appendChild(author);
        }

        selectedBooksContainer.appendChild(bookDiv);
    });
}
