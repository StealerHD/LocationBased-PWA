import React from 'react';
import RoutingMachine from './mapRouting';

const RoutingMachineWrapper = ({ start, end }: RoutingConfig) => {
  return <RoutingMachine start={start} end={end} />;
};

export default RoutingMachineWrapper;
