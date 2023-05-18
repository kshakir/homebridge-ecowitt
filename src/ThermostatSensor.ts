import { Service, PlatformAccessory } from 'homebridge';
import { EcowittPlatform } from './EcowittPlatform';
//import { EcowittAccessory } from './EcowittAccessory';
import * as Utils from './Utils.js';

// Temperature sensor that shows up as a fake Thermostat in homekit
export class ThermostatSensor
{
  protected thermostatSensor: Service;
  private current_temp = 0;
  private current_humidity = 0;

  constructor(protected readonly platform: EcowittPlatform, protected readonly accessory: PlatformAccessory, protected channel: number)
  {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Ecowitt')
      .setCharacteristic(this.platform.Characteristic.ProductData, `${platform.baseStationInfo.frequency}Hz`)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, platform.baseStationInfo.serialNumber)
      .setCharacteristic(this.platform.Characteristic.HardwareRevision, platform.baseStationInfo.hardwareRevision)
      .setCharacteristic(this.platform.Characteristic.SoftwareRevision, platform.baseStationInfo.softwareRevision)
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, platform.baseStationInfo.firmwareRevision);

    this.setModel('ThermostatSensor', 'Temperature Sensor as Thermostat Tile');

    this.platform.log.debug('ThermostatSensor Constructor called');
    this.setSerialNumber(`CH${this.channel}`);

    this.thermostatSensor = this.accessory.getService(this.platform.Service.Thermostat)
       || this.accessory.addService(this.platform.Service.Thermostat);

    const name = this.platform.config?.th?.[`name${this.channel}`];
    this.setName(this.thermostatSensor, name || `CH${this.channel} Temperature`);

    this.thermostatSensor.getCharacteristic(this.platform.Characteristic.CurrentHeatingCoolingState)
      .onGet(this.handleCurrentHeatingCoolingStateGet.bind(this));

    this.thermostatSensor.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .onGet(this.handleTargetHeatingCoolingStateGet.bind(this))
      .onSet(this.handleTargetHeatingCoolingStateSet.bind(this));

    this.thermostatSensor.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));//Temp

    this.thermostatSensor.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.handleCurrentHumidityGet.bind(this));//Humidity

    this.thermostatSensor.getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .onGet(this.handleTargetTemperatureGet.bind(this))
      .onSet(this.handleTargetTemperatureSet.bind(this));

    this.thermostatSensor.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
      .onGet(this.handleTemperatureDisplayUnitsGet.bind(this))
      .onSet(this.handleTemperatureDisplayUnitsSet.bind(this));
  }

  update(dataReport)
  {
    let tempc = 0;
    let humidity = 0;

    if (this.channel === 1100)
    {
      tempc = Utils.toCelcius(dataReport.tempinf);
      humidity = dataReport.humidityin;
    }
    else
    {
      tempc = Utils.toCelcius(dataReport[`temp${this.channel}f`]);
      humidity = dataReport[`humidity${this.channel}`];
    }
    this.platform.log.info(`Thermostat Channel ${this.channel} Update`);
    this.platform.log.debug('  tempc:', tempc);
    this.platform.log.debug('  humidty:', humidity);
    this.current_temp = tempc;
    this.current_humidity = humidity;
    this.thermostatSensor.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, tempc);
    this.thermostatSensor.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, humidity);
  }

  /**
   * Handle requests to get the current value of the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateGet()
  {
    this.platform.log.debug('Triggered GET TargetHeatingCoolingState');
    // set this to a valid value for TargetHeatingCoolingState
    const currentValue = this.platform.Characteristic.TargetHeatingCoolingState.OFF;
    return currentValue;
  }

  /**
   * Handle requests to set the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateSet(value)
  {
    this.platform.log.debug('Triggered SET TargetHeatingCoolingState:', value);
  }

  /** ***************************************************************
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentTemperatureGet()
  {
    this.platform.log.debug('Triggered GET CurrentTemperature');
    // set this to a valid value for CurrentTemperature
    const currentValue = this.current_temp;
    return currentValue;
  }

  handleCurrentHumidityGet()
  {
    this.platform.log.debug('Triggered GET CurrentHumidity');
    // set this to a valid value for CurrentHumidity
    const currentValue = this.current_humidity;
    return currentValue;
  }

  /**
   * Handle requests to get the current value of the "Target Temperature" characteristic
   */
  handleTargetTemperatureGet()
  {
    this.platform.log.debug('Triggered GET TargetTemperature');
    // set this to a valid value for TargetTemperature
    const currentValue = 20;
    return currentValue;
  }

  /**
   * Handle requests to set the "Target Temperature" characteristic
   */
  handleTargetTemperatureSet(value)
  {
    this.platform.log.debug('Triggered SET TargetTemperature:', value);
  }

  /**
   * Handle requests to get the current value of the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsGet()
  {
    this.platform.log.debug('Triggered GET TemperatureDisplayUnits');
    const currentValue = this.platform.Characteristic.TemperatureDisplayUnits.CELSIUS;
    return currentValue;
  }

  /**
   * Handle requests to set the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsSet(value)
  {
    this.platform.log.debug('Triggered SET TemperatureDisplayUnits:', value);
  }

  /**
   * Handle requests to get the current value of the "Current Heating Cooling State" characteristic
   */
  handleCurrentHeatingCoolingStateGet()
  {
    this.platform.log.debug('Triggered GET CurrentHeatingCoolingState');
    const currentValue = this.platform.Characteristic.CurrentHeatingCoolingState.OFF;
    return currentValue;
  }

  setModel(model: string, name: string)
  {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, model)
      .setCharacteristic(this.platform.Characteristic.Name, name);
  }

  setSerialNumber(serialNumber: string)
  {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.SerialNumber, serialNumber);
  }

  setName(service: Service, name: string)
  {
    service.setCharacteristic(this.platform.Characteristic.Name, name);
  }
}