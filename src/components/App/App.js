import React, { Component } from 'react';
import './App.css';

import Form from '../Form/Form'
import ConceptList from '../ConceptList/ConceptList'
// import ConceptList from '../Form/Form'

class App extends Component {
  constructor() {
    super()
    this.state = { concepts: [] }
  }

  saveConcept(concept) {
      console.log(concept);
  }

  render() {
    return (
      <div className="App">
        <Form handleClick={ (concept) => this.saveConcept(concept) } />
        <ConceptList concepts ={ this.state.concepts } />
      </div>
    );
  }
}

export default App;
