document.getElementById('searchQuery').addEventListener('input', function(e) {
    const query = e.target.value;
    if (query.length >= 3) {
        searchBooks(query); // Trigger search when input length is at least 3
    }
});

const selectedBooks = new Set(); // Use a Set to store unique selections

function searchBooks(query) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displaySearchResults(data.items))
        .catch(error => console.error('Error fetching data:', error));
}

function displaySearchResults(books) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.onclick = () => selectBook(book);
        
        const title = document.createElement('p');
        title.textContent = book.volumeInfo.title + (selectedBooks.has(book.id) ? ' (Selected)' : '');
        bookDiv.appendChild(title);
        
        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.thumbnail;
            img.alt = 'Book cover';
            bookDiv.appendChild(img);
        }

        resultsContainer.appendChild(bookDiv);
    });
}

function selectBook(book) {
    if (selectedBooks.size >= 5) {
        alert('You can select up to 5 books.');
        return;
    }

    if (!selectedBooks.has(book.id)) {
        selectedBooks.add(book.id);
        updateSelectedBooksDisplay();
    }
}

function updateSelectedBooksDisplay() {
    const selectedBooksContainer = document.getElementById('selectedBooks');
    selectedBooksContainer.innerHTML = ''; // Clear previous display

    selectedBooks.forEach(bookId => {
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
            .then(response => response.json())
            .then(book => {
                const bookDiv = document.createElement('div');
                
                const title = document.createElement('p');
                title.textContent = book.volumeInfo.title;
                bookDiv.appendChild(title);
                
                if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                    const img = document.createElement('img');
                    img.src = book.volumeInfo.imageLinks.thumbnail;
                    img.alt = 'Book cover';
                    bookDiv.appendChild(img);
                }
                
                selectedBooksContainer.appendChild(bookDiv);
            })
            .catch(error => console.error('Error fetching detailed book data:', error));
    });
}

document.getElementById('displayInfo').addEventListener('click', () => {
    // This button's click handler is already implicitly implemented
    // by the updateSelectedBooksDisplay function. If you need to
    // perform additional actions on this event, you can add them here.
});

