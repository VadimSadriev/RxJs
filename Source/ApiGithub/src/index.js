import { fromEvent, EMPTY } from "rxjs";
import {
    map,
    debounceTime,
    distinctUntilChanged,
    switchMap,
    mergeMap,
    tap,
    catchError,
    filter
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const url = 'https://api.github.com/search/users?q=';

const search = document.getElementById('search');
const result = document.getElementById('result');

// create stream
const stream$ = fromEvent(search, 'input')
    .pipe(
        // get value from input
        map(e => e.target.value),
        // freeze for one second
        debounceTime(1000),
        // dont trigger with same changes
        distinctUntilChanged(),
        // clear cards
        tap(() => {
            result.innerHTML = ''
        }),
        // dont trigger github with empty input
        filter(v => v.trim()),
        // make query to github
        switchMap(v => ajax.getJSON(url + v).pipe(
            catchError(err => EMPTY)
        )),
        // get only items
        map(resp => resp.items),
        // trigger subscribe on each item
        mergeMap(items => items)
    );

stream$.subscribe(user => {
    console.log(user);

    const html = `
    <div class="card">
    <div class="card-image">
      <img src="${user.avatar_url}" />
      <span class="card-title">${user.login}</span>
    </div>
    <div class="card-action">
      <a href="${user.html_url}" target="_blank">Открыть Github</a>
    </div>
  </div>
    `;

    result.insertAdjacentHTML('beforeend', html);
});