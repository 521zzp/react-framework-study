import React from '../react'

const ThemeContext = React.createContext()

function Header2 () {
  return <ThemeContext.Comsumer>
    {
      value => <div style={{ margin: '1px', border: `1px solid ${value.color}`, padding: '5px' }}>
        header
      </div>
    }
  </ThemeContext.Comsumer>
}

/**
 * 如果是类组件，可以通过给它添加 contextType 静态属性来渠道 this.context
 */

class Header extends React.Component {
  static contextType = ThemeContext
  render() {
    console.log('header', this)
    return (
      <div style={{ margin: '1px', border: `1px solid ${this.context.color}`, padding: '5px' }}>
        header
        <Title/>
      </div>
    );
  }
}

class Title extends React.Component {
  static contextType = ThemeContext
  render() {
    console.log('title', this)
    return (
      <div style={{ margin: '1px', border: `1px solid ${this.context.color}`, padding: '5px' }}>
        title
      </div>
    );
  }
}

class Main extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '1px', border: `1px solid ${this.context.color}`, padding: '5px' }}>
        main
        <Content/>
      </div>
    );
  }
}

class Content extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '1px', border: `1px solid ${this.context.color}`, padding: '5px' }}>
        Content
        <div>
          <button onClick={ () => this.context.changeColor('red') } style={{ color: 'red' }}>红色</button>
          <button onClick={ () => this.context.changeColor('green') } style={{ color: 'green' }}>绿色</button>
        </div>
      </div>
    );
  }
}


export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: 'red' }
  }
  changeColor = (color) => {
    this.setState({ color })
  }
  render () {
    const value = { color: this.state.color, changeColor: this.changeColor }
    return <ThemeContext.Provider value={ value }>
      <div style={{ margin: '1px', border: `1px solid ${this.state.color}`, padding: '5px', width: '200px' }}>
        Page
        <Header/>
        <Main />
      </div>
    </ThemeContext.Provider>
  }
}