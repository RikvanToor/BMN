import React, { PureComponent } from 'react';

export default class Layoutable extends PureComponent {
  constructor(props) {
    super(props);
    this.internalComp = React.createRef();
  }

  componentDidUpdate() {
    this.internalComp.current.layout();
  }

  componentDidMount() {
    this.internalComp.current.layout();
  }

  render() {
    const { component, ...rest } = this.props;
    const Comp = component;
    return <Comp ref={this.internalComp} {...rest} />;
  }
}
