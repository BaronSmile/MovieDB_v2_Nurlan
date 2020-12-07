import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {Card, Space, Tag, Typography, Rate, Col} from 'antd';
import './movie.css';
import img from './no-image.jpg'

import MovieApi from '../../service/movie-api';
import formatPost from "../../utils/format-description";
import {Consumer} from '../../service/movie-api_context';

const {Title, Text} = Typography;

export default class Movie extends Component {

  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    releaseDate: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    rateNumber: PropTypes.number.isRequired,
    genreID: PropTypes.instanceOf(Array).isRequired,
    id: PropTypes.number.isRequired,
    onRate: PropTypes.func.isRequired,
    rating: PropTypes.number,
  };

  static defaultProps = {
    image: null,
    rating: 0,
  }

  movieApi = MovieApi.getInstance();

  getTagColor = (rating) => {
    let borderColor = '#E90000'
    if (rating >= 3 && rating < 5) borderColor = '#E97E00'
    else if (rating >= 5 && rating < 7) borderColor = '#E9D100'
    else if (rating >= 7) borderColor = '#66E900'
    return {borderColor}
  }

  render() {
    const {image, title, releaseDate, overview, genreID, rateNumber, id, onRate, rating = 0,} = this.props
    const posterUrl = this.movieApi.apiPostersUrlBase;
    const imgUrl = `${posterUrl}${image}`;


    const description = formatPost(overview, 150);

    return (
        <Col span={12}>
          <Card
              hoverable
              cover={image === null ?
                  (<img alt="example" className='no-img' src={img}/>)
                  : (<img alt="example" src={imgUrl}/>)
              }>
            <Space direction="vertical">
              <Title level={5}>{title}</Title>
              <span className='rate-number' style={this.getTagColor(rateNumber)}>{rateNumber}</span>
              <Text type="secondary">{releaseDate}</Text>
              <Consumer>
                {
                  (genres) => {
                    const list = genreID && genreID.map((arr) => {
                      const genre = genres && genres.find(elem => elem.id === arr).name

                      return <Tag key={arr}>{genre}</Tag>
                    })
                    return (<div key={id}>{list}</div>)
                  }
                }
              </Consumer>
              <Text>{description}</Text>
              <Rate
                  count='10'
                  defaultValue={rating}
                  onChange={onRate}
                  allowHalf
              />
            </Space>
          </Card>
        </Col>
    )
  };
}
