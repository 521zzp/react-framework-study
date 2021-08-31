import React from '../react'

class CounterDiff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ['A', 'B', 'C', 'D', 'E', 'F']
    }
  }

  handleClick = () => {
    this.setState({
      list: ['A', 'C', 'E', 'B', 'G']
    })
  }

  render () {
    return <React.Fragment>
      <ul>
        {
          this.state.list.map(el => <li key={el}>{ el }</li>)
        }
      </ul>
      <button onClick={ this.handleClick }>reset</button>
    </React.Fragment>
  }

}

export default CounterDiff