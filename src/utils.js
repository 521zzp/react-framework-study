import { REACT_TEXT } from "./constant";

/**
 * 把任意元素保证成虚拟DOM对象
 * @param element
 * @returns {{type: symbol, props: {content: (string|number)}}|*}
 */
export const wrapToVdom = (element) => {
  if (typeof element === 'string' || typeof element === 'number') {
    return { type: REACT_TEXT, props: { content: element } }
  } else {
    return element
  }
}

/**
 * 浅比较两个对象是否相等
 * @param obj1
 * @param obj2
 */
export function shallowEquals (obj1, obj2) {
  if (obj1 === obj2) {
    return true
  }
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }
  let keys1 = Object.keys(obj1)
  let keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  } else {
    for (let key of keys1) {
      if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
        return false
      }
    }
  }
  return true
}