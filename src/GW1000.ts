import { PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
import { ThermoHygroBaroSensor } from './ThermoHygroBaroSensor';


export class GW1000 extends ThermoHygroBaroSensor {

  constructor(
    protected readonly platform: EcowittPlatform,
    protected readonly accessory: PlatformAccessory,
  ) {
    super(platform, accessory);

    this.setModel(
      'GW1000',
      /*'WiFi Weather Station */ 'Gateway with Indoor Temperature, Humidity and Barometric Sensor');

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, this.platform.baseStationInfo.deviceName)
      .setCharacteristic(this.platform.Characteristic.HardwareRevision, platform.baseStationInfo.model);
    //  .setCharacteristic(this.platform.Characteristic.SerialNumber, platform.baseStationInfo.serialNumber);
    // .setCharacteristic(this.platform.Characteristic.SoftwareRevision, platform.baseStationInfo.softwareRevision)
    // .setCharacteristic(this.platform.Characteristic.FirmwareRevision, platform.baseStationInfo.firmwareRevision);

    this.setName(this.temperatureSensor, 'Indoor Temperature');
    this.setName(this.humiditySensor, 'Indoor Humidity');
  }

  update(dataReport, logLevel) {
    this.platform.log.log(logLevel, 'GW1000 Update');
    this.platform.log.log(logLevel, '  tempinf:', dataReport.tempinf);
    this.platform.log.log(logLevel, '  humidityin:', dataReport.humidityin);
    this.platform.log.log(logLevel, '  baromrelin', dataReport.baromrelin);
    this.platform.log.log(logLevel, '  baromabsin', dataReport.baromabsin);

    this.updateTemperature(dataReport.tempinf);
    this.updateHumidity(dataReport.humidityin);
    this.updateAbsolutePressure(dataReport.baromabsin);
    this.updateRelativePressure(dataReport.baromrelin);
  }
}

