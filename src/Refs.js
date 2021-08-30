import React from "./react";

export class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef();
  }

  getFocus = () => {
    this.inputRef.current.focus()
  }

  render () {
    return <input type="text" ref={ this.inputRef } />
  }
}


function TextInput2 (props, forwardRef) {
  return <input type="text" ref={ forwardRef }/>
}

const ForwardedTextInput = React.forwardRef(TextInput2)

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef()
  }

  getFocus = (event) => {
    // 如果给一个类组件添加了ref属性，那么 ref.current 会只想组件实例
    this.inputRef.current.focus()
  }

  render () {
    return <div>
      <ForwardedTextInput ref={this.inputRef}/>
      <button onClick={ this.getFocus }>输入框聚焦</button>
    </div>
  }
}
