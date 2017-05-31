import React, { Component } from 'react';
import Form from '../Form'
import ConceptList from '../ConceptList'
import firebase from '../../firebase';
import './styles.css';

class App extends Component {
  constructor() {
    super()
    this.state = { concepts: [] }
  }

  componentDidMount() {
    firebase.database().ref('1611').on('value', (snapshot) => {
      console.log(snapshot.val());
    })
  }

  saveConcept(concept) {
    firebase.database().ref('Testing').push({concept})
      .then(() => console.log('done'))
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
