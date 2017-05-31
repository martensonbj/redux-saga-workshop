import React, { Component } from 'react';

export default class Form extends Component {
  constructor() {
    super()
    this.state = { concept: '' }
  }

  handleClick(e) {
    e.preventDefault()
    this.props.handleClick(this.state.concept)
  }

  render() {
    return (
      <form>
        <input  type="text"
                placeholder="Concept"
                value = { this.state.concept }
                onChange = { e => this.setState({ concept: e.target.value }) }
        />
        <input  type="submit"
                value="Save"
                onClick={ e => this.handleClick(e) }
        />
      </form>
    )
  }
}
