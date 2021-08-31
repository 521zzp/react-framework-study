import { REACT_TEXT, REACT_FORWARD_REF, REACT_FRAGMENT, MOVE, PLACEMENT, DELETION } from "./constant";
import { addEvent } from './event'
import {forwardRef} from "react";
/**
 * 把虚拟DOM变成真实DOM插入到容器内部
 * @param vdom
 * @param container
 */
const render = (vdom, container) => {
  mount(vdom, container)
  // react hooks 调度更新过程 需要卸载此处
}

const mount = (vdom, parentDOM) => {
  let newDOM = createDOM(vdom)
  if (newDOM) {
    parentDOM.appendChild(newDOM)
    // 生命周期 componentDidMount
    if (newDOM._componentDidMount) newDOM._componentDidMount();
  }
}
/**
 * 把虚拟DOM转换成真实DOM
 * @param vdom
 */
export const createDOM = (vdom) => {
  if (!vdom) return null
  const { type, props, ref } = vdom
  let dom // 真实DOM
  if (type && type.$$typeof === REACT_FORWARD_REF) { // 说明它是一个转发过得函数组件
    return mountForwardComponent(vdom)
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment()
  } else if (type === REACT_TEXT) { // 如果这个元素是文本的话
    dom = document.createTextNode(props.content)
  } else if (typeof type === 'function') { //如果这个元素类型是函数的话
    if (type.isClassComponent) { //说明是个类组件
      return mountClassComponent(vdom) // 挂载类组件
    } else {
      return mountFunctionComponent(vdom) // 挂载函数组件
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
        children._mountIndex = 0
        mount(children, dom)
      } else if (Array.isArray(children)) {
        reconcileChildren(props.children, dom)
      }
    }
  }
  vdom.dom = dom // 让虚拟DOM的dom属性只想这个真实dom
  if (ref) {
    ref.current = dom // 如果把虚拟DOM转成真实DOM了，就把真实DOM给 ref.current
  }
  return dom
}

