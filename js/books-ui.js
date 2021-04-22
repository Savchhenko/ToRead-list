export class BooksUI {
  searchResultHolder;
  bookInfoHolder;
  paginationHolder;
  readListHolder;

  currentPage = [];

  api;

  constructor(api) {
    this.searchResultHolder = document.getElementById('searchResultHolder');
    this.bookInfoHolder = document.getElementById('bookInfoHolder');
    this.paginationHolder = document.getElementById('pagination');
    this.readListHolder = document.getElementById('readListHolder');

    const searchInput = document.getElementById('searchInput'),
          searchBtn = document.getElementById('searchBtn');

    // Обработка клика по кнопке "Go!" - вывод результатов
    searchBtn.addEventListener('click', () => {
      const querry = searchInput.value;

      if(!querry) return;

      api.search(querry).then(page => {
        this.processSearchResult(page);
      });

      // Обработка клика по элементу списка - вывод информации в центральный блок
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
            <button id="centerBtn" class="center-btn">Add book to Read List</button>
          </article>
        `;
        
        this.centerBtn = document.getElementById('centerBtn');
  
        // Обработка клика по кнопке "Add book to Read List" - добавление книги с правый список
        this.centerBtn.addEventListener('click', () => {
          console.log('Klick on the center button');
        })

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