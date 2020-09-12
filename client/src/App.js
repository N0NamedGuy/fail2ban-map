import React from 'react';
import './App.css';

import { Map } from './components/Map';
import { BannedIpLayer } from './components/BannedIpLayer';
import { OsmLayer } from './components/OsmLayer';

const App = () => {
    return (
        <div className="App">
            <Map>
                <OsmLayer />
                <BannedIpLayer />
            </Map>
        </div>
    );
}

export default App;
