import React, { Component } from 'react';
import Form from '../Form'
import ConceptList from '../ConceptList'
import firebase from '../../firebase';
import './styles.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      concepts: {}
    }
  }

  componentDidMount() {
    firebase.database().ref('concepts').on('value', (snapshot) => {
      this.setState({ concepts: JSON.parse(snapshot.val()) });
    })
  }

  saveConcept(concept) {
    let newConcept = { [concept]: [] }
    let newState = Object.assign({}, this.state.concepts, newConcept)

    this.setState({ concepts: newState }, () => {
      let objectToUpdate = this.state.concepts
      firebase.database().ref('concepts').set(JSON.stringify(objectToUpdate))
    })

  }


  render() {

    return (
      <div className="App">
        <Form handleClick={ (concept) => this.saveConcept(concept) } />
        <ConceptList concepts={ this.state.concepts } />
      </div>
    );
  }
}

export default App;
