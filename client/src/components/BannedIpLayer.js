import React, { useEffect, useState } from 'react';
import { VectorLayer } from './VectorLayer';
import { Feature } from 'ol';
import { Circle as CircleGeom } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { makeRequest, getWebSocket } from '../utils';

const BannedIpLayer = () => {
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        makeRequest('/api/bans')
            .then(data => {
                const historicalFeatures = data
                    .filter(data => !!data.geo)
                    .map(convertDataToFeature);
                setFeatures(historicalFeatures);
            })
            .then(() => {
                const socket = getWebSocket();

                socket.on('ban', (line) => {
                    console.log('got line', line);
                    setFeatures((features) => [...features, convertDataToFeature(line)]);
                })
            })

    }, []);

    function convertDataToFeature(data) {
        const [lat, lon] = data.geo.ll;
        const feature = new Feature(
            new CircleGeom(fromLonLat([lon, lat]), 10000)
        );

        return feature;
    }

    return features && <VectorLayer features={features} />
}

export { BannedIpLayer };