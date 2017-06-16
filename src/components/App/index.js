import React from 'react';
import Image from '../../containers/image';
import './styles.css';

const App = ({ image }) => {
  if ( image.error ) {
    return (
      <div className="App--error">
        <h2>{image.error.code}</h2>
        <p>{image.error.message}</p>
      </div>
    )
  }

  if ( !image.hdurl) {
    return (
      <div className="App--pending">
        <img  height='75'           src="https://vignette3.wikia.nocookie.net/landbeforetime/images/3/32/Ducky%27s_Offcial_TLBT_Website_Art.jpg/revision/latest/scale-to-width-down/350?cb=20130912041058" alt="Ducky" />
        <p>You should not eat talking trees. Nope, nope, nope.</p>
        <small>[under construction]</small>
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
