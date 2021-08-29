import { wrapToVdom } from "./utils";
import Component from "./Component";

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
    ({ref, key} = config)
    delete config.ref
    delete config.key
  }
  let props = { ...config }

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else {
    props.children = wrapToVdom(children) // children 可能是React元素，也可能是一个字符串、数字、null、undefined
  }
  return { type, ref, key, props }
}



const React = {
  createElement,
  Component
}

export default React