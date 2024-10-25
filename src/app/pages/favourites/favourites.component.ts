import { MoviesService } from './../../services/movies.service';
import { Component } from '@angular/core';
import { iFavourite } from '../../interfaces/i-favourite';
import { iMovie } from '../../interfaces/i-movie';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss',
})
export class FavouritesComponent {
  favMovies: iFavourite[] = [];

  constructor(private moviesSvc: MoviesService) {}

  ngOnInit() {
    this.moviesSvc.getFavourites().subscribe((favArr) => {
      this.favMovies = favArr;
      this.moviesSvc.favouritesArr = favArr;
      this.moviesSvc.favourites$.next(this.moviesSvc.favouritesArr);
    });
  }

  addFav(movie: iMovie) {
    const movToFav: Partial<iFavourite> = {
      movie: movie,
      userId: this.moviesSvc.user.id,
    };
    this.moviesSvc.addToFavourites(movToFav);
  }

  isFavourite(movie: iMovie) {
    const favouriteMovies = this.moviesSvc.favouritesArr.filter(
      (mov) => mov.userId === this.moviesSvc.user.id
    );
    if (!favouriteMovies) return false;
    const found = favouriteMovies.find((mov) => mov.movie.id === movie.id);
    if (found) {
      return true;
    } else {
      return false;
    }
  }
}
