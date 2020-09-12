import { useContext, useEffect } from "react";

import { Tile as TileLayer } from "ol/layer";
import { OSM as OsmSource } from "ol/source";
import { MapContext } from "../contexts/MapContext";

const layer = new TileLayer({
    source: new OsmSource()
})

const OsmLayer = () => {
    const mapContext = useContext(MapContext);

    useEffect(() => {
        mapContext.addLayer(layer);

        return () => {
            mapContext.removeLayer(layer);
        }
    }, []);

    return null;
};

export { OsmLayer }