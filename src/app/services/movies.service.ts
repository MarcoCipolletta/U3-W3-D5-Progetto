import { iMovie } from './../interfaces/i-movie';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, tap } from 'rxjs';
import { iFavourite } from '../interfaces/i-favourite';
import { iUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  moviesUrl = environment.moviesUrl;
  favouritesUrl = environment.favouritesUrl;

  user!: iUser;

  constructor(
    private authsvc: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.authsvc.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    // this.getFavourites().subscribe((favArr) => {
    //   this.favouritesArr = favArr;
    //   this.favourites$.next(this.favouritesArr);
    // });
  }

  favourites$ = new BehaviorSubject<iFavourite[]>([]);
  favouritesArr: iFavourite[] = [];

  getMovies() {
    return this.http.get<iMovie[]>(this.moviesUrl);
  }

  removeFromFavouritesHttp(id: number) {
    return this.http.delete(`${this.favouritesUrl}/${id}`);
  }

  getFavourites() {
    return this.http.get<iFavourite[]>(
      `${this.favouritesUrl}?userId=${this.user.id}`
    );
  }

  addToFavoriteHttp(movie: Partial<iFavourite>) {
    return this.http.post<iFavourite>(this.favouritesUrl, movie);
  }

  addToFavourites(movie: Partial<iFavourite>) {
    const found = this.favouritesArr.find(
      (m) => m.movie.id === movie.movie?.id && m.userId === movie.userId
    );
    if (found) {
      const index = this.favouritesArr.findIndex(
        (m) => m.movie.id === movie.movie?.id && m.userId === movie.userId
      );
      console.log(found.id);

      this.removeFromFavouritesHttp(found.id).subscribe();
      this.favouritesArr.splice(index, 1);
      this.favourites$.next(this.favouritesArr);
    } else {
      this.addToFavoriteHttp(movie).subscribe((favMovie) => {
        this.favouritesArr.push(favMovie);

        this.favourites$.next(this.favouritesArr);
      });
    }
  }
}
