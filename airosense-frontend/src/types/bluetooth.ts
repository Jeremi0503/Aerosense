export type BluetoothGATTServer = {
  connect: () => Promise<BluetoothGATTServer>;
};

export type BluetoothLEDevice = {
  id: string;
  name?: string;
  gatt?: BluetoothGATTServer;
  addEventListener: (
    type: "gattserverdisconnected",
    listener: () => void
  ) => void;
};

export type BluetoothNavigator = Navigator & {
  bluetooth?: {
    requestDevice: (options: {
      filters: { namePrefix: string }[];
    }) => Promise<BluetoothLEDevice>;
  };
};
