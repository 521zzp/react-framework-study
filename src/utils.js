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