const mountForwardComponent = (vdom) => {
  let { type, props, ref } = vdom
  const renderVdom = type.render(props, ref)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

const mountClassComponent = (vdom) => {
  const { type: ClassComponent, props, ref } = vdom
  const classInstance = new ClassComponent(props)
  // 如果类组件的虚拟DOM有ref属性，就把类的实例赋给ref.current属性
  if (ref) ref.current = classInstance
  if (classInstance.componentWillMount) { // 生命周期 componentWillMount
    classInstance.componentWillMount()
  }
  // 把类组件的实例挂载到对应的的虚拟DOM上
  vdom.classInstance = classInstance
  const renderVdom = classInstance.render()
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom
  // 把类组件实例的render方法返回的虚拟DOM转成真实DOM
  let dom = createDOM(renderVdom)
  if (classInstance.componentDidMount) { // 组件已挂载
    dom._componentDidMount = classInstance.componentDidMount.bind(classInstance)
  }
  return dom
}

const mountFunctionComponent = (vdom) => {
  let { type, props} = vdom
  let oldRenderVdom = type(props)
  // 这个代码现在还没有用，后面进行组件更新使用的
  vdom.oldRenderVdom = oldRenderVdom
  return createDOM(oldRenderVdom)
}

const reconcileChildren = (childrenVdom, parentDOM) => {
  childrenVdom.forEach((childVdom, index) => {
    childVdom._mountIndex = index
    mount(childVdom, parentDOM)
  })
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
 * 1、老、新都为null
 * 2、老有新没有
 * 3、老没有新有
 * 4、老新都有
 * @param parentDOM
 * @param oldVdom
 * @param newVdom
 */
export function compareTowVdom (parentDOM, oldVdom, newVdom, nextDOM) {
  // 如果新的老的都是Null,什么都不用做
  if (!oldVdom && !newVdom) {
    return null
  } else if (oldVdom && !newVdom) { // 如果老的有,新的没有,卸载老节点
    unMountVdom(oldVdom)
  } else if (!oldVdom && newVdom) { // 如果老的没有，新的有，挂载新组件
    let newDom = createDOM(newVdom) // 根据新的虚拟DOM创建新的真实DOM
    if (nextDOM) {
      parentDOM.insertBefore(newDom, nextDOM)
    } else {
      parentDOM.appendChild(newDom)
    }
    if (newDom._componentDidMount) newDom._componentDidMount() // 生命周期 componentDidMount
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unMountVdom(oldVdom)
    let newDom = createDOM(newVdom) // 根据新的虚拟DOM创建新的真实DOM
    parentDOM.appendChild(newDom) // TODO 添加到父节点上 不太合适？
    if (newDom._componentDidMount) newDom._componentDidMount() // 生命周期 componentDidMount
  } else { // 如果老的有，新的也有，并且类型也一样，只需要更新就可以，就可复用来节点
    // 进入深度对比子节点流程
    updateElement(oldVdom, newVdom)
  }

  // let oldDOM = findDOM(oldVdom) // 获取oldRenderVdom 对应的真实DOM
  // // 然后基于新的属性和状态，计算新的虚拟DOM
  //  // 根据新的虚拟DOM得到新的真实DOM
  // let newDOM = createDOM(newVdom)
  // // 把老的真实DOM替换成新的虚拟DOM
  // parentDOM.replaceChild(newDOM, oldDOM) // 全部替换，性能很差
}

/**
 * 深度更新节点
 * @param oldVdom
 * @param newVdom
 */
function updateElement (oldVdom, newVdom) {
  if(oldVdom.type === REACT_TEXT) {
    if (oldVdom.props.content !== newVdom.props.content) {
      let currentDOM = newVdom.dom = findDOM(oldVdom) // TODO 疑惑
      currentDOM.textContent = newVdom.props.content // 更新文本节点内容位新的文本内容
    }
  } else if (oldVdom.type === REACT_FRAGMENT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
  } else if (typeof oldVdom.type === 'string') { // 字符串表示是原生组件，并且类型一样，说明可以复用老的dom节点
    let currentDOM = newVdom.dom = findDOM(oldVdom) // 获取老的真实DOM，准备复用
    updateProps(currentDOM, oldVdom.props, newVdom.props) // 直接用新的属性更新老的DOM节点即可
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isClassComponent) { // 类组件
      newVdom.classInstance = oldVdom.classInstance
      updateClassComponent(oldVdom, newVdom)
    } else { // 函数组件
      updateFunctionComponent(oldVdom, newVdom)
    }
  }
}

/**
 * 更新类组件
 * @param oldVdom
 * @param newVdom
 */
function updateClassComponent (oldVdom, newVdom) {
  let classInstance = newVdom.classInstance = oldVdom.classInstance
  let oldRenderVdom = newVdom.oldRenderVdom = oldVdom.oldRenderVdom // TODO 疑惑
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  classInstance.updater.emitUpdate(newVdom.props) // TODO 疑惑
}
/**
 * 更新函数组件
 * @param oldVdom
 * @param newVdom
 */
function updateFunctionComponent (oldVdom, newVdom) {
  let currentDom = findDOM(oldVdom)
  let parentDOM = currentDom.parentNode
  let { type, props } = newVdom
  let newRenderVdom = type(props)
  compareTowVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom) // TODO 疑惑 oldVdom.oldRenderVdom 哪里来的
  newVdom.oldRenderVdom = newRenderVdom

}

/**
 * 实现完整的 DOM-DIFF 算法
 * @param parentDom 父DOM节点
 * @param oldVChildren 老的虚拟DOM儿子的数组
 * @param newVChildren 新的虚拟DOM儿子的数组
 */
