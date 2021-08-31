// 上一个不需要移动的老节点的属性
let lastPlacedIndex = 0
// 声明一个Map,把劳动儿子的key和他对应的虚拟DOM节点关联起来，放在map里
let oldChildrenMap = {
  'A': 'A对应的虚拟DOM',
  'B': 'B对应的虚拟DOM',
  'C': 'C对应的虚拟DOM',
  'D': 'D对应的虚拟DOM',
  'E': 'E对应的虚拟DOM',
  'F': 'F对应的虚拟DOM',
}
// 开始循环新的儿子数组
let newChildren = []
for (let i = 0; i < newChildren.length; i++) {
  let newChild = newChildren[i] // A 的虚拟DOM节点
  let newKey = newChild.key // A 的key
  let oldChild = oldChildrenMap[newKey]
  if (oldChild) {
    // 先更新oldChild A, 只是更新自己的属性 id className
    // 如果找到的可以复用的劳动DOM节点，它员原来的挂载索引比 lastPlacedIndex 要小就需要移动，否则不需要移动
    if (oldChild._mountIndex < lastPlacedIndex) {
      // 可以复用老节点，但是老节点需要移动到当前索引位置
    }
    lastPlacedIndex = Math.max(lastPlacedIndex, oldChild._mountIndex)
  }
}