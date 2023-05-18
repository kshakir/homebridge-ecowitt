import { PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
import { ThermoHygroBaroSensor } from './ThermoHygroBaroSensor';


export class GW1000 extends ThermoHygroBaroSensor
{
  constructor(protected readonly platform: EcowittPlatform, protected readonly accessory: PlatformAccessory)
  {
    super(platform, accessory);

    this.setModel('GW1000', 'Gateway with Indoor Temperature, Humidity and Barometric Sensor');

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, this.platform.baseStationInfo.deviceName)
      .setCharacteristic(this.platform.Characteristic.HardwareRevision, platform.baseStationInfo.model);


    this.setName(this.temperatureSensor, 'Indoor Temperature');
    this.setName(this.humiditySensor, 'Indoor Humidity');
  }

  update(dataReport)
  {
    this.platform.log.info('GW1000 Update');
    this.platform.log.debug('  tempinf:', dataReport.tempinf);
    this.platform.log.debug('  humidityin:', dataReport.humidityin);
    this.platform.log.debug('  baromrelin', dataReport.baromrelin);
    this.platform.log.debug('  baromabsin', dataReport.baromabsin);

    this.updateTemperature(dataReport.tempinf);
    this.updateHumidity(dataReport.humidityin);
    this.updateAbsolutePressure(dataReport.baromabsin);
    this.updateRelativePressure(dataReport.baromrelin);
  }
}

