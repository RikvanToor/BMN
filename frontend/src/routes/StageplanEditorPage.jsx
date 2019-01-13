/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import StageplanViewer from '@Components/StageplanComponents/StageplanViewer.jsx';
import ChannelList from '@Components/StageplanComponents/ChannelList.jsx';
import { Container } from 'flux/utils';
import { deferredDispatch } from '@Services/AppDispatcher.js';
import StageplanStore from '@Stores/StageplanStore.js';
import { getLatestStageplan } from '@Actions/StageplanActions.js';

import Ordering from '@Utils/Svg/Ordering.js';

import { dispatch } from '@Services/AppDispatcher.js';
import {
  addStageplanElement, updateGeometry, updateOrdering, deleteElement,
} from '@Actions/StageplanActions.js';

class StageplanEditorPage extends Component {
  componentDidMount() {
    deferredDispatch(getLatestStageplan());
    this.addStageplanElement = this.addStageplanElement.bind(this);
    this.saveGeometry = this.saveGeometry.bind(this);
    this.saveOrder = this.saveOrder.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
  }

  addStageplanElement(element) {
    dispatch(addStageplanElement(element, this.props.stageplan.id));
  }

  deleteElement(id) {
    dispatch(deleteElement(id, this.props.stageplan.id));
  }

  saveOrder(ordering) {
    dispatch(updateOrdering(ordering, this.props.stageplan.id));
  }

  saveGeometry(geometryMap) {
    dispatch(updateGeometry(geometryMap, this.props.stageplan.id));
  }

  render() {
    const {
      id, elements, positions, roles, ordering,
    } = this.props.stageplan;
    return (
      <React.Fragment>
        <StageplanViewer
          stageplanId={id}
          elements={elements}
          positions={positions}
          roles={roles}
          saveGeometry={this.saveGeometry}
          saveOrder={this.saveOrder}
          ordering={Ordering.fromIdList(ordering)}
          addElement={this.addStageplanElement}
          deleteElement={this.deleteElement}
        />
        <ChannelList />
      </React.Fragment>
    );
  }
}

export default Container.createFunctional(
  state => (<StageplanEditorPage stageplan={state.stageplan} />),
  () => [StageplanStore],
  prevState => ({
    stageplan: StageplanStore.activeStageplan,
  }),
);
