import GraphContainer from './GraphContainer';

const AtmosphericHumidity = () => <GraphContainer title="Atmospheric Humidity" map={(snapshot) => snapshot.air.humidity} />;

export default AtmosphericHumidity;