import React, { Component } from 'react';
import Header from "./components/header/Header.jsx";
import Movies from "./components/movies/Movies.jsx";
import Pagination from "./components/Pagination/Pagination.jsx";
import Favourite from "./components/Favourite/Favourite.jsx";
import MoviePage from "./components/MoviePage/MoviePage.jsx";
import { API_KEY, API_URL } from './API/sercret.js';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  state = {
    moviesData: [],
    currentMovie: "avengers",
    pages: [],
    currPage: 1,
    favMovies: [],
  };

  async componentDidMount() {
    this.setMovies(this.state.currentMovie);
  }

  setMovies = async (newMovieName) => {
    let data = await axios.get(API_URL + "/search/movie", {
      params: { api_key: API_KEY, page: 1, query: newMovieName },
    });
    let moviesData = data.data.results.slice(0, 10);
    let pagesCount = data.data.total_pages; //3
    let pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }
    this.setState({
      moviesData: moviesData,
      currentMovie: newMovieName,
      pages: pages,
    });
  };

  setFavouriteMovie = (movie) => {
    let updatedFavMovies = this.state.favMovies;
    updatedFavMovies.push(movie);
    this.setState({
      favMovies: updatedFavMovies,
    });
  }

  removeFavouriteMovie = (movie) => {
    let updatedFavMovies = this.state.favMovies.filter(movie_itr => movie.id != movie_itr.id);

    this.setState({
      favMovies: updatedFavMovies,
    });
  }

  nextPage = async () => {
    this.setPage(this.state.currPage + 1);
  };

  setPage = async (pageCount) => {
    let data = await axios.get(API_URL + "/search/movie", {
      params: {
        api_key: API_KEY,
        page: pageCount,
        query: this.state.currentMovie,
      },
    });
    console.log(data);
    let moviesData = data.data.results.slice(0, 10);
    this.setState({
      moviesData: moviesData,
      currPage: pageCount,
    });
  };

  previousPage = async () => {
    this.setPage(this.state.currPage - 1);
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header setMovies={this.setMovies} favMovies={this.state.favMovies} removeFavouriteMovie={this.removeFavouriteMovie} />

          <Switch>
            <Route path="/Movies-App/" exact>
              {this.state.moviesData.length ?
                <Movies moviesData={this.state.moviesData} setFavouriteMovie={this.setFavouriteMovie} /> :
                <h1>No movies found</h1>}
              <Pagination
                pages={this.state.pages}
                currPage={this.state.currPage}
                nextPage={this.nextPage}
                previousPage={this.previousPage}
                setPage={this.setPage} />
            </Route>

            <Route path="/Movies-App/fav" exact component={Favourite} />
            <Route path="/Movies-App/moviepage" exact component={MoviePage} />

          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;