import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'

import {DebounceInput} from 'react-debounce-input';
import './search-input.css';


export default class SearchInput extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  render() {
    const {onChange, value, onKeyPress} = this.props

    return (
        <DebounceInput
            className='search-input'
            placeholder="Type to search..."
            debounceTimeout={2000}
            onChange={onChange}
            onKeyPress={onKeyPress}
            value={value}
        />
    )
  }
}

