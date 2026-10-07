
import React from 'react';
import { DeviceItem, DeviceListScreen } from '../devices';

export default function PinPadsPage() {
  const items: DeviceItem[] = [
    { title: 'SignPad', subtitle: 'Checkout Lane 1', icon: 'dialpad', status: 'green' },
    { title: 'Payment Services Pad', subtitle: 'Checkout Lane 2', icon: 'dialpad', status: 'green' },
    { title: 'Card Reader', subtitle: 'Mobile Sales', icon: 'dialpad', status: 'green' },
  ];

  return <DeviceListScreen pageTitle="Pin Pads" items={items} />;
}
