import React, {Component} from 'react';
import StageplanViewer from '@Components/StageplanComponents/StageplanViewer.jsx';
import ChannelList from '@Components/StageplanComponents/ChannelList.jsx';

class StageplanEditorPage extends Component {
    render() { 
        return ( 
            <React.Fragment>
            <StageplanViewer/>            
            <ChannelList/>
            </React.Fragment>
         );
    }
}
 
export default StageplanEditorPage;