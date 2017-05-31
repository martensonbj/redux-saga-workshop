import React, { Component } from 'react';
import './styles.css';

import Form from '../Form'
import ConceptList from '../ConceptList'
// import ConceptList from '../Form/Form'

class App extends Component {
  constructor() {
    super()
    this.state = { concepts: [] }
  }

  saveConcept(concept) {
    this.setState({ concepts: [...this.state.concepts, concept]})
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
