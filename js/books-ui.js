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
        console.log(page);
      });
    })
  }

  init() {

  };
}