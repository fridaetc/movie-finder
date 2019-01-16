import React, { Component } from 'react';
import './Movie.css';

export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avgRating: props.movie.avgRating,
      userRating: props.movie.userRating
     };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.movie.userRating !== nextState.userRating && this.state.userRating === nextState.userRating) {
      this.setState({avgRating: nextProps.movie.avgRating, userRating: nextProps.movie.userRating});
    }
    return true;
  }

  changeRating(newRating) {
    alert("Not saved to db: " + newRating);
    this.setState({
      userRating: newRating
    });
  }

  render() {
    let {movie} = this.props, {avgRating, userRating} = this.state;
    let stars = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
    let rating = avgRating;

    if(userRating !== undefined) {
      rating = userRating;
    }

    let roundedRating = rating ? Math.round(rating * 2) / 2 : 0;

    let title = movie.title;
    if(title.charAt(0) === '"' && title.charAt(title.length -1 ) === '"'){
      title = title.substr(1, title.length - 2);
    }

    return (
      <div className="Movie">
        <h4 className="Name">{title}</h4>
        {movie.noOfRatings && <h5>No of ratings: {movie.noOfRatings}</h5>}
        {movie.score && <h5>Score: {movie.score}</h5>}
        {rating !== undefined &&
          <div className={"rating-group" + (userRating !== undefined ? " user" : " avg")}>
            {stars.map((star, i) => (
              [
                <label key={"label" + movie.movieId + i} aria-label={star + " stars"} className={"rating__label rating__label" + (i%2 === 0 ? "--half" : "")} htmlFor={"rating-" + movie.movieId + "-" + star.toString().replace(".", "")}>
                  <i className={"rating__icon rating__icon--star fa fa-star" + (i%2 === 0 ? "-half" : "")}></i>
                </label>,
                <input key={"input" + movie.movieId + i} className="rating__input" name={"rating-" + movie.movieId} id={"rating-" + movie.movieId + "-" + star.toString().replace(".", "")} value={star} type="radio" defaultChecked={roundedRating === star} onClick={(e) => {this.changeRating(e.target.value)}}/>
              ]
            ))}
          </div>
        }
      </div>
    );
  }
}
