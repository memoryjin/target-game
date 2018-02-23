import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Number extends PureComponent {
  handleClick = () => {
    this.props.onClick(this.props.id)
  }
  // PureComponent implements shouldComponentUpdate with a shallow prop and state comparison
  componentWillUpdate() {
    console.log('number will update')
  }
  render() {
    return (
      <div
        className={`number ${this.props.active ? '' : 'disabled'}`}
        onClick={this.handleClick}
      >
        {this.props.value}
      </div>
    )
  }
}

Number.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  active: PropTypes.bool,
  id: PropTypes.number,
  onClick: PropTypes.func
}

Number.defaultProps = {
  value: '?',
  clickable: true
}

export default Number
