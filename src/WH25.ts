import { PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
import { ThermoHygroBaroSensor } from './ThermoHygroBaroSensor';


export class WH25 extends ThermoHygroBaroSensor
{
  constructor(protected readonly platform: EcowittPlatform, protected readonly accessory: PlatformAccessory)
  {
    super(platform, accessory);

    this.setModel('WH25', 'Indoor Temperature, Humidity and Barometric Sensor');

    this.setName(this.temperatureSensor, 'Indoor Temperature');
    this.setName(this.humiditySensor, 'Indoor Humidity');
  }

  update(dataReport)
  {
    this.platform.log.info('WH25 Update');
    this.platform.log.debug('  wh25batt:', dataReport.wh25batt);
    this.platform.log.debug('  tempinf:', dataReport.tempinf);
    this.platform.log.debug('  humidityin:', dataReport.humidityin);
    this.platform.log.debug('  baromrelin', dataReport.baromrelin);
    this.platform.log.debug('  baromabsin', dataReport.baromabsin);

    const lowBattery = dataReport.wh25batt === '1';

    this.updateTemperature(dataReport.tempinf);
    this.updateStatusLowBattery(this.temperatureSensor, lowBattery);

    this.updateHumidity(dataReport.humidityin);
    this.updateStatusLowBattery(this.humiditySensor, lowBattery);

    this.updateAbsolutePressure(dataReport.baromabsin);
    this.absolutePressureSensor.updateStatusLowBattery(lowBattery);

    this.updateRelativePressure(dataReport.baromrelin);
    this.relativePressureSensor.updateStatusLowBattery(lowBattery);
  }
}

