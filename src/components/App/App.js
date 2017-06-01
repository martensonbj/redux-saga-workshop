// import React, { Component } from 'react';
// import './App.css';
// import firebase from '../../firebase';
//
// import Form from '../Form/Form'
// import ConceptList from '../ConceptList/ConceptList'
// // import ConceptList from '../Form/Form'
//
// class App extends Component {
//   constructor() {
//     super()
//     this.state = {
//       concepts: {}
//     }
//   }
//
//   saveConcept(concept) {
//     newConcept = Object.assign({}, { [concept]: [] })
//     newState = Object.assign({}, this.state, newConcept)
//     this.setState({ concepts: newState }, () => {
//       firebase.database().ref('concepts').set(this.state.concepts)
//       .then(() => console.log('done'))
//     })
//   }
//
//   render() {
//     return (
//       <div className="App">
//         <Form handleClick={ (concept) => this.saveConcept(concept) } />
//         <ConceptList concepts ={ this.state.concepts } />
//       </div>
//     );
//   }
// }
//
// export default App;
