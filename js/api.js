export class Api {
  async search(q, pageNum) {
    const url = `https://openlibrary.org/search.json?q=${q}&page=1`;
    const result = await fetch(url);
    return await result.json();
  }
}