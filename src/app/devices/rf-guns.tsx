
import React from 'react';
import { DeviceItem, DeviceListScreen } from '../devices';

export default function RfGunsPage() {
  const items: DeviceItem[] = [
    { title: 'RF Gun 01', subtitle: 'Sales Floor Zone A', icon: 'remote', status: 'green' },
    { title: 'RF Gun 02', subtitle: 'Sales Floor Zone B', icon: 'remote', status: 'green' },
    { title: 'Telxon Gun', subtitle: 'In Store', icon: 'remote', status: 'green' },
  ];

  return <DeviceListScreen pageTitle="RF Guns" items={items} />;
}
``
