import React from 'react';
import Image from '../../containers/image';
import './styles.css';

const App = ({ image }) => {
  if ( image.error ) {
    return (
      <div>
        <h2>{image.error.code}</h2>
        <p>{image.error.message}</p>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>{ image.data.title }</h1>
      <p>{ image.data.explanation }</p>
      <img alt="Daily satellite render from the NASA api" src={ image.data.hdurl } />
    </div>
  );
}

export default Image(App);
