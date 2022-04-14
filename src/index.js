// import './__index'
import React from "./react";
import ReactDOM from "./react-dom";

function withTracker (OldComponent) {

  return class MouseTracker extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 }
    }

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }

    render() {
      return (
        <div onMouseMove={ this.handleMouseMove }>
          <OldComponent { ...this.state } />
        </div>
      );
    }
  }
}

class ClassCounter extends React.PureComponent {
  render () {
    console.log('ClassCounter render')
    console.log('ClassCounter this:', this)
    return <div>{ this.props.count }</div>
  }
}
function FunctionCounter (props) {
  console.log('FunctionCounter render')
  return <div>{ props.count }</div>
}
const MemoFunctionCounter = React.memo(FunctionCounter)
class App extends React.Component {
  state = { number: 0 }
  amountRef = React.createRef()

  handleClick = () => {
    let nextNumber = this.state.number + (parseInt(this.amountRef.current.value))
    this.setState({
      number: nextNumber
    })
  }

  render() {
    return (<div>
      <ClassCounter count={ this.state.number } />
      <MemoFunctionCounter count={ this.state.number } />
      <div>----------------------------------------</div>
      <input type="text" ref={ this.amountRef }/>
      <button onClick={ this.handleClick }>+</button>
    </div>)
  }
}



function Show (props) {
  return (
    <React.Fragment>
      <h1>移动鼠标</h1>
      <p>当前鼠标位置是： { props.x }, { props.y }</p>

    </React.Fragment>
  )
}
let HighOrderShow = withTracker(Show)

ReactDOM.render(<App />, document.getElementById('root'))