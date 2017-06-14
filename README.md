<!-- TO DO LIST:
1) Finish setting up the starting branch
3) Finish final product screen shot
4) Work through README once to proof
4.5) Flesh out/Make Slide Deck as you go
5) Work through README once timed
6) Clean up/Follow up
7) Make sure the final CSS file gets moved into START

CLEAN UP COMMENTS ON ALL BRANCHES
Grab a back up API in case NASA API keys are an issue
-->

<!-- SLIDES
  - Architecture of a Redux app
  - Role of Middleware
  - Finished product/What we are building
  - How the snippets file works -->

<!-- FOLLOW UP:
  - Where does the `sagas.js` library live?
  - Dig more into "elm architecture"  
  - talk about using `import { delay } from redux-saga`
  - Dig into helper libraries for mocking out sagas in testing
-->


## Setup

We'll be starting from a boilerplate that already has the structure of a Redux app built out so we can dig straight into the meat of this workshop. I'll be using `npm` commands for my live-coding, but if `yarn` is your jam that's cool too.

Clone down this repository, run `npm install`, and `npm start` to see what we've got going on.  

While we get started, please take a minute to visit the [Nasa Open API](https://api.nasa.gov/index.html#apply-for-an-api-key)  website and apply for an API key - this should be sent to your email address momentarily.  

Let's start by setting up our application to load a background image when the app fires up.  

```js
// index.js

import { getBackgroundImage } from './actions'; // <-- NEW CODE

// ---- some code --- //

const store = createStore(rootReducer);
store.dispatch(getBackgroundImage()); // <-- NEW CODE

// --- additional existing code below --- //
```

This means we need an action called `getBackgroundImage()` to exist and to go get the image we want.

```js
// actions/index.js  

export const getBackgroundImage = () => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR-API-KEY-HERE')
    .then(response =>  response.json())
    .then(json => console.log(json));
};
```

You'll notice when your app refreshes, we see this helpful error message:

![action-error](./assets/action-error.png);

There are two main rules about actions in a flux based framework:

1. Actions must be **plain objects**
2. Actions must have a **type**

Right now in our code we have what is called an 'asynchronous action'.

When we say "asynchronous action", we're referring to events that are triggered outside of the applications control. Your code is no longer explicitly directing WHEN to fire something or WHEN it gets information back, outside of the primary flow of the program.

Redux is designed to fire off synchronous actions - events that are fired off and controlled by the user. Meaning that the moment an action is dispatched, state is immediately updated and the application can adjust accordingly. Making an API call is an action that requires additional stages to complete, is primarily out of the user's control, and in needs to be handled differently.

From [the docs](http://redux.js.org/docs/advanced/AsyncActions.html#actions), the three main stages we need to handle are:  

1. When the request was initiated
  - We should tell our reducers that the request has started. This lets us implement a "spinner" or "loading" feature.

2. When the request finished
  - We need to update our reducer when the request is complete, and this period of time is out of our control.
  - We can then stop the spinner and display the data received

3. If something goes wrong
  - Occasionally you will want to display error messages to the user, in which case our reducers need to be told how to handle any unsuccessful requests and what to tell the user.


```js
const requestImage = () => ({
  type: 'REQUEST_IMAGE',
});

const setBackgroundImage = (image) => ({
  type: 'SET_BACKGROUND',
  image,
});

const catchError = (error) => ({
  type: 'ERROR',
  error,
});

export const getBackgroundImage = () => {
  return dispatch => {
    dispatch(requestImage());
    fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR-API-KEY-HERE')
    .then(response =>  response.json())
    .then(json => dispatch(setBackgroundImage(json)))
    .catch(error => dispatch(catchError(error)));
  };
};
```

You'll notice our error message is still there. Now's the time to add in a middleware library to step in and figure out what to do with this function we are dispatching. To kick things off, we'll start with a common library called `redux-thunk`.  

## Adding Middleware  

```bash
npm i -S redux-thunk
```

As a sidenote, a `thunk` in this context is a kind of "sidejob doer" - something that comes in to execute a subroutine outside of the flow of expected function execution.  

The next step is to tell our redux store to include this middleware when it is created.  

```js
// src/index.js  

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

// ---- additional dependencies ---- //

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
```

(If you're lost, your index.js file should look like Snippet #5).  

Voila! No more error messages. Let's wire up the rest of redux to set the background image to our application.

```bash
touch containers/BackgroundImage.js
```

```js
// containers/background-image.js
import { connect } from 'react-redux';

const mapStateToProps = ({ backgroundImage }) => ({
  backgroundImage,
});

export default connect(mapStateToProps, null);
```

And finally, adjust how we are rendering our App component now that we need access to some state and grab our image from the store.  

```js
// components/App/index.js

import React, { Component } from 'react';
import BackgroundImage from '../../containers/background-image';
import './styles.css';

class App extends Component {

  render() {
    const { image } = this.props.backgroundImage
    const style = {
      'backgroundImage': `url(${image})`,
      'backgroundSize': 'cover',
      'height': '100vh',
    };

    return (
      <div style={ style } className="App">
        <h1>Redux Saga Workshop</h1>
      </div>
    );
  }
}

export default BackgroundImage(App);
```

## On To Sagas

What I want to focus on for the rest of this talk is a new(ish) library for handling this "what do I do with all of my side jobs" issue that React/Redux apps (among others) deal with on a daily basis.  

[Redux-Saga](https://github.com/redux-saga/redux-saga) allows you to organize all of the side effects that need to happen in your app in a single, completely separate thread. It can be accessed by both your main application and connect with the redux store/dispatch actions, etc.  

The cool part about this library is that it implements ES6 Generator functions to write super readable, testable, "OMG WHERE HAS THIS BEEN" lines of code.  

Let's look back at a function we wrote using redux-thunk:  

```js
export const getBackgroundImage = () => {
  return dispatch => {
    dispatch(requestImage());
    fetch('https://api.nasa.gov/planetary/apod?api_key=EFZIxlP9Ry5aV1KIjYZilvSLqziN5RBOJicPD8W9')
    .then(response =>  response.json())
    .then(json => dispatch(setBackgroundImage(json.hdurl)))
    .catch(error => dispatch(catchError(error)));
  };
};
```  

In this function we are charged with a list of different things:  
1. Flag redux that we have started our request (in case we need a loader etc)  
2. Send out the request
3. Grab the response back and JSONify it
4. Dispatch an action to set the background image
5. Figure out what to do if shit breaks  

How would we feel about testing this chunk of code? I'm personally not that jazzed. Let's have a refactor party to swap out `redux-thunk` with `redux-saga` and rewire how our app is handling this async functionality.  

## Saga Setup

`npm install -S redux-saga`  

Next, let's create a file where all of our "sagas" will be kept.  

`touch src/sagas.js`  

In this file will be all of the side-effects that we expect our application to fire off. Before we start implementing this new code, let's take a moment to refactor our `index.js` file to tell our store to grab the `redux-saga` library when it's first created, insted of `redux-thunk`.

```js
// index.js

// The lines below are the new lines of code you need to add to your file. Comment out/remove any reference to `redux-thunk`  

// Grab the "start up kit" we need from the library (comment out the line where you import redux-thunk)
import createSagaMiddleware from 'redux-saga';

// Import our sagas
import sagas from './sagas';

// Create the middleware
const sagaMiddleware = createSagaMiddleware();

// Replace 'thunk' with 'sagaMiddleware' when we call applyMiddleware()
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
);

// Run the saga(s)
sagaMiddleware.run(sagas);

// The rest of your code stays the same for now
```

If you take a look at your browser now, you'll see we get a (relatively) helpful error message:  

![missing generator error]('./missing-generator-error.png')  

This makes sense. Sagas work by firing off a series of `yield expressions` within each generator function, and each expression is in charge of running one piece of the side-effect puzzle. We currently have nothing in our `sagas.js` file so it's telling us it needs a job to do. Let's throw in a simple generator function to get started.

```js
// sagas.js

export default function* testSaga() {
  console.log('Wired up!');
}

```

We've got a lot going on in the console (like our middleware error, again, which makes sense), but we also should see our `console.log()` statement. Baby steps!  

Before we get further into Sagas, let's sidetrack a little bit into what a Generator is.  

## ES6 Generators  

Sagas are written using the new, hip, generator function that is baked into ES6. It looks like this:  

```js
function* doSomething() {
  yield 'hello world'
  yield 'something else'
}
```

There are a few things to note here. First, generator functions are indicated with an asterisk. The asterisk can be next to either the keyword `function*` or the function name `*doSomething` and the function will still be recognized as a generator.

Second, the content within the function starts with a `yield expression`. This is what tells the generator to pause.

Once the generator function is called, it will only execute the code up until it encounters the keyword `yield`. This tells the generator function to return whatever is to the right of the yield, and then chill until told to continue.

After executing the code to the right of the first yield, it won't just fire at will, it will wait to continue until you tell it to, which is done using a `Generator Iterator`.

Grab that function mentioned above and throw it in a repl. What happens if you run `doSomething()`? Hopefully, nothing happens (if you're in the browser console you might see an output about `Generator status suspended`, but nothing actually gets executed). This is because this ISN'T a normal function and it can't be executed like a normal function.  

In order to properly execute this function we need to *iterate* over the *generator*, by constructing a *generator iterator*. Developers are the BEST at naming things. This is initially done by creating a variable that you can call methods on.

```js
function* doSomething() {
  yield 'hello world'
  yield 'something else'
}

var gen = doSomething();
```

Then, to tell the generator iterator to DO something you need to run the method `.next()`.  Before you run the next code snippet, take a guess as to what you expect to see.  

```js
function* doSomething() {
  yield 'hello world'
  yield 'something else'
}

var gen = doSomething();

gen.next();
```

The answer is super interesting! You might expect the return value to be 'hello world'. In fact, the Generator returns a Generator Object.

You should see something print like:

```js
Object {value: 'hello world', done: false}
```

Instead of simply the string 'hello world', we get an object with the *value* of our iteration ('hello world'), and a *done* boolean indicating if our function has finished executing (false). And now it waits.  

Continue to run a couple more `gen.next()` functions and see what happens - when does our `done` boolean return `true`?  

Ok. Let's dig deeper. Copy/Paste the following lines of code into your terminal/repl:

```js
function *numbers() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

var gen = numbers();
```

As developers, our main goal in life is to do as little as possible to get the job done (but in a really hip, clean, maybe-a-little-bit-but-not-overly-unreadable way - especially if you're jamming on ES6). Having to run `gen.next()` 5 times to execute 5 lines of code seems like a ridiculous thing to do.  

Luckily, being ES6 developers, we can leverage the [for of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop to iterate over this interesting type of structure.  

```js
for(let num of gen){
	console.log(num)
}
```

Let's do something that will more accurately resemble the Saga(s) we are about to write:

```js
function *numbers() {
  yield 1
  yield 2
  yield* moreNums()
  yield 6
  yield 7
}

function *moreNums() {
  yield 3
  yield 4
  yield 5
}

var gen = numbers()

gen.next()
gen.next()
gen.next()
gen.next()
```

You'll notice after 4 executions that the code hopped into the `moreNums()` function, ran the line that returned `4` and then just hung out there.

## 2 Way Communication with Generators  

So thats all well and good, but besides controlling every line of a function executino another cool feature of generators is the ability to pass information back INTO a function in the middle of its execution.  

```js
function *adding(){
  var result = 1 + 1
  return 20 + (yield result)
}

var sum = adding()
sum.next()
sum.next()
```

In the example above, we've got a generator function called `adding()` that assigns a variable to a mathematical addition operation, and then returns a value that includes a `yield expression`

What do you expect the value to be if you run the two `.next()` methods on this generator iterator?  Take a second to think about this before you try it in your console.

What happens is your generator runs every line of code until it encounters its first `yield expression`. It then fires off whatever is to the *right* of the keyword `yield` (in this case, `result`, which is `2` based on our variable assignment), and then waits.  

When you run it again, it has replaced `yield result` with whatever has been passed INTO the second `sum.next()` function, which (most likely) was nothing in your console logging attempt above.  

If you ran the code exactly as listed above, you should have seen something like:  

```js
Object {value: 2, done: false}
Object {value: NaN, done: true}
```

Round 1: We get a value of `2`. Makes sense - if it stops at `yield` and fires whatever is to the right, we're asking for the `var` `result` which is `2`.  

Round 2: If it wipes out the yield expression and then replaces it with whatever argument we pass in, we are telling it to execute the line that says `20 + (the yield expression we just wiped out)` which, naturally, is `NaN`.  

Try it again, but this time pass in a value the second time you call `sum.next()`.  

```js
function *adding(){
  var result = 1 + 1
  return 20 + (yield result)
}

var sum = adding()
sum.next()
sum.next(10)

// => Object {value: 30, done: true}
```

We've just accomplished real life, two way communication with a LIVE FUNCTION. You can dig deeper [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators), but lets circle back to our original topic.  

Now that these funky looking functions make more sense, let's go back to setting up our `sagas.js` file.   

### Implementing Sagas  

Recall that in our main `src/index.js` file we have the following line:  

```js
store.dispatch(getBackgroundImage());
```

This line tells our redux store to dispatch an action which currently lives in our `actions/index.js` file. If we hop over to that file, we'll see that this function does that messy async sequence of events:  

```js
export const getBackgroundImage = () => {
  return dispatch => {
    dispatch(requestImage());
    fetch('https://api.nasa.gov/planetary/apod?api_key=EFZIxlP9Ry5aV1KIjYZilvSLqziN5RBOJicPD8W9')
    .then(response =>  response.json())
    .then(json => dispatch(setBackgroundImage(json.hdurl)))
    .catch(error => dispatch(catchError(error)));
  };
};
```

We'll need that code in a bit, so comment it out for reference and replace it with:  

```js
export const getBackgroundImage = () => ({
  type: 'GET_IMAGE',
});
```

Now our `dispatch` method fires off a plain action object, instead of that disaster of an async fetch call. FINALLY we can set up a Saga to do the rest of it for us.  We will dive deeper into what's going on with these Generators and how Sagas leverage that power for good momentarily.  

First, we need to add a function that uses the Saga effect `takeEvery`. This effect is the most like redux-thunk, in that it will hang out and listen for whatever action has been dispatched. When it intercepts that action, it fires off the callback function passed in as its second argument.  

In our case, we tell our store to dispatch the action creator `getBackgroundImage()`, which then dispatches an action with the type of `GET_IMAGE`. Let's update our saga to start paying attention.

```js
// sagas.js  

import { call, put, takeEvery, all } from 'redux-saga/effects';

// Remove the default keyword here
export function* testSaga() {
  console.log('Wired up!');
}

export function* getImageAsync(action) {
  // do some stuff in here to get the image
}

// This function will now watch for any time it intercepts a `GET_IMAGE` action type.

// Remember that we get the ACTION that was fired for free as an argument that is passed to our callback.
export function* watchGetImage() {
  yield takeEvery('GET_IMAGE', getImageAsync(action));
}

// Similar to having a root Reducer, we need one master Saga to export
export default function* rootSaga() {
  yield all([
    testSaga(),
    watchGetImage(),
  ]);
}
```

## Saga Effects

Redux Sagas provide us with a few different "effects" and helper methods that scoot things along. We just used `takeEvery`, which "takes" "every" action that matches a pattern it's been given and fires off the next saga when that pattern is matched. Additinally, it appends the ACTION that was fired as the third argument to the function.

The next two we will implement are:  

* `put`
  - Tells the middleware to dispatch an action to the Store.

```js
// WHAT IS RETURNED HERE
```
* `call`
  - Used when we need to get data asynchronously, and might need to do some stuff in between (like when you use `fetch` to make an API call)
  - Takes two arguments - a callback, and a spread of additional arguments   
  - Returns a plain object describing what instructions it is following out.

```js
// WHAT IS RETURNED HERE
```

There are many more effects and helpers we can use, some of which are blocking (meaning they will wait for whatever they've been told to do to resolve), some are non-blocking (meaning they wait for no one). Check out [this section of the docs](https://github.com/redux-saga/redux-saga/tree/master/docs/api#takepattern) for all the goods.  


## Restructuring our API call

So now let's do something with the `getImageAsync` function we fired off. In this function, we want to fire off each of the actions we originally had in our `actions/index.js` file.  

1. Tell redux we are requesting an image, so do the Loader thing.
2. Fetch the image in the meantime
3. Figure out what to do if stuff breaks  

```js
// sagas.js

// ---- additional code ---- //

  export function* getImageAsync() {
    // Dispatch the 'REQUEST_IMAGE' action to the store to kick off our loader
    yield put({type: 'REQUEST_IMAGE'})

    // Make our async call to fetch
    const image = yield call(fetchImage);

    // Dispatch the 'SET_BACKGROUND' image to the store to do something with our API results
    yield put({ type: 'SET_BACKGROUND', image })
  }

  export function* watchGetImage() {
    yield takeEvery('GET_IMAGE', getImageAsync);
  }

  // ---- additional code ---- //
```

Last but not least, we tell `getImageAsync()` to run a `call`, firing off the `fetchImage` function. This allows us to isolate any fetch requests. We can add that within this same file, or (assuming we have a few in our big fancy app), we can pull these out into a helper function.  

```js
// fetch.js

export const fetchImage = () => {
  return fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY')
  .then(response => response.json())
  .then(json => json.hdurl)
  .catch(error => console.log(error));
};
```

Don't forget to import this file in `sagas.js`.  

### Testing

As always, testing pieces of a front end framework can lead to a bad time. Let's work through what testing this app would like as is.  

#### Actions

The easiest piece of a redux app to test is (in my opinion) a normal, synchronous, actionCreator.
Because we started with a `create-react-app` boilerplate, we get the Jest testing framework out of the bag. Let's set up our testing directories:  

```bash
mkdir src/__tests__
```

Normally it might make sense to separate each test file into it's own appropriate directory, but for the sake of time and because this is such a small example, let's throw all of our test files right in here.  

```bash
touch tests/actions.test.js tests/reducers.test.js tests/sagas.test.js
```

```js
// __tests__/actions.test.js  

import * as actions from '../actions';

describe('actionCreators', () => {

  it('should dispatch the GET_IMAGE action', () => {
    const expected = { type: 'GET_IMAGE', output: 'Fired off getBackgroundImage from App.js' };
    expect(actions.getBackgroundImage()).toEqual(expected);
  });

});
```

____

**YOUR TURN**

* Write additional tests for any other action creators

____

#### Reducers  

Reducers are also incredibly easy to test. They are designed as pure functions, meaning that we should always get the same output given a particular input.

Let's do a couple examples:  

```js
// __tests__/reducers.test.js

import reducer from '../reducers/background-image.js';
import * as actions from '../actions';

const initialState = {
  isFetching: false,
  error: '',
  data: { hdurl: '', explanation: '' },
};

describe('background image reducer', () => {

  // Test for our default state
  it('should return the initial state', () => {
    expect(reducer(null, {})).toEqual(initialState);
  });

  // Test for the scenario when the `ERROR` case is triggered
  it('type ERROR', () => {
    const error = 'Something went wrong';
    const action = actions.handleError(error);
    const expected = {
      isFetching: false,
      error: error,
      image: '',
    };

    expect(reducer(undefined, action)).toEqual(expected);
  });

});
```

____

**YOUR TURN**
* Add an action creator to the `actions/index.js` file called `requestImage()`.  
* Return the object `{ type: 'REQUEST_IMAGE' }` from our new actionCreator.  
* In `sagas.js`, refactor the `handleSetImage()` generator function so that it calls our new `requestImage()` action instead.  
* Add an additional test in `__tests__/reducers.test.js` to test the   `REQUEST_IMAGE` case.

* Add another action creator called `setBackground()` that takes a `data`   parameter.  
* Refactor the line with `yield put({ type: 'SET_BACKGROUND', data: data })` similarly to what we just did with `requestImage()`.  
* Add an additional test in our `reducer.test.js`   

____

#### Sagas

To set up this testing file, we need to grab all of the things associated with our sagas. The beauty of using Sagas, is that we are now dealing with ES6 Generator functions. Which in turn means that we can run each line of code and test that specific `yield expression` to ensure that we are getting back that plain old JS object with a value we expect.  

Let's start with our basic testSaga generator function to see what this looks like.

```js
// __tests__/sagas.test.js

import { takeEvery } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';

import { requestImage, setBackground, handleError } from '../actions';
import { fetchImage } from '../fetch';

import { testSaga, getImageAsync, watchGetImage } from '../sagas';

describe('test saga', () => {
  const generator = testSaga();

  it('calls the test saga function', () => {
    const testValue = generator.next().value;

    expect(testValue).toEqual('WIRED UP');
  });
});
```

That one doesn't have a whole lot going on though so let's try the `getImageAsync()` generator to see if it gets more complicated.

```js
// Previous tests above

describe('getImageAsync', () => {
  const generator = getImageAsync();

  it('fires a put effect to getImage', () => {
    const testValue = generator.next().value;
    expect(testValue).toEqual(put(requestImage()));
  });

  it('fires a call effect to fetch the image', () => {
    const testValue = generator.next().value;
    expect(testValue).toEqual(call(fetchImage));
  });
});
```

So far so good. EVEN WHEN we asked it to fire that potentially crazy `fetchImage` async call. This is because by using Sagas, we can test that the INSTRUCTIONS we are handing to our middleware are what we expect, and our application responds correctly.

Let's look at the next step.

```js
describe('getImageAsync', () => {
  const generator = getImageAsync();

  // PREVIOUS CODE:
  // it('fires a put effect to getImage', () => {
  //   const testValue = generator.next().value;
  //   expect(testValue).toEqual(put(requestImage()));
  // });
  //
  // it('fires a call effect to fetch the image', () => {
  //   const testValue = generator.next().value;
  //   expect(testValue).toEqual(call(fetchImage));
  // });

  it('fires a put to set the background image', () => {
    const data = { hdurl: 'some url', explanation: 'stuff and things' }
    const testValue = generator.next(data).value;
    expect(testValue).toEqual(put(setBackground(data)))
  })
});
```

So here's where the cool part comes in. Because we're using generators, and because we have this two-way communication thing going on, we can TELL OUR GENERATOR 'hey - let's pretend this is what you got back. Carry on and make sure the rest of the instructions make sense.'. We're essentially stubbing in whatever we want to get back from our API call, and letting our generator move along.  

Finally, let's add one last assertion to make sure that if our try/catch block fails that we trigger the error handling.  

```js

  it('fires a put to handle a failure', () => {
    const error = {
      error: 'BROKE EVERYTHING'
    }
    const testValue = generator.throw(error).value;
    expect(testValue).toEqual(put(handleError(error)));
  });

```

If you got stuck, you can find this finished describe block in `snippets.js` under `6. Testing getImageAsync saga`.  


### Printing Our Data Flow

Let's take a minute to wire up a few actions that will act like a type of hand-rolled logger. What we want to do is set up some functionality so that every time a redux action is triggered, we see exactly what is happening behind the scenes.  

First, set up a `middlewareReducer.js` file so that we can kick off an initial state. The first thing that happens when Redux creats the store is a wiring-up of all initial states. That action type looks like `@@INIT`.  

```js
// reducers/middleware-reducer.js
const initialState = { output: "@@INIT" }

const middlewareReducer = (state=initialState, action) => {

}

export default middlewareReducer;
```

Make sure to add this reducer to our `reducers/index.js` file so it's included in the fun.

### Resources

* [Redux Testing/Inspiration for printing Redux logs](https://medium.com/@gethylgeorge/using-redux-saga-to-handle-side-effects-and-testing-it-using-jest-2dff2d59f899)  
