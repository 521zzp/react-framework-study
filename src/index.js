import React from './react';
import ReactDOM from './react-dom';
// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import { Form } from "./Refs";
// import App from './App';
// import reportWebVitals from './reportWebVitals';


/**
 * 可以通过 函数定义组件
 * 函数组件其实就是一个接受属性对象并返回一个React元素的函数
 * 组件名称必须以大写字母开头，原生元素 span h1 是以小写字母开头的，自定义组件是以大写字母开头的
 * 组件必须先定义再使用
 * 组件必须返回唯一的根元素，并且只能返回一个唯一的根元素
 * 组件返回的可能是一个原生的组件原生，也可以是Loi
 * 组件可以接收属性对象，用来计算返回的原生
 * @param props
 * @returns {{ref: {_self}|{_source}|*, type: *, key: {_self}|{_source}|*, props: *}}
 * @constructor
 */
function FunctionComponent (props) {
  return <FunctionComponent2 title={props.title + ' lord'} />
  // return <div style={{ color: 'pink' }}>{ props.title }</div>
}

const FunctionComponent2 = (props) => {
  return <div style={{ color: 'pink' }}>{ props.title }</div>
}

/**
 * 也可以通过类定义组件
 * 类组件的渲染是 先通过属性对象创建类组件实力，调用实例的render方法返回一个React元素
 */
class ClassComponent extends React.Component {

  render () {
    return <div>
      <div style={{ color: '#6de379' }}>外层 class 组件</div>
      <div style={{ color: '#6aace7' }}>
        <div>内层函数组件</div>
        <FunctionComponent title={ this.props.title }/>
      </div>
    </div>
  }
}

class Counter extends React.Component {
  constructor(props) {
    super(props);
    // 只有在构造函数中，次啊能直接给this.state赋值
    this.state = { number: 0, age: 10 }
  }
  handleClick = (event) => {
    // updateQueue.isBatchingUpdate = true
    // 可以通过 setState 修改状态，每次修改后，组件会重新更新
    // setState参数是新的状态对象，这个新状态对象会合并到老状态对象上
    // 老状态没有的属性会添加，老状态有的属性会覆盖
    // state状态的更新是批量的，是异步执行的
    // 先实现同步更新，后面在实现异步更新
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)
    setTimeout(() => { // 在定时器里面是同步的
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
      this.setState({ number: this.state.number + 1 })
      console.log(this.state.number)
    })
    // 如果直接修改state的话，this.state的确改变了，但是组件并没有刷新，视图不更新
  }
  // this.state = { number }

  handleDivClick = () => {
    console.log('div click')
  }

  render () {
    return <div onClick={ this.handleDivClick }>
      <p>{ this.props.title }</p>
      <p>number: { this.state.number }</p>
      <p>age: { this.state.age }</p>
      <button onClick={ this.handleClick }>add</button>
    </div>
  }
}

class Counter2 extends React.Component {
  // 1、设置默认属性和初始状态
  static defaultProps = {
    name: 'React架构'
  }
  constructor(props) {
    super(props);
    this.state = { number: 0 } // 设置默认状态
    console.log('Counter 1.constructor')
  }

  componentWillMount () {
    console.log('Counter 2.componentWillMount')
  }

  handleClick = (event) => {
    this.setState({ number: this.state.number + 1 })
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate')
    // 偶数刷新
    return nextState.number % 2 === 0
  }

  componentWillUpdate () {
    console.log('Counter 6.componentWillUpdate')
  }

  render () {
    console.log('Counter 3.render')
    return <div>
      <p>{ this.state.number }</p>
      <button onClick={ this.handleClick }>+</button>
    </div>
  }

  componentDidUpdate () {
    console.log('Counter 7.componentDidUpdate')
  }

  componentDidMount () {
    console.log('Counter 4.componentDidMount')
  }




}

class Calculate extends React.Component {
  constructor(props) {
    super(props);
    this.aRef = React.createRef() // { current: null }
    this.bRef = React.createRef() // { current: null }
    this.resultRef = React.createRef()  // { current: null }
  }
  handleClick = () => {
    let a = this.aRef.current.value
    let b = this.bRef.current.value
    this.resultRef.current.value = a + b
  }
  render () {
    // 如果给一个原生组件添加了一个ref属性，那么当次原生虚拟DOM组件变成真实DOM之后
    // 会把真实的DOM元素赋值 this.ref.current
    return <div>
      <input type="text" ref={ this.aRef }/>+
      <input type="text" ref={ this.bRef }/>=
      <input type="text" ref={ this.resultRef }/>
      <button onClick={ this.handleClick }>add</button>
    </div>
  }
}


// const element = <FunctionComponent title="标题哈哈"/>
const element = React.createElement(ClassComponent, { title: '哈哈哈哈' })

console.log(JSON.stringify(element, null, 2))

ReactDOM.render(
  <Counter2 title="老标题"/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
