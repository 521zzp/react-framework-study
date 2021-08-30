import { wrapToVdom } from "./utils";
import Component from "./Component";
import {REACT_ELEMENT, REACT_FORWARD_REF} from "./constant";

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
    config._source && delete config._source
    config._self && delete config._self
    ref = config.ref
    key = config.key
    delete config.ref
    delete config.key
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
const React = {
  createElement,
  createRef,
  forwardRef,
  Component
}

export default React