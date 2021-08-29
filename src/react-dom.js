import { REACT_TEXT } from "./constant";
import { addEvent } from './event'
/**
 * 把虚拟DOM变成真实DOM插入到容器内部
 * @param vdom
 * @param container
 */
const render = (vdom, container) => {
  mount(vdom, container)
}

const mount = (vdom, parentDOM) => {
  let newDOM = createDOM(vdom)
  if (newDOM) {
    parentDOM.appendChild(newDOM)
  }
}
/**
 * 把虚拟DOM转换成真实DOM
 * @param vdom
 */
export const createDOM = (vdom) => {
  if (!vdom) return null
  const { type, props } = vdom
  let dom // 真实DOM
  if (type === REACT_TEXT) { // 如果这个元素是文本的话
    dom = document.createTextNode(props.content)
  } else if (typeof type === 'function') { //如果这个元素类型是函数的话
    if (type.isClassComponent) { //说明是个类组件
      return mountClassComponent(vdom)
    } else {
      return mountFunctionComponent(vdom)
    }

  } else {
    dom = document.createElement(type)
  }
  // 处理属性
  if (props) {
    updateProps(dom, {}, props)
    if (props.children) {
      let children = props.children
      if (typeof children === 'object' && children.type) { // 说明是一个React元素
        mount(children, dom)
      } else if (Array.isArray(children)) {
        reconcileChildren(props.children, dom)
      }
    }
  }
  vdom.dom = dom // 让虚拟DOM的dom属性只想这个真实dom
  return dom
}
const mountClassComponent = (vdom) => {
  const { type: ClassComponent, props} = vdom
  const classInstance = new ClassComponent(props)
  const renderVdom = classInstance.render()
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

const mountFunctionComponent = (vdom) => {
  let { type, props} = vdom
  let renderVdom = type(props)
  // 这个代码现在还没有用，后面进行组件更新使用的
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)

}
const reconcileChildren = (childrenVdom, parentDOM) => {
  childrenVdom.forEach(childVdom => mount(childVdom, parentDOM))
}
/**
 * 把新属性更新到真实DOM上
 * @param dom
 * @param oldProps
 * @param newProps
 */
const updateProps = (dom, oldProps, newProps) => {
  for (let key in newProps) {
    if (key === 'children') { // 处理children
      continue
    } else if (key === 'style') { // 处理style
      let styleObj = newProps[key]
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if (key.startsWith('on')) {
      // dom[key.toLocaleLowerCase()] = newProps[key]
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
    } else {
      dom[key] = newProps[key]
    }
  }
}

export function findDOM (vdom) {
  if (!vdom) return null
  if (vdom.dom) {
    return vdom.dom
  } else {
    // 类组件和函数组件，它们虚拟DOM身上没有dom属性，但是oldRenderVdom
    return findDOM(vdom.oldRenderVdom)
  }

}

/**
 * dom-diff 核心是比较新旧虚拟DOM的差异，然后把差异同步到真实DOM节点上
 * @param parentDOM
 * @param oldVdom
 * @param newVdom
 */
export function compareTowVdom (parentDOM, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom) // 获取oldRenderVdom 对应的真实DOM
  // 然后基于新的属性和状态，计算新的虚拟DOM
   // 根据新的虚拟DOM得到新的真实DOM
  let newDOM = createDOM(newVdom)
  // 把老的真实DOM替换成新的虚拟DOM
  parentDOM.replaceChild(newDOM, oldDOM) // 全部替换，性能很差
}

const ReactDOM = {
  render
}

export default ReactDOM