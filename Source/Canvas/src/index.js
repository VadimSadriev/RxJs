import { fromEvent } from 'rxjs';
import { map, pairwise, switchMap, takeUntil, withLatestFrom, startWith } from 'rxjs/operators';

const canvas = document.querySelector('canvas');
const range = document.getElementById('range');
const color = document.getElementById('color');

// canvas context
const ctx = canvas.getContext('2d');

// stores canvas width, height etc...
const rect = canvas.getBoundingClientRect();

// user device scale
const scale = window.devicePixelRatio;


canvas.width = rect.width * scale;

canvas.height = rect.height * scale;

ctx.scale(scale, scale);

const mouseMove$ = fromEvent(canvas, 'mousemove');
const mouseDown$ = fromEvent(canvas, 'mousedown');
const mouseUp$ = fromEvent(canvas, 'mouseup');
const mouseOut$ = fromEvent(canvas, 'mouseout');

function createInputStream(node) {
    return fromEvent(node, 'input')
        .pipe(
            map(e => e.target.value),
            // start stream with default value
            startWith(node.value)
        );

}

const lineWidth$ = createInputStream(range);

const strokeStyle$ = createInputStream(color);

// const lineWidth$ = fromEvent(range, 'input')
//     .pipe(
//         map(e => e.target.value),
//         // start stream with default value
//         startWith(range.value)
//     );

// const strokeStyle$ = fromEvent(color, 'input')
//     .pipe(
//         map(e => e.target.value),
//         startWith(color.value)
//     );

const stream$ = mouseDown$.pipe(
    // transforms passed streams to sertain value
    withLatestFrom(lineWidth$, strokeStyle$, (_, lineWidth, strokeStyle) => {
        return {
            lineWidth,
            strokeStyle
        }
    }),
    // switches stream to mouse move
    switchMap((options) => {
        // options are transdormed streams values from 'withLatestFrom' operator
        return mouseMove$.pipe(
            map(e => ({
                x: e.offsetX,
                y: e.offsetY,
                options
            })),
            // return prev value from stream and new value
            pairwise(),
            // current stream works untill passed stream triggered
            takeUntil(mouseUp$),
            takeUntil(mouseOut$)
        );
    }),
);

stream$.subscribe(([from, to]) => {
    const { lineWidth, strokeStyle } = from.options
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    console.log(from);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
});