import { useEffect, useState, useContext } from 'react';

import { Vector as olVectorLayer } from 'ol/layer'
import {
    Style as olStyle,
    Stroke as StrokeStyle,
    Fill as FillStyle
} from 'ol/style';

import { MapContext } from '../contexts/MapContext';
import VectorSource from 'ol/source/Vector';

const VectorLayer = ({ features }) => {
    const [layer, setLayer] = useState(null);
    const mapContext = useContext(MapContext);

    useEffect(() => {
        if (!!layer) {
            mapContext.removeLayer(layer);
        }

        const newLayer = new olVectorLayer({
            style: new olStyle({
                stroke: new StrokeStyle({
                    color: 'red',
                    width: 3
                }),
                fill: new FillStyle({
                    color: 'transparent'
                })
            }),
            projection: 'EPSG:4326',
        });

        setLayer(newLayer);

        mapContext.addLayer(newLayer);

        return () => {
            mapContext.removeLayer(layer);
        }
    }, []);

    useEffect(() => {
        if (layer) {
            layer.setSource(new VectorSource({
                features: features
            }));
        }
    }, [layer, features])

    return null;
};

export { VectorLayer };