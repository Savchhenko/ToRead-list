export class BooksUI {
  searchResultHolder;

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
    })
  }

  processSearchResult(page) {
    page.docs.forEach(item => {
      item.id = item.key.split('/').pop();
    });
    
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