import React from 'react';

export class ContextObject {
  constructor() {
    this.onMove = [];
    this.onUp = [];
    this.onDown = [];
    this.onSelect = [];
    this.onLayout = [];
  }

  triggerMove(e) {
    this.onMove.forEach(fn => fn(e));
  }

  triggerUp(e) {
    this.onUp.forEach(fn => fn(e));
  }

  triggerDown(e) {
    this.onDown.forEach(fn => fn(e));
  }

  triggerSelect(e, node, id) {
    this.onSelect.forEach(fn => fn(e, node, id));
  }

  triggerLayout() {
    this.onLayout.forEach(fn => fn());
  }
}

const SvgContext = React.createContext(new ContextObject());
export default SvgContext;

export function withContext(contextType, component) {
  return (props) => {
    const Consumer = contextType.Consumer;
    const Comp = component;
    const { children, ...rest } = props;
    return (
      <Consumer>
        {context => (
          <Comp context={context} {...rest}>{children}</Comp>
        )}
      </Consumer>
    );
  };
}
export function withSvgContext(component) {
  return withContext(SvgContext, component);
}
