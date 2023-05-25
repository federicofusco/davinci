import GraphContainer from './GraphContainer';

const AtmophericTemperature = () => <GraphContainer title="Atmospheric Temperature" map={(snapshot) => snapshot.air.temperature} />;

export default AtmophericTemperature;