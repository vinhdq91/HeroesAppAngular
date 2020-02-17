import { Injectable } from '@angular/core';
import { lstHero } from './mock-heroes';
import { Hero } from './heroes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]> {
    // this.messageService.add('HeroesService: fetched heroes');
    // return of(lstHero);

    // -> convert to use httpClient to get data from server
    return this.httpClient.get<Hero[]>(this.heroesUrl)
                          .pipe(
                            tap(_ => this.log('fetched heroes')),
                            catchError(this.handleError<Hero[]>('getHeroes', []))
                          );
  }

  getHero(id: number): Observable<Hero> {
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(lstHero.find(hero => hero.id === id));

    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url)
                          .pipe(
                            tap(_ => this.log(`fetched heroes id=${id}`)),
                            catchError(this.handleError<Hero>(`getHero id=${id}`))
                          );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<any> {
    // const url = `${this.heroesUrl}/${hero.id}`;
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions)
                          .pipe(
                            tap(_ => this.log(`update hero id=${hero.id}`)),
                            catchError(this.handleError<any>('updateHero'))
                          );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions)
                          .pipe(
                            tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
                            catchError(this.handleError<Hero>('addHero'))
                          );
  }

  deleteHero(hero: Hero): Observable<Hero> {
    return this.httpClient.delete<Hero>(this.heroesUrl)
                          .pipe(
                            tap((deleteHero: Hero) => this.log(`deleted hero w/ id=${deleteHero.id}`)),
                            catchError(this.handleError<Hero>('deleteHero'))
                          );
  }
}
