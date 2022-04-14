import { wrapToVdom } from "./utils";
import Component from "./Component";
import {
  REACT_CONTEXT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT, REACT_MEMO,
  REACT_PROVIDER,
} from "./constant";
import { shallowEquals } from './utils'

/**
 *
 * 创建一个虚拟DOM，也就是一个React元素
 * @param type 元素的类型 span div p
 * @param config 配置对象 className style
 * @param children 子元素，可能一个（对象），也可能多个（数组）
 */
function createElement (type, config, children) {
  // console.log('createElement:', type)
  let ref // 通过ref引用此元素的DOM
  let key // 可以唯一标识一个子元素
  if (config) {
    config.hasOwnProperty('__source') && delete config.__source
    config.hasOwnProperty('__self') && delete config.__self
    ref = config.ref
    key = config.key
    delete config.ref
    delete config.key // props里面没有key, 和props同层级关系
  }
  let props = { ...config } // props里面没有ref属性

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else {
    props.children = wrapToVdom(children) // children 可能是React元素，也可能是一个字符串、数字、null、undefined
  }
  return { $$typeof: REACT_ELEMENT, type, ref, key, props } // React元素
}

function createRef () {
  return { current: null }
}
function forwardRef (render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render // 函数组件 <InputText />
  }
}
function createContext () {
  const context = { $$typeof: REACT_CONTEXT, _currentValue: null }
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context:context
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context
}

class PureComponent extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    // 只要属性和状态对象，有任意一个属性变了，就会进行更新，如果全相等，才不更新
    return !shallowEquals(this.props, nextProps) || !shallowEquals(this.state, nextState)
  }
}

function memo (type, compare = shallowEquals) {
  return {
    $$typeof: REACT_MEMO,
    type, // 函数组件
    compare
  }
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
  createContext,
  PureComponent,
  memo
}

export default React