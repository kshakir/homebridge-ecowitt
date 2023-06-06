import { PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
import { ThermoHygroBaroSensor } from './ThermoHygroBaroSensor';


export class GW1100 extends ThermoHygroBaroSensor
{
  constructor(protected readonly platform: EcowittPlatform, protected readonly accessory: PlatformAccessory)
  {
    super(platform, accessory);

    this.setModel('GW1100', 'Gateway with Indoor Temperature, Humidity and Barometric Sensor');

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, this.platform.baseStationInfo.deviceName)
      .setCharacteristic(this.platform.Characteristic.HardwareRevision, platform.baseStationInfo.model);


    this.setName(this.humiditySensor, 'Indoor Humidity');
    this.setName(this.temperatureSensor, 'Indoor Temperature');
  }

  update(dataReport)
  {
    this.platform.log.info('GW1100A Update');
    this.platform.log.debug('  tempinf:', dataReport.tempinf);
    this.platform.log.debug('  humidityin:', dataReport.humidityin);
    this.platform.log.debug('  baromrelin', dataReport.baromrelin);
    this.platform.log.debug('  baromabsin', dataReport.baromabsin);

    this.updateAbsolutePressure(dataReport.baromabsin);
    this.updateRelativePressure(dataReport.baromrelin);
    this.updateHumidity(dataReport.humidityin);
    this.updateTemperature(dataReport.tempinf);
  }
}

