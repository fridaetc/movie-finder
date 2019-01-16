import React, { Component } from 'react';
import { get } from './api';
import Movie from './Movie';
import './Movies.css';

export default class Movies extends Component {
  state = {
    isLoading: true,
    movies: [],
    error: null,
    option: "all",
    minRatings: 0
  }

  componentDidMount() {
    this.getMovies(this.state.option);
  }

  getMovies() {
    this.setState({isLoading: true, movies: [], error: null});

    get("movies?show=" + this.state.option + "&minRatings=" + this.state.minRatings, this.props.token, (data, message) => {
      if(data) {
        this.setState({movies: data, error: null, isLoading: false});
      } else {
        this.setState({movies: [], error: message, isLoading: false});
      }
    });
  }

  selectChange(e) {
    this.setState({option: e.target.value});
  }
  inputChange(e) {
    this.setState({minRatings: e.target.value});
  }
  buttonClick(e) {
    this.getMovies();
  }

  render() {
    return (
      <div className="MoviesWrapper">
        <h1>Movies</h1>
        <div className="Button Right" onClick={(e) => this.buttonClick(e)}>Load!</div>
        <input type="number" className="Right" value={this.state.minRatings} onChange={(e) => this.inputChange(e)} disabled={this.state.isLoading} placeholder="Min ratings" />
        <select onChange={(e) => this.selectChange(e)} defaultValue={this.state.option} disabled={this.state.isLoading}>
        <option value="all">My ratings</option>
        <option value="euclidean">Euclidean</option>
        <option value="pearson">Pearson</option>
        </select>
        {this.state.error && <div className="Error">{this.state.error}</div>}
        <div className="Movies">
          {this.state.isLoading && <div className="Loading"><br/>Loading...</div>}
          { this.state.movies.map((movie, i) => (
            <Movie key={movie.movieId} movie={movie} />
          ))}
        </div>
      </div>
    );
  }
}
