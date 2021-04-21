class Api {
  async search(q, pageNum) {
    const q = 'https://openlibrary.org/search.json?q=${q}&page=1';
    const result = await fetch(q);
    return await result.json();
  }
}