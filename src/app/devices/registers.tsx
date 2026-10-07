
// app/devices/registers.tsx
import React from 'react';
import { DeviceItem, DeviceListScreen } from '../devices';

export default function RegistersPage() {
  const items: DeviceItem[] = [
    { title: 'Register 01', subtitle: 'Main Checkout Lane 1', icon: 'note-edit', status: 'green' },
    { title: 'Register 02', subtitle: 'Main Checkout Lane 2', icon: 'note-edit', status: 'green' },
    { title: 'Register 03', subtitle: 'Main Checkout Lane 3', icon: 'note-edit', status: 'green' },
    {
      title: 'Register 04',
      subtitle: 'Main Checkout Lane 4',
      icon: 'note-edit',
      status: 'red',
      incident: 'INC',                 // shows a red pill
      incidentId: 'INC00001236',       // ✅ clicking the pill navigates to /incidents/INC00001236
    },
    { title: 'Express Register', subtitle: 'Express Lane', icon: 'note-edit', status: 'green' },
    { title: 'Customer Service Register', subtitle: 'Customer Service', icon: 'note-edit', status: 'green' },
  ];

  return <DeviceListScreen pageTitle="Registers" items={items} />;
}
``
