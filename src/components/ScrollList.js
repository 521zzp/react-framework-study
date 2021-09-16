import React from '../react'

class ScrollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: [] }
    this.wrapper = React.createRef()
  }

  addMessage = () => {
    this.setState({
      message: [`${this.state.message.length}`, ...this.state.message]
    })
  }

  componentDidMount () {
    setInterval(()  => {
      this.addMessage()
    }, 1000)
  }

  getSnapshotBeforeUpdate () {
    return {
      prevScrollTop: this.wrapper.current.scrollTop, // 向上卷去的高度
      prevScrollHeight: this.wrapper.current.scrollHeight // DOM更新的内容高度
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    let { prevScrollTop, prevScrollHeight } = snapshot
    let scrollHeightDiff = this.wrapper.current.scrollHeight - prevScrollHeight
    this.wrapper.current.scrollTop = prevScrollTop + scrollHeightDiff
  }

  render () {
    const style = {
      height: '100px',
      width: '200px',
      border: '1px solid red',
      overflow: 'auto'
    }
    return <div style={ style } ref={ this.wrapper } >
      {
        this.state.message.map((msg, index) => {
          return <div key={ index }>{ msg }</div>
        })
      }
    </div>
  }
}

export default ScrollList