/**
 * setState 什么时候是同步的，什么时候是一步的
 * 在 React 能管辖的地方就是批量异步的，比如时间处理函数，比如生命周期函数异步
 * 在 React 管不到的地方，就是同步的， setTimeout、setInterval、原生时间处理函数
 */

/**
 * 合成事件的作用很多
 * 合成事件的原理是通过事件委托实现的
 *
 * 要想button上绑定click事件
 * 现在不向button上绑定事件了，而是把所哟偶事件都绑定到document上
 * 相当于一个事件委托
 * React17以前低委托到document上
 * React17之后事件头委托到容器上 <div id="root" />
 * 这样可以在一个页面中视同多个不同的 React 应用
 * <div id="root1" > ReactDom.render(<APP1/>, root1)
 * <div id="root2" > ReactDom.render(<APP2/>, root2)
 *
 *
 * 好处：
 * 1、可以实现刚才说的，异步更新队列，事件开始
 *  // updateQueue.isBatchingUpdate = true
 *  结束的时候
 *  // updateQueue.batchUpdate()
 * 2、可以做一些浏览器兼容性
 * 不同楼兰器API不一样
 * 把不同事件对象做成一个标准化的事件对象，提供标准的API房屋供用户使用
 */
// 阻止冒泡
function stopPropagation (event) {
  if (!event) {
    window.event.cancelable = true
  }
  if (event.stopPropagation) {
    event.stopPropagation()
  }
}
// 阻止默认行为
function preventDefault (event) {
  if (!event) {
    window.event.returnValue = false
  }
  if (event.preventDefault) {
    event.preventDefault()
  }
}

/**
 * 对于类组件来书
 * renderVdom
 * 类的实例.render()返回的虚拟DOM oldRenderVom
 *
 * 对应函数组件来说
 * 函数执行（）返回的虚拟DOM oldRenderVom
 */