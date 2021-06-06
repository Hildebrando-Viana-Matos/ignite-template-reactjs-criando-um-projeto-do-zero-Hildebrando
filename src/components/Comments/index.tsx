import { Component, ReactElement } from "react";

export default class Comments extends Component<ReactElement> {
  componentDidMount() {
    let script = document.createElement("script");
    let anchor = document.getElementById("inject-comments-for-uterances");
    script.setAttribute("src", "https://utteranc.es/client.js");
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("async", "true");
    script.setAttribute(
      "repo",
      "Hildebrando-Viana-Matos/ignite-template-reactjs-criando-um-projeto-do-zero-Hildebrando"
    );
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-dark");
    anchor.appendChild(script);
  }

  render() {
    return <div id="inject-comments-for-uterances"></div>;
  }
}
