export default class MovieApi {

  apiBase = `https://api.themoviedb.org/3/`;

  apiKey = `857253860db27ba39ef26a1af9ed0bf3`;

  apiPostersUrlBase = `https://image.tmdb.org/t/p/w185`;

  // constructor() {
  //   this.sessionId = '';
  //   this.createSession();
  // }


  async getResource(url, value) {
    const sendData = value
      ? {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value,
        }),
      }
      : {};

    try {
      const res = await fetch(`${this.apiBase}${url}`, sendData);
      return await res.json();
    } catch (error) {
      throw new Error(`Could not connect to API`);
    }
  }

  async searchMovie(keyword, page = 1) {
    return this.getResource(
      `search/movie?api_key=${this.apiKey}&query=${keyword}&language=en-US&page=${page}&include_adult=true`,
    );
  }

  createSession = async () => {
    const res = await this.getResource(`authentication/guest_session/new?api_key=${this.apiKey}`);
    this.sessionId = res.guest_session_id;
  };


  async getRatedMovies() {
    return this.getResource(`guest_session/${this.sessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&sort_by=created_at.desc`);
  }

  async postRateMovie(id, value) {
    return this.getResource(
      `movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.sessionId}`,
      value
    );
  }

  async getGenres() {
    return this.getResource(`genre/movie/list?api_key=${this.apiKey}`);
  }


}

