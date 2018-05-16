# Observable
What is Event Observable?

## Getting Started
```html
<input type="text" value="" title="test">
```
```js
// Grab input element
const input = document.querySelector('input');

// Create Observable
Observable.fromEvent(input, 'input')
    .map(event => event.target.value)
    .subscribe(event => console.log(event))
```
