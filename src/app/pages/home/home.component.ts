import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { iMovie } from '../../interfaces/i-movie';
import { MoviesService } from '../../services/movies.service';
import { retry } from 'rxjs';
import { iUser } from '../../interfaces/i-user';
import { iFavourite } from '../../interfaces/i-favourite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  name!: string;

  user!: iUser;
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private moviesSvc: MoviesService
  ) {
    this.authSvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.name = user.name;
      }
    });
  }

  movies: iMovie[] = [];

  ngOnInit() {
    this.moviesSvc.getMovies().subscribe((movies) => {
      this.movies = movies;
      console.log(this.movies);
    });
    this.moviesSvc.getFavourites().subscribe((favArr) => {
      this.moviesSvc.favouritesArr = favArr;
      this.moviesSvc.favourites$.next(this.moviesSvc.favouritesArr);
    });
  }

  addFav(movie: iMovie) {
    const movToFav: Partial<iFavourite> = {
      movie: movie,
      userId: this.user.id,
    };
    this.moviesSvc.addToFavourites(movToFav);
  }

  isFavourite(movie: iMovie) {
    const favouriteMovies = this.moviesSvc.favouritesArr.filter(
      (mov) => mov.userId === this.user.id
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
