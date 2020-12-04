import React, {Component} from 'react';
import PropTypes from 'prop-types'

import './movie-list.css';
import {Row, Spin, Alert, Typography} from 'antd';
import Movie from '../movie/movie';

const {Title} = Typography
// eslint-disable-next-line react/prefer-stateless-function
export default class MovieList extends Component {

  static propTypes = {
    movies: PropTypes.instanceOf(Array).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    onRate: PropTypes.func.isRequired,
  }

  render() {
    const {movies, error, loading, onRate} = this.props

    const hasData = !(loading || error);

    if (loading) {
      return (
          <div className="example">
            <Spin size="large"/>
          </div>
      )
    }

    const errorMessage = error ? <Alert message="Informational Notes" type="info" showIcon/> : null;

    let moviesList =
        movies.map(({
                      id,
                      poster_path: posterPath,
                      title,
                      release_date: releaseDate,
                      overview,
                      vote_average: voteAverage,
                      genre_ids: genreIDs
                    }) => {
          return (
              <Movie
                  key={id}
                  image={posterPath}
                  title={title}
                  releaseDate={releaseDate}
                  onRate={(value) => onRate(id, value)}
                  overview={overview}
                  rateNumber={voteAverage}
                  genreID={genreIDs}
                  id={id}
              />
          );
        })

    if (!movies.length) {
      moviesList = <Title className='not-found-message' level={1}>No results found</Title>
    }

    return (
        <div className="site-card-wrapper">
          <Row>
            {errorMessage}
            {hasData ? moviesList : null}
          </Row>
        </div>
    );
  }
};