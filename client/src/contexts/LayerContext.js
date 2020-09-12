const { createContext } = require("react");

const LayerContext = createContext({
    features: [],
    addFeature: () => {},
    removeFeature: () => {},
});

export { LayerContext };