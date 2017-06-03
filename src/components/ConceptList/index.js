import React from 'react';
import './styles.css'

const ConceptList = ({ concepts }) => {

    const displayConcepts = () => {
      if(concepts) {
        return Object.keys(concepts).map((concept, i) => {
          return (
            <li key={i}>{concept}</li>
          )
        })
      } else {
        return <div>Add some concepts!</div>
      }
    }

    console.log(displayConcepts);
    return (
      <section className="concept-list">
        <ul>
          { displayConcepts() }
        </ul>
      </section>
    )
}

export default ConceptList;
