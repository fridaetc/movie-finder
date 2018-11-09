import React, { Component } from 'react';
import './Movie.css';

export default class Movie extends Component {
  decimalFormat(number) {
    return (Math.round(number * 10) / 10).toFixed(1);
  }

  render() {
    let {movie} = this.props;
    return (
      <div className="Movie">
        <h4 className="Name">{movie.name}</h4>
        {movie.avgRating &&
        <div className="Avg Rating">Avg Rating: {this.decimalFormat(movie.avgRating)}</div>
        }
        {movie.userRating &&
          <div className="User Rating">My Rating: {this.decimalFormat(movie.userRating)}</div>
        }
      </div>
    );
  }
}
