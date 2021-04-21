export class BooksUI {
  searchResultHolder;

  currentPage = [];

  api;

  constructor(api) {
    this.searchResultHolder = document.getElementById('searchResultHolder');

    const searchInput = document.getElementById('searchInput'),
          searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', () => {
      const querry = searchInput.value;
      console.log(querry);

      if(!querry) return;

      api.search(querry).then(page => {
        this.processSearchResult(page);
      });

      this.searchResultHolder.addEventListener('click', (event) => {
        // this.searchResultHolder.querySelector('#' + event.target.id);
        const targetDiv = event.target;
        const id = event.target.id;

        const selectedBook = this.currentPage.find(item => item.id === id);
        if(!selectedBook) return;

        if(this.selectedBook) {
          const selectedBook = this.searchResultHolder.querySelector('#' + this.selectedBook.id);
          selectedBook.classList.remove('select-book');
        }

        this.selectedBook = selectedBook;
        targetDiv.classList.add('select-book'); // (?)add/toggle
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
  }

}