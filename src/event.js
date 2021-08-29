import { updateQueue } from "./Component";

/**
 * 实现合成事件或者事件委托
 * @param dom 绑定事件的DOM元素
 * @param eventType 事件类型
 * @param eventHandler  事件的处理函数
 */
export function addEvent (dom, eventType, eventHandler) {
  let eventStore;
  if (dom._store) { // _store是给原生DOM对象上添加的自定义属性
    eventStore = dom._store
  } else {
    dom._store = {}
    eventStore = dom._store
  }
  // store.onclick =
  eventStore[eventType] = eventHandler
  // document.onclick = dispatchEvent
  if (!document[eventType]) {
    document[eventType] = dispatchEvent
  }
}

/**
 * 不管点什么按钮，触发什么事件，最终都冒泡到document,执行的都是 dispatchEvent
 * 在合成事件的处理函数里，状态的更新是批量的
 *
 * @param event 原生的事件对象，不同的浏览器可能是不一样的
 */
function dispatchEvent (event) {
  // console.log('event:', event)
  // target = button type = click
  let { target, type } = event
  let eventType = 'on' + type
  // 先把批量更新的全局变量设置位 true
  updateQueue.isBatchingUpdate = true
  // 先创建一个合成事件
  let syntheticEvent = createSyntheticEvent(event)
  let currentTarget = target
  // 是在模拟向上冒泡的过程
  while (currentTarget) {
    // 获取事件源DOM对象上的Store属性
    let { _store } = currentTarget
    let eventHandler = _store && _store[eventType]
    if (eventHandler) {
      syntheticEvent.target = target
      syntheticEvent.currentTarget = currentTarget
      eventHandler && eventHandler.call(target, syntheticEvent)
    }
    currentTarget = currentTarget.parentNode
  }
  updateQueue.isBatchingUpdate = false
  updateQueue.batchUpdate() // 进入真正的更新
}

/**
 * 创建合成事件
 * @param nativeEvent 原生事件对象
 * @returns {{nativeEvent}}
 */
function createSyntheticEvent (nativeEvent) {
  let syntheticEvent = { nativeEvent }
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key]
  }
  // 此处会有一些兼容性处理
  return syntheticEvent
}