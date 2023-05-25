import GraphContainer from './GraphContainer';

const SoilHumidity = () => <GraphContainer title="Soil Humidity" map={(snapshot) => snapshot.ground.humidity} />;

export default SoilHumidity;