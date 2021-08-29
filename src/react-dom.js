import { REACT_TEXT } from "./constant";

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
const createDOM = (vdom) => {
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
  return dom
}
const mountClassComponent = (vdom) => {
  const { type: ClassComponent, props} = vdom
  const classInstance = new ClassComponent(props)
  const renderVdom = classInstance.render()
  vdom.oldRenderVdom = renderVdom
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
 * 把心属性更新到真实DOM上
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
    } else {
      dom[key] = newProps[key]
    }
  }
}

const ReactDOM = {
  render
}

export default ReactDOM