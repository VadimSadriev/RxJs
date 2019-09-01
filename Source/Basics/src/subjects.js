import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';


// subject doesnt save values passed to 'next' function
// document.addEventListener('click', () => {

//     const stream$ = new Subject();

//     stream$.subscribe(v => {
//         console.log(v);
//     });

//     stream$.next();

// });

// BehaviorSubject saves only last value before subscribe and allows 
// set initial value
// document.addEventListener('click', () => {

//     const stream$ = new BehaviorSubject('First');

//     stream$.subscribe(v => {
//         console.log(v);
//     });

//     stream$.next();

// });

// replay subject saves all values before subscribe passed 
// to 'next' function. also allows set size of dispatched values in constructor
document.addEventListener('click', () => {

    // const stream$ = new ReplaySubject(1);

    const stream$ = new ReplaySubject();

    stream$.next('hello');
    stream$.next('there');

    stream$.subscribe(v => {
        console.log(v);
    });

   

});