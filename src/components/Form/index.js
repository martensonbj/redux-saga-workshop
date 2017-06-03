import React, { Component } from 'react';
import cn from 'classnames';
import './styles.css';

export default class Form extends Component {
  constructor() {
    super()
    this.state = { concept: '' }
  }

  handleClick(e) {
    e.preventDefault()
    this.props.handleClick(this.state.concept)
    this.setState({ concept: '' })
  }

  render() {

    let btnStyles = cn({
      'btn-enabled': this.state.concept !== '',
      'btn-disabled': this.state.concept === ''
    })
    return (
      <form>
        <input  type="text"
                placeholder="Concept"
                value = { this.state.concept }
                onChange = { e => this.setState({ concept: e.target.value }) }
        />
        <input  className = { btnStyles }
                type="submit"
                value="Save"
                disabled = { this.state.concept === '' }
                onClick={ e => this.handleClick(e) }
        />
      </form>
    )
  }
}
