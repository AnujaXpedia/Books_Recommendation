document.getElementById('searchQuery').addEventListener('input', function() {
    const query = this.value;
    if (query.length > 2) { // Trigger search with at least 3 characters
        searchBooks(query);
    } else {
        document.getElementById('searchResults').innerHTML = ''; // Clear results if under 3 characters
    }
});

let selectedBooks = [];

function searchBooks(query) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.innerHTML = '';
            data.items.forEach(book => {
                const div = document.createElement('div');
                div.textContent = book.volumeInfo.title;
                div.classList.add('book-item');
                div.onclick = () => addBook(book);
                resultsContainer.appendChild(div);
            });
        }).catch(error => console.error('Error:', error));
}

function addBook(book) {
    if (selectedBooks.length >= 5) {
        alert('You can select up to 5 books.');
        return;
    }

    if (selectedBooks.find(b => b.id === book.id)) {
        alert('This book is already added.');
        return;
    }

    selectedBooks.push(book);
    updateSelectedBooks();
    document.getElementById('searchQuery').value = ''; // Clear search query
    document.getElementById('searchResults').innerHTML = ''; // Clear search results
}

function updateSelectedBooks() {
    const favoriteBooksContainer = document.getElementById('favoriteBooks');
    favoriteBooksContainer.innerHTML = '';
    selectedBooks.forEach(book => {
        const div = document.createElement('div');
        div.classList.add('book-detail');
        
        if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail) {
            const img = document.createElement('img');
            img.src = book.volumeInfo.imageLinks.smallThumbnail;
            div.appendChild(img);
        }

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('book-info');

        const title = document.createElement('p');
        title.textContent = `Title: ${book.volumeInfo.title}`;
        infoDiv.appendChild(title);

        const author = document.createElement('p');
        author.textContent = `Author: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'N/A'}`;
        infoDiv.appendChild(author);

        const rating = document.createElement('p');
        rating.textContent = `Rating: ${book.volumeInfo.averageRating || 'N/A'}`;
        infoDiv.appendChild(rating);

        // Add more details as needed here

        div.appendChild(infoDiv);
        favoriteBooksContainer.appendChild(div);
    });
}
