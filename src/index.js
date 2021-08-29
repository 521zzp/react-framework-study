// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const el = <div>content</div>


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
  // return <FunctionComponent2 title={`FunctionComponent${props.title}`} ></FunctionComponent2>
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

// const element = <FunctionComponent title="标题哈哈"/>
const element = React.createElement(ClassComponent, { title: '哈哈哈哈' })




console.log(JSON.stringify(element, null, 2))

ReactDOM.render(
  element,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
