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

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Загружается список книг в правом блоке
    this.loadBooksList();

    const removeBtns = document.querySelectorAll('#removeBtn'); // массив из всех кнопок
  
    removeBtns.forEach(item => {
      item.addEventListener('click', () => {
        console.log("нужно удалить книгу ", item, " из списка");
        this.removeBookFromList(item);
      })
    })
    

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
          console.log('Klick on the center button');

          const dataBase = JSON.parse(localStorage.getItem('readList')) || []; // массив
          const dataBaseItem = [];

          dataBase.push([title, lang, author]);

          localStorage.setItem('readList', JSON.stringify(dataBase));

          this.createListItem([title, lang, author], dataBase.length);
          this.displayBookListStatus(dataBase.length, 0);
        })

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
    this.paginationHolder.innerHTML = `
      <span>Found: ${page.numFound}</span>
      <span>Start: ${page.start}</span>
      <span>Page size: 100</span>
    `;
  }
  
  loadBooksList() {
    const dataBase = JSON.parse(localStorage.getItem('readList')) || []; // массив
    console.log('посмотрели есть ли данные в БД', dataBase);
    if(dataBase) {
      console.log('БД не пустая, нужно отразить список книг');
      // dataBase.forEach((item) => this.createListItem(item))
      for(let i = 0; i < dataBase.length; i++) {
        this.createListItem(dataBase[i], i);
      }
    }else {
      console.log('БД пустая');
    }

    this.displayBookListStatus(dataBase.length, 0);
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

  displayBookListStatus(numBooks, numReadBooks) {
    const listTitle = document.getElementById('listTitle');
    const listStatus = document.createElement('p');
    listStatus.innerHTML = `${numBooks} books, ${numReadBooks} read`;
    listTitle.appendChild(listStatus);
  }

  removeBookFromList(item) {
    item.parentNode.parentNode.parentNode.removeChild(item.parentNode.parentNode); // удалили книгу из списка
    // this.displayBookListStatus(dataDase.length, 0);
    const dataBase = JSON.parse(localStorage.getItem('readList')); //получили значения из LS
    dataBase.splice(item.value, 1); // 1 - это количество удаляемых элементов
    localStorage.clear();
    localStorage.setItem('readList', JSON.stringify(dataBase));
  }
  
}