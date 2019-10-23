import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, ready: false, component: null, componentStack: [] };
  }

  static getDerivedStateFromError(error) {
    //console.log(Object.entries(error))
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    const stack = errorInfo.componentStack
    .split("\n")
    .map(line=>line.replace(/^\s*in\s+/,"").replace(/\s.*/,""))
    .filter(line=>line.match(/[A-Z]/));

    const [component, ...componentStack] = stack;

    this.setState({component,componentStack,ready:true})
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      const {error,component, componentStack} = this.state;
      
      // You can render any custom fallback UI
      return (
        <div className="ui fluid red tertiary error segment" onClick={e=>e.stopPropagation()}>
          <div className="content">
            <div className="ui red header">
              <i className="react icon"/>
              <div className="content">
                Error in <code>{component}</code>
                
                <div className="sub header">
                  <code>{error.code||"NATIVE"}</code>
                </div>
               </div>
            </div>
            <p>
              <b>
                {error.message}
              </b>
            </p>
            <p>
              <details><summary className="ui label"><a>Componentstack</a></summary><pre style={{margin:"0 0 0 1em"}}>{component+"\n"}{componentStack.join("\n")}</pre>
              </details>
            </p>
          </div>
        </div>
       )
    }

    return this.props.children; 
  }
}