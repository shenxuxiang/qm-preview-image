import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

export default class Portal extends PureComponent<any> {
  public dv: null | HTMLDivElement;
  constructor(props: any) {
    super(props);
    this.dv = document.createElement('div');
    document.body.appendChild(this.dv);
  }

  componentWillUnmount() {
    document.body.removeChild(this.dv!);
    this.dv = null;
  }

  render() {
    return createPortal(this.props.children, this.dv!);
  }
}
