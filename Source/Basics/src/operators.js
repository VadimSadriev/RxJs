import { interval, fromEvent } from 'rxjs';
import { switchMap, scan, map, filter, tap, take, takeLast, takeWhile, reduce } from 'rxjs/operators';

// switch map allows switch one stream to another
fromEvent(document, 'click')
    .pipe(
        switchMap((event) => {
            return interval(1000)
                .pipe(
                    take(5),
                    reduce((acc, v) => acc + v, 0)
                );
        })
    )
    .subscribe({
        next: v => console.log(v),
        complete: v => console.log(v)
    });

// // tap - executes on each iteration
// // scan works like reduce, but reduce works with completed stream
// const stream$ = interval(1000)
//     .pipe(
//         // tap(v => console.log('taped', v)),
//         // map((v) => v * 3),
//         // filter(v => v % 2 === 0),
//         take(5),
//         // takeLast(5)
//         // takeWhile(v => v < 7)
//         // scan((acc, v) => acc + v, 0)
//         reduce((acc, v) => acc + v, 0)
//     )

// stream$.subscribe({
//     next: v => console.log(v),
//     complete: v => console.log(v)
// });