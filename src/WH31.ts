import { PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
import { ThermoHygroSensor } from './ThermoHygroSensor';


export class WH31 extends ThermoHygroSensor
{
  constructor(protected readonly platform: EcowittPlatform,
            protected readonly accessory: PlatformAccessory,
            protected channel: number)
  {
    super(platform, accessory);

    this.setModel('WH31', 'Wireless Multi-channel Thermometer and Hygrometer Sensor');
    this.setSerialNumber(`CH${this.channel}`);
    this.platform.log.debug('WH31 Constructor called');

    const name = this.platform.config?.th?.[`name${this.channel}`];

    this.setName(this.temperatureSensor, name || `CH${this.channel} Temperature`);
    this.setName(this.humiditySensor, name || `CH${this.channel} Humidity`);
  }

  update(dataReport, logLevel)
  {
    const batt = dataReport[`batt${this.channel}`];
    const tempf = dataReport[`temp${this.channel}f`];
    const humidity = dataReport[`humidity${this.channel}`];

    this.platform.log.log(logLevel, `WH31 Channel ${this.channel} Update`);
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
