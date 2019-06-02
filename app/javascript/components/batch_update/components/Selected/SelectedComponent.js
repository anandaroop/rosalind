import React from 'react'
import styled from 'styled-components'
import { color } from '@artsy/palette'

class SelectedComponent extends React.Component {
  constructor(props) {
    super(props)
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleRemove(e) {
    e.preventDefault()
    this.props.onRemove(this.props.name, this.props.stateKey)
  }

  handleToggleNegation = e => {
    e.preventDefault()
    this.props.onNegate(this.props.name, this.props.isNegated)
  }

  render() {
    const { className, name, isNegated } = this.props

    return (
      <div className={className}>
        <NegationToggler
          isNegated={isNegated}
          onClick={this.handleToggleNegation}
        />{' '}
        {name}
        <a href="#" className="remove" onClick={this.handleRemove}>
          ✕
        </a>
      </div>
    )
  }
}

/* default styled component */

const StyledSelectedComponent = styled(SelectedComponent)`
  font-weight: bold;
  margin: 0.25em 0;
  position: relative;
  left: -0.25em;

  a.remove {
    display: inline-block;
    height: 2em;
    width: 2em;
    line-height: 2em;
    text-align: center;
    color: #ddd;
    margin-left: 0.5em;
    border-radius: 1em;
    text-decoration: none;
    &:hover {
      color: #333;
      cursor: pointer;
      background: #eee;
    }
  }
`

const NegationToggler = ({ isNegated, onClick }) => (
  <ToggleButton onClick={onClick}>{isNegated ? '－' : '＋'}</ToggleButton>
)

const ToggleButton = styled.button`
  display: inline-block;
  height: 1.5em;
  width: 1.5em;
  line-height: 1.5em;
  border: none;
  border-radius: 50%;
  text-align: center;

  &:hover {
    border: solid 1px ${color('black30')};
  }
`

export { StyledSelectedComponent as default, SelectedComponent }
