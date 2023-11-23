import { PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
import { ThermoHygroSensor } from './ThermoHygroSensor';


export class WH32 extends ThermoHygroSensor
{
  constructor(protected readonly platform: EcowittPlatform, protected readonly accessory: PlatformAccessory)
  {
    super(platform, accessory);

    this.setModel('WH32', 'Wireless Outdoor Thermometer and Hygrometer Sensor');
    this.platform.log.debug('WH32 Constructor called');

    this.setName(this.temperatureSensor, 'Outdoor Temperature');
    this.setName(this.humiditySensor, 'Outdoor Humidity');
  }

  update(dataReport, logLevel)
  {
    const batt = dataReport.wh26batt;
    const tempf = dataReport.tempf;
    const humidity = dataReport.humidity;

    this.platform.log.log(logLevel, 'WH32 Update');
    this.platform.log.debug('  batt:', batt);
    this.platform.log.debug('  tempf:', tempf);
    this.platform.log.debug('  humidity:', humidity);

    const lowBattery = batt === '1';

    this.updateTemperature(tempf);
    this.updateStatusLowBattery(this.temperatureSensor, lowBattery);
    this.updateStatusActive(this.temperatureSensor, true);

    this.updateHumidity(humidity);
    this.updateStatusLowBattery(this.humiditySensor, lowBattery);
    this.updateStatusActive(this.humiditySensor, true);
  }
}
