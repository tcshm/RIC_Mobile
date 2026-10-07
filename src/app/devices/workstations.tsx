
import React from 'react';
import { DeviceItem, DeviceListScreen } from '../devices';


export default function WorkstationsPage() {
  const items: DeviceItem[] = [
    { title: 'Store Manager Workstation', subtitle: 'Manager Office', icon: 'laptop', status: 'green' },
    { title: 'Tech Room Station', subtitle: 'Tech Services', icon: 'laptop', status: 'green' },
    { title: 'Admin Workstation 01', subtitle: 'Back Office', icon: 'laptop', status: 'green' },
  ];

  return <DeviceListScreen pageTitle="Workstations" items={items} />;
}
