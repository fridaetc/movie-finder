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

    let roundedRating = Math.round(rating * 2) / 2;

    return (
      <div className="Movie">
        <h4 className="Name">{movie.name}</h4>
        <div className={"rating-group" + (userRating !== undefined ? " user" : " avg")}>
          {stars.map((star, i) => (
            [
            <label key={"label" + movie.id + i} aria-label={star + " stars"} className={"rating__label rating__label" + (i%2 === 0 ? "--half" : "")} htmlFor={"rating-" + movie.id + "-" + star.toString().replace(".", "")}>
            <i className={"rating__icon rating__icon--star fa fa-star" + (i%2 === 0 ? "-half" : "")}></i>
            </label>,
            <input key={"input" + movie.id + i} className="rating__input" name={"rating-" + movie.id} id={"rating-" + movie.id + "-" + star.toString().replace(".", "")} value={star} type="radio" defaultChecked={roundedRating === star} onClick={(e) => {this.changeRating(e.target.value)}}/>
            ]
          ))}
        </div>
      </div>
    );
  }
}
