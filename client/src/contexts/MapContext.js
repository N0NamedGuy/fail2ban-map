import { createContext } from 'react';

const MapContext = createContext({
    layers: [],
    addLayer: (layer) => {},
    removeLayer: (layer) => {}
});

export { MapContext };