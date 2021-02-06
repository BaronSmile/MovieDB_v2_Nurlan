import React, { Component } from 'react';
import { debounce } from 'lodash';

import './app.css';
import 'antd/dist/antd.css';
import { Layout, Pagination, Row, Tabs, Input } from 'antd';


import MovieApi from '../../service/movie-api';
import MovieList from '../Movie-List/Movie-List';
import { Provider } from '../../service/movie-api_context';

const { Content } = Layout;
const { TabPane } = Tabs;

const movieApi = new MovieApi();

export default class App extends Component {


  ratedMovies = new Map();

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
    movieApi.getGenres().then((data) => {
      this.genresList(data.genres);
    });
    const { searchTerm, page } = this.state;
    this.updateMoviesList(searchTerm, page);
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchTerm, page, mode } = this.state;
    if (mode === 'search') {
      if (prevState.searchTerm === searchTerm && prevState.page === page && prevState.mode === mode) return;
      this.updateMoviesList(searchTerm, page);
    } else if (mode === 'rated' && prevState.mode !== mode) {
      this.updateRatedMoviesList();
    }
  }


  handleInputChange = debounce((event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }, 1000);

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


  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };


  postRateMovie = (id, rating) => {
    movieApi.postRateMovie(id, rating).then(res => console.log('postRate:',res));
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

    movieApi.searchMovie(str, page)
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
    movieApi.getRatedMovies()
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
    const { movies, loading, error, searchTerm, page, totalPages, genres,mode } = this.state;
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
              <Input placeholder='Найти фильм'
                     defaultValue={searchTerm}
                     onChange={this.handleInputChange} />
              <MovieList
                type={mode}
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
