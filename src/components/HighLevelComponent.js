import React from '../react'

const withLoading = (message) => (OldComponent) => {
  return class extends React.Component {
    render() {
      const state = {
        show: () => {
          const div = document.createElement('div')
          div.innerHTML= `<p id="loading" style="position: absolute;top: 100px;z-index: 100;background-color: gray;color: :red">${ message }</p>`
          document.body.appendChild(div)
        },
        hide: () => {
          document.getElementById('loading').remove()
        }
      }
      return <OldComponent { ...this.props } { ...state }/>
    }
  }
}

class Hello extends React.Component {
  render() {
    return (
      <div>
        { this.props.title }
        <button onClick={ this.props.show }>show</button>
        <button onClick={ this.props.hide }>hide</button>
      </div>
    );
  }
}

export default withLoading('加载中……')(Hello)

/**
 * 反向继承
 * 我们有个组件，是第三方抵提供的，我们不能改，也不能基础，但是还想做出一点修改，或增强
 */
const wrapper = OldComponent => {
  return class extends OldComponent {
    constructor(props) {
      super(props);
      this.state = { ...this.state, number: 0 }
      console.log('wrapper constructor')
    }
    componentDidMount () {
      console.log('wrapper did mount')
      super.componentDidMount()
    }
    handleClick  = () => {
      this.setState({ number: this.state.number + 1 })
    }
    render() {
      console.log('wrapper render')
      const renderVdom = super.render()
      const newProps = {
        ...renderVdom.props, // { name: undefined, title }
        ...this.state, // { number: 0 }
        onClick: this.handleClick
      }
      // 参数列表老的React元素 新的属性， 后面都是儿子们
      return React.cloneElement(renderVdom, newProps, this.state.number, this.state.name);
    }
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    // 此处的this就是子类的实例
    this.state = { name: '张三' }
    console.log('button constructor')
  }
  componentDidMount () {
    console.log('Button Mount')
  }

  render() {
    return <button name={this.state.name} title={this.props.title} />;
  }
}


export const WrappedButton = wrapper(Button)