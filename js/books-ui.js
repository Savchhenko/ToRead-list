export class BooksUI {
  api;

  constructor(api) {
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
    console.log(page.docs);
  };
}