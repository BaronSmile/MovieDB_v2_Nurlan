import React, { Component } from 'react';

import './app.css';
import 'antd/dist/antd.css';
import { Layout, Pagination, Row, Tabs } from 'antd';


import SearchInput from '../search-input/search-input';
import MovieApi from '../../service/movie-api';
import MovieList from '../movie-list/movie-list';
import { Provider } from '../../service/movie-api_context';

const { Content } = Layout;
const { TabPane } = Tabs;


export default class App extends Component {

  movieApi = MovieApi.getInstance();

  ratedMovies = new Map();

  constructor(props) {
    super(props);
    this.movieApi.getGenres().then((data) => {
      this.genresList(data.genres);
    });
  }

  state = {
    totalPages: null,
    page: 1,
    movies: [],
    searchTerm: 'return',
    loading: true,
    error: false,
    mode: 'search',
    genres: [],
  };


  componentDidMount() {
    const { searchTerm, page } = this.state;
    this.updateMoviesList(searchTerm, page);

  }

  componentDidUpdate(prevProps, prevState) {
    const { searchTerm, page, mode } = this.state;
    if (mode === 'search') {
      if ((prevState.searchTerm === searchTerm)
        && (prevState.page === page)
        && (prevState.mode === mode)) return;
      this.updateMoviesList(searchTerm, page);
    } else if (mode === 'rated' && prevState.mode !== mode) {
      this.updateRatedMoviesList();
    }
  }

  genresList = (data) => {
    this.setState({
        genres: data,
      },
    );
  };

  changePage = (page) => {
    this.setState({
      page,
    });
  };


  updateSearchStr = (searchTerm) => {
    if (searchTerm === '') return;
    this.setState({
      searchTerm,
      page: 1,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };


  handleInputChange = (({ target: { value } }) => {
    this.setState({
      searchTerm: value,
    });
  });


  getSearch = ({ key }) => {
    if (key === 'Enter') {
      const { searchTerm } = this.state;
      this.movieApi.searchMovie(searchTerm)
        .then(movies => {
          this.setMovie([...movies.results], movies.total_results);
        });
    }
  };

  setMovie = (movies) => {
    this.setState({
      movies,
      loading: false,
    });
  };

  postRateMovie = (id, rating) => {
    this.movieApi.postRateMovie(id, rating);
    this.ratedMovies.set(id, rating);
  };

  toggleMenu = (key) => {
    this.setState({
      mode: key,
    });
  };

  updateMoviesList(str, page) {
    this.setState({
      loading: true,
    });

    this.movieApi.searchMovie(str, page)
      .then(res => {
        this.setState({
          movies: res.results,
          totalPages: res.total_pages,
          page,
          loading: false,
          error: false,
        });
      })
      .catch(() => this.onError());
  }

  updateRatedMoviesList() {
    this.setState({
      loading: true,
    });
    this.movieApi.getRatedMovies()
      .then(res => {
        this.setState({
          movies: res.results,
          totalPages: res.total_pages,
          loading: false,
          error: false,
        });
      })
      .catch(() => this.onError());
  }


  render() {
    const { movies, loading, error, searchTerm, page, totalPages, genres } = this.state;
    const hasData = !(loading || error);


    const pagination = hasData ?
      <Pagination
        current={page}
        defaultPageSize={1}
        showSizeChanger={false}
        hideOnSinglePage
        onChange={(value) => this.changePage(value)}
        total={totalPages}
      /> : null;


    return (

      <Provider value={genres}>

        <Tabs onChange={(event) => this.toggleMenu(event)}>
          <TabPane tab='search' key='search'>
            <Content className='site-layout'>
              <SearchInput
                onKeyPress={this.getSearch}
                onChange={this.handleInputChange}
                value={searchTerm} />
              <MovieList
                movies={movies}
                ratedMovies={this.ratedMovies}
                loading={loading}
                error={error}
                onRate={this.postRateMovie}
              />
              <Row className='pagination' justify='center'>
                {pagination}
              </Row>
            </Content>
          </TabPane>
          <TabPane tab='rated' key='rated'>
            <MovieList
              movies={movies}
              loading={loading}
              error={error}
              onRate={this.postRateMovie}
            />
          </TabPane>
        </Tabs>


      </Provider>
    );
  }
}
