import React, { Component } from 'react';
import './styles.css'

export default class ConceptList extends Component {

  getConcepts() {
    return this.props.concepts.map((concept, i) => (
      <li key={concept} id={concept}>{ concept }</li>
    ))
  }

  render() {
    return (
      <section className="concept-list">
        <ul>
          { this.getConcepts() }
        </ul>
      </section>
    )
  }
}
