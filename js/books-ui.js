export class BooksUI {
  searchResultHolder;
  bookInfoHolder;
  paginationPoints;
  readListHolder;
  pageIndex;

  currentPage = [];

  api;

  constructor(api) {
    this.searchResultHolder = document.getElementById('searchResultHolder');
    this.bookInfoHolder = document.getElementById('bookInfoHolder');
    this.paginationPoints = document.getElementById('paginationPoints');
    this.readListHolder = document.getElementById('readListHolder');

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Загружается список книг в правом блоке
    this.loadBooksList();

    // Обработка нажатия Enter в инпуте - вывод результатов запроса
    searchInput.addEventListener('keydown', (event) => {
      if(event.code == 'Enter') {
          const querry = searchInput.value;
          if(!querry) return;
          api.search(querry).then(page => {
            this.processSearchResult(page);
          });
      } 
    })
    
    // Обработка клика по кнопке "Go!" - вывод результатов запроса
    searchBtn.addEventListener('click', () => {
      this.pageIndex = 1;
      const querry = searchInput.value;
      if(!querry) return;
      api.search(querry, this.pageIndex).then(page => {
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

        const title = selectedBook.title;
        const lang = selectedBook.language;
        const author = selectedBook.author_name;

        this.bookInfoHolder.innerHTML = `
          <article>
            <h1>${title}</h1>
            <div>
              <p>Author: ${author ? author : 'unknown'}</p>
              <p>Languages available: ${lang.join(', ')}</p>
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
          const dataBase = JSON.parse(localStorage.getItem('readList')) || []; // массив
          dataBase.push([title, lang, author]);
          localStorage.setItem('readList', JSON.stringify(dataBase));

          this.createListItem([title, lang, author], dataBase.length);
          this.updateBookListStatus(dataBase.length, 0);
        })
      })
    })

    // Обработка клика по кнопке Remove from list
    this.readListHolder.addEventListener('click', (event) => {
      if(event.target.tagName === 'BUTTON') {
        this.removeBookFromList(event.target);
      }
    })

    nextBtn.addEventListener('click', () => {
      this.pageIndex++;
      console.log(this.pageIndex);
      api.search(searchInput.value, this.pageIndex).then(page => {
        this.processSearchResult(page);
    })
  })
  
  }

  processSearchResult(page) {
    page.docs.forEach(item => {
      item.id = item.key.split('/').pop();
    });
    this.currentPage = page.docs;
    const booksHTML = page.docs.reduce((acc, item) => {
      return (
        acc +
        `
          <div id="${item.id}" class="book-info">${item.title}</div>
        `
      );
    }, '');
    this.searchResultHolder.innerHTML = booksHTML;
    this.paginationPoints.innerHTML = `
      <span>Found: ${page.numFound}</span>
      <span>Start: ${page.start}</span>
      <span>Page size: 100</span>
    `;
  }
  
  loadBooksList() {
    const dataBase = JSON.parse(localStorage.getItem('readList')) || []; // массив
    if(dataBase) {
      // dataBase.forEach((item) => this.createListItem(item))
      for(let i = 0; i < dataBase.length; i++) {
        this.createListItem(dataBase[i], i);
      }
    }else {
      console.log('БД пустая');
    }

    // Создаёт статус Read List'а
    const listTitle = document.getElementById('listTitle');
    const listStatus = document.createElement('p');
    listStatus.innerHTML = `<span id="numBooks"></span> books, <span id="numReadBooks"></span> read`;
    listTitle.appendChild(listStatus);

    this.updateBookListStatus(dataBase.length, 0);
  }

  createListItem(item, id) {
    const readListItem = document.createElement('div');
    readListItem.classList.add('read-list__item');

    const readListItemInnerHTML = `
      <span>${item[0]} (${item[1]})</span>
      <span>${item[2]}</span>
      <div class="read-list__management-links">
        <button id="markAsReadBtn">Mark as read</button>
        <button id="removeBtn" value="${id}">Remove from list</button>
      </div>
    `;

    readListItem.innerHTML = readListItemInnerHTML;
    this.readListHolder.appendChild(readListItem);
  }

  updateBookListStatus(numBooks, numReadBooks) {
    const numBooksElem = document.getElementById('numBooks');
    const numReadBooksElem = document.getElementById('numReadBooks');
    numBooksElem.innerHTML = numBooks;
    numReadBooksElem.innerHTML = numReadBooks;
  }

  removeBookFromList(item) {
    item.parentNode.parentNode.parentNode.removeChild(item.parentNode.parentNode); // удалили книгу из списка (из DOM)
    const dataBase = JSON.parse(localStorage.getItem('readList')); 
    dataBase.splice(item.value, 1); 
    localStorage.clear();
    localStorage.setItem('readList', JSON.stringify(dataBase));
    this.updateBookListStatus(dataBase.length, 0);
  }
  
}