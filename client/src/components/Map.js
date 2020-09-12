import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';

import { Map as olMap, View } from 'ol';

import { MapContext } from '../contexts/MapContext';

const Map = ({ children }) => {
    const mapRef = useRef();

    const [map, setMap] = useState();
    const [layers, setLayers] = useState([]);

    useEffect(() => {
        const map = new olMap({
            target: mapRef.current,
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });

        setMap(map);
    }, []);

    function addLayer(layer) {
        console.log('adding layer', layer);
        map.addLayer(layer);
        setLayers([...layers, layer]);
    }

    function removeLayer(layer) {
        console.log('removing layer', layer);
        map.removeLayer(layer);
        setLayers(layers.filter((l) => l === layer));
    }

    const mapContextObj = {
        addLayer,
        removeLayer,
        layers
    }

    return <MapContext.Provider value={mapContextObj}>
        <div className="Map-container" ref={mapRef}>
        </div>

        {!!map && children}
    </MapContext.Provider>
}

export { Map };