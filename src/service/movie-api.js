export default class MovieApi {

  apiBase = `https://api.themoviedb.org/3/`;

  apiKey = `857253860db27ba39ef26a1af9ed0bf3`;

  apiPostersUrlBase = `https://image.tmdb.org/t/p/w185`;

  constructor () {
    this.sessionId = null
    this.createSession()
  }

  createSession = async () => {
    const res = await this.getResource(`authentication/guest_session/new?api_key=${this.apiKey}`)
    this.sessionId = res.guest_session_id
  }

  async getResource(url) {
    const res = await fetch(`${this.apiBase}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch${url}, received ${res.status}`);
    }
    return res.json();
  }

  async searchMovie(keyword, page) {
    return this.getResource(
        `search/movie?api_key=${this.apiKey}&query=${keyword}&language=en-US&page=${page}&include_adult=true`
    );
  }

  async getGenres() {
    return this.getResource(`genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }

  async postRateMovie(id, rating) {
    const requestBody = {
      "value": rating
    }

    await fetch(`${this.apiBase}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(requestBody)
        });
  }

  async getRatedMovies(){
    return this.getResource(`guest_session/${this.sessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&sort_by=created_at.desc`)
  }

}

