import React, { Component } from "react";
import ReactDom from "react-dom";

class App extends Component {
  render() {
    return <div>1哈哈</div>;
  }
}

ReactDom.render(<App />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
