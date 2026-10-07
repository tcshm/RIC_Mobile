
import React from 'react';
import { DeviceItem, DeviceListScreen } from '../devices';

export default function PrintersPage() {
  const items: DeviceItem[] = [
    { title: 'Office Printer', subtitle: 'Back Office', icon: 'printer', status: 'green' },
    { title: 'Wireless Printer', subtitle: 'Checkout 1', icon: 'printer', status: 'green' },
    { title: 'Label Printer 01', subtitle: 'Sales Floor', icon: 'printer', status: 'green' },
    { title: 'Label Printer 02', subtitle: 'Receiving', icon: 'printer', status: 'green' },
    { title: 'Customer Service Printer', subtitle: 'Customer Service', icon: 'printer', status: 'green' },
  ];

  return <DeviceListScreen pageTitle="Printers" items={items} />;
}
