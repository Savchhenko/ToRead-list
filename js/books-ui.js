export class BooksUI {
  searchResultHolder;
  bookInfoHolder;

  currentPage = [];

  api;

  constructor(api) {
    this.searchResultHolder = document.getElementById('searchResultHolder');
    this.bookInfoHolder = document.getElementById('bookInfoHolder');
    this.paginationHolder = document.getElementById('pagination');

    const searchInput = document.getElementById('searchInput'),
          searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', () => {
      const querry = searchInput.value;

      if(!querry) return;

      api.search(querry).then(page => {
        this.processSearchResult(page);
      });

      this.searchResultHolder.addEventListener('click', (event) => {
        const targetDiv = event.target;
        const id = event.target.id;

        const selectedBook = this.currentPage.find(item => item.id === id);
        if(!selectedBook) return;

        if(this.selectedBook) {
          const selectedBook = this.searchResultHolder.querySelector('#' + this.selectedBook.id);
          selectedBook.classList.remove('select-book');
        }

        this.selectedBook = selectedBook;
        targetDiv.classList.add('select-book'); 

        this.bookInfoHolder.innerHTML = `
          <article>
            <h1>${selectedBook.title}</h1>
            <div>
              <p>Languages available: ${selectedBook.language.join(', ')}</p>
              <p>Full text available: ${selectedBook.has_fulltext ? 'yes' : 'no'}</p>
              <p>First publish year: ${selectedBook.first_publish_year}</p>
              <p>Years puplished: ${selectedBook.publish_year.join(', ')}</p>
            </div>
          </article>
        `;
      })

    })
  }

  processSearchResult(page) {
    page.docs.forEach(item => {
      item.id = item.key.split('/').pop();
    });

    this.currentPage = page.docs;
    console.log(this.currentPage);
    
    const booksHTML = page.docs.reduce((acc, item) => {
      return (
        acc +
        `
          <div id="${item.id}" class="book-info">${item.title}</div>
        `
      );
    }, '');

    this.searchResultHolder.innerHTML = booksHTML;

    this.paginationHolder.innerHTML = `
      <span>Found: ${page.numFound}</span>
      <span>Start: ${page.start}</span>
      <span>Page size: 100</span>
    `;
  }

}