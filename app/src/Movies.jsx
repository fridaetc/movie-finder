import React, { Component } from 'react';
import { get } from './api';
import Movie from './Movie';
import './Movies.css';

export default class Movies extends Component {
  state = {
    isLoading: true,
    movies: [],
    error: null,
    option: "euclidean"
  }

  componentDidMount() {
    this.getMovies(this.state.option);
  }

  getMovies(option) {
    get("movies?show=" + option, this.props.token, (data, message) => {
      if(data) {
        this.setState({movies: data, error: null, isLoading: false});
      } else {
        this.setState({movies: [], error: message, isLoading: false});
      }
    });
  }

  selectChange(e) {
    this.setState({option: e.target.value});
    this.getMovies(e.target.value);
  }

  render() {
    return (
      <div className="MoviesWrapper">
        <h1>Movies</h1>
        <select onChange={(e) => this.selectChange(e)} defaultValue={this.state.option}>
        <option value="all">All</option>
        <option value="euclidean">Recommended (euclidean)</option>
        <option value="pearson">Recommended (pearson)</option>
        </select>
        <div className="Error">{this.state.error}</div>
        {this.state.isLoading && <div className="Loading">...</div>}
        <div className="Movies">
          { this.state.movies.map((movie, i) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }
}
