import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  Formats,
  HAP,
  Logging,
  Perms,
  Service,
  Units} from "homebridge";

let hap: HAP;

const SolisInverterClient: any = require('solis-inverter/lib/solis_inverter_client');

export = (api: API) => {
  hap = api.hap;
  api.registerAccessory("Solis PV Inverter Homebridge Plugin", SolisInverter);
};

class SolisInverter implements AccessoryPlugin {

  private readonly log: Logging;  
  private readonly name: string;
  private readonly address: string;
  private readonly username: string
  private readonly password: string;
  private readonly interval: number;
  private readonly solisInverterClient: any;

  private generatedToday: number;
  private currentlyGenerating: number;

  private readonly inverterService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig) {
    this.log = log;
    this.name = config.name;
    this.generatedToday = 0
    this.currentlyGenerating = 0;

    this.interval = <number>config.interval;
    this.address = <string>config.hostname;
    this.username = <string>config.username;
    this.password = <string>config.password;
    this.solisInverterClient = new SolisInverterClient(this.address, this.username, this.password)

    this.fetchData().then(() => setInterval(this.fetchData, this.interval * 1000))

    this.inverterService = new hap.Service(this.name, hap.Service.Outlet.UUID,)
    this.inverterService.addCharacteristic(
      new hap.Characteristic("Current Generation", "E863F10D-079E-48FF-8F27-9C2605A29F52",
      { format: Formats.UINT16,
        unit: <Units>'Watts',
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
      }))
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Currently generating: " + this.currentlyGenerating);
        callback(undefined, this.currentlyGenerating);
      })
    this.inverterService.addCharacteristic(
      new hap.Characteristic("Today's Generation", "E863F10C-079E-48FF-8F27-9C2605A29F52",
      { format: Formats.FLOAT,
        unit: <Units>'kWh',
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
      }))
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Today's generation: " + this.generatedToday);
        callback(undefined, this.generatedToday);
      })
    
    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Solis")
      .setCharacteristic(hap.Characteristic.Model, "Inverter");

    log.info("Solis Inverter HomeKit interface finished initializing!");
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.inverterService,
    ];
  }

  fetchData(): any {
    this.solisInverterClient.fetchData()
      .then((data: any) => {
        if (data.inverter.serial) {
          this.generatedToday = data.energy.today;
          this.currentlyGenerating = data.power
        }
      })
      .catch((err: any) => this.log.error(JSON.stringify(err)));
    }
}