function updateChildren (parentDOM, oldVChildren, newVChildren) {
  const _oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : oldVChildren ? [oldVChildren] : []
  const _newVChildren = Array.isArray(newVChildren) ? newVChildren : newVChildren ? [newVChildren] : []
  let keyedOldMap = {}
  let lastPlacedIndex = 0 // 上一个不需要移动的老DOM节点的属性
  _oldVChildren.forEach((oldVChild, index) => {
    let oldKey = oldVChild.key || index
    keyedOldMap[oldKey] = oldVChild
  })
  //
  let patch = []
  // 循环新数组
  _newVChildren.forEach((newVChild, index) => {
    newVChild._mountIndex = index
    let newKey = newVChild.key || index
    let oldVChild = keyedOldMap[newKey]
    if (oldVChild) {
      // 如果找到了，按理应该再次判断类型，省略 TODO
      // 先执行更新虚拟DOM元素， 在React15里，DOM的更新和DOM-DIFF在一起的，后面分开了
      updateElement(oldVChild, newVChild)
      if (oldVChild._mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          fromIndex: oldVChild._mountIndex,
          toIndex: index
        })
      }
      // 如果此节点被复用了,把它从MAP中删除
      delete keyedOldMap[newKey]
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild._mountIndex)
    } else { // 没有找到可复用的老节点
      patch.push({
        type: PLACEMENT,
        newVChild,
        toIndex: index
      })
    }
  })
  /*Object.values(keyedOldMap).forEach(oldVChild => {
    patch.push({
      type: DELETION,
      oldVChild,
      fromIndex: oldVChild._mountIndex,
    })
  })*/
  // 获取要移动的元素 这里只有 B
  // 注意此处只是把B从界面中移除了，但是B还在内存里的，B并没有被消销毁
  const moveChildren = patch.filter(el => el.type === MOVE).map(el => el.oldVChild)
  // 现在 keyedOldMap 里面放在所哟生效的元素
  Object.values(keyedOldMap).concat(moveChildren).forEach(oldVChild => {
    let currentDOM = findDOM(oldVChild)
    // 获取到 B D F 从真实DOM中删除
    currentDOM.parentNode.removeChild(currentDOM)
  })
  patch.forEach(action => {
    const { type, oldVChild, newVChild, fromIndex, toIndex } = action
    let childNodes = parentDOM.childNodes // 获取真实子DOM元素的集合 [A, C, E]
    if (type === PLACEMENT) {
      let newDOM = createDOM(newVChild) // 根据虚拟DOM创建真实DOM
      let childDOMNode = childNodes[toIndex] // 找下一个目标索引现在对应的真实DOM
      if (childDOMNode) { // 如果此位置已有DOM元素，插入到它前面
        parentDOM.insertBefore(newDOM, childDOMNode)
      } else {
        parentDOM.appendChild(newDOM) // 如果没有，添加到最后
      }
    } else if (type === MOVE) {
      let oldDOM = findDOM(oldVChild) // 找到老的真实DOM，还可以把内存中的B取到，插入到指定位置
      let childDOMNode = childNodes[toIndex] // 找下一个目标索引现在对应的真实DOM
      if (childDOMNode) { // 如果此位置已有DOM元素，插入到它前面
        parentDOM.insertBefore(oldDOM, childDOMNode)
      } else {
        parentDOM.appendChild(oldDOM) // 如果没有，添加到最后
      }
    }
  })


  /*let maxChildrenLength = Math.max(_oldVChildren.length, _newVChildren.length)
  for (let i = 0; i < maxChildrenLength; i++) {
    // 视图去除当前节点的下一个，最近的弟弟真实DOM节点
    let nextVdom = _oldVChildren.find((item, index) => index > i && item && findDOM(item))
    compareTowVdom(parentDOM, _oldVChildren[i], _newVChildren[i], findDOM(nextVdom))
  }*/
}

function unMountVdom (vdom) {
  let { props, ref } = vdom
  let currentDOM = findDOM(vdom) // 获取次虚拟DOM对应的真实DOM
  // vdom可能是原生组件、类组件、函数组件
  if (vdom.classInstance && vdom.classInstance.componentWillMount) {
    vdom.classInstance.componentWillMount()
  }
  if (ref) {
    ref.current = null
  }
  // 取消监听函数
  Object.keys(props).forEach(propName => {
    if (propName.startsWith('on')) {
      // // 如果你是把事件监听绑定在真实DOM上
      // const eventName = propName.slice(0, 2).toLowerCase() // onClick => click
      // currentDOM.removeEventListener(eventName, props[propName])

      // 现在我们用了合成事件
      currentDOM._store = undefined
    }
  })
  // 如果虚拟DOM有子节点的话，删除
  if (props.children) {
    let children = Array.isArray(props.children) ? props.children : [props.children]
    children.forEach(unMountVdom)
  }
  // 把自己这个虚拟DOM对应的真实DOM从界面删除
  currentDOM.parentNode.removeChild(currentDOM)
}

const ReactDOM = {
  render
}

export default ReactDOM