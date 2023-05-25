import GraphContainer from './GraphContainer';

const AtmophericPressure = () => <GraphContainer title="Atmospheric Pressure" map={(snapshot) => snapshot.air.pressure} />;

export default AtmophericPressure;