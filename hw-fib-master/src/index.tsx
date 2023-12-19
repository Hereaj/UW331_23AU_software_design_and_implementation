import React from 'react';
import { createRoot } from 'react-dom/client';
import { nextFib } from './fib';
import './index.css';

type userInfo = [string | null, string | null];

const main: HTMLElement | null = document.getElementById('main');
if (main === null) {
  console.log('Uh oh! no "main" element!');
} else {
  const root = createRoot(main);
  const params: URLSearchParams = new URLSearchParams(window.location.search);

  // TODO: replace this when you get to problem 5
  const [firstName, ageString]: userInfo = [params.get('firstName'), params.get('age')];
  
  if (firstName === null || ageString === null) {
    root.render(
    <form action='/'>
      <p className='greeting'>Hi there! Please enter the following information:</p>
      <p>Your first name: <input type='text' name='firstName'></input></p>
      <p>Your age: <input type='number' name='age' min='0'></input></p>
      <input className='btn' type='submit' value='Submit'></input>
    </form>);
  } else {
    const age = parseInt(ageString, 10);
    if (isNaN(age) || age < 0) {
      root.render(<div><p className='greeting'>Your age should be the positive number.</p><a className='btn' href="/">Start Over</a></div>);
    } else {
      const ageFib = nextFib(age);
      const fibAgeDiff = ageFib - age;
      const yearString = (fibAgeDiff === 1) ? 'year' : 'years';
      if (ageFib === age) {
        root.render(<div><p className='greeting'>Hi, {firstName}! Your age ({age}) is a Fibonacci number!</p><a className='btn' href="/">Start Over</a></div>);
      } else {
        root.render(<div><p className='greeting'>Hi, {firstName}! Your age ({age}) will be a Fibonacci number in {fibAgeDiff} {yearString}.</p><a className='btn' href="/">Start Over</a></div>)
      }
    }
  }
}
