import { useRef, useState } from "react";
import type { BluetoothLEDevice, BluetoothNavigator } from "../types/bluetooth";
import type { Device } from "../types/device";

type UseBluetoothDevicesOptions = {
  onDeviceConnected: (device: Device) => void;
  onDeviceDisconnected: (deviceId: string, name: string) => void;
};

export default function useBluetoothDevices({
  onDeviceConnected,
  onDeviceDisconnected,
}: UseBluetoothDevicesOptions) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const bluetoothListeners = useRef(new WeakSet<BluetoothLEDevice>());

  async function discoverDevice() {
    const bluetooth = (navigator as BluetoothNavigator).bluetooth;

    if (!bluetooth) {
      setHasError(true);
      setMessage(
        "Bluetooth is unavailable here. Use a supported browser on HTTPS or localhost."
      );
      return;
    }

    setIsDiscovering(true);
    setMessage("Choose an AeroSense device nearby to connect.");
    setHasError(false);

    try {
      const bluetoothDevice = await bluetooth.requestDevice({
        filters: [{ namePrefix: "AeroSense" }],
      });

      if (!bluetoothDevice.gatt) {
        throw new Error("This device does not support a Bluetooth LE connection.");
      }

      await bluetoothDevice.gatt.connect();

      const name = bluetoothDevice.name ?? "AeroSense device";
      const deviceId = bluetoothDevice.id;
      onDeviceConnected({
        id: deviceId,
        name,
        location: "Bluetooth",
        online: true,
        co2: null,
        pm25: null,
        pm10: null,
        temperature: null,
        humidity: null,
        airQuality: "Unknown",
        lastUpdated: "Connected via Bluetooth",
      });

      if (!bluetoothListeners.current.has(bluetoothDevice)) {
        bluetoothDevice.addEventListener("gattserverdisconnected", () => {
          onDeviceDisconnected(deviceId, name);
          setHasError(true);
          setMessage(`${name} disconnected.`);
        });
        bluetoothListeners.current.add(bluetoothDevice);
      }

      setMessage(`Connected to ${name}.`);
    } catch (error) {
      setHasError(true);
      setMessage(
        error instanceof Error && error.name === "NotFoundError"
          ? "No AeroSense device was selected."
          : error instanceof Error
          ? error.message
          : "Could not connect to an AeroSense device."
      );
    } finally {
      setIsDiscovering(false);
    }
  }

  return { isDiscovering, message, hasError, discoverDevice };
}
