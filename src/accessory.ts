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
import SolisInverterClient = require('solis-inverter/lib/solis_inverter_client');
import { InverterDataFrame } from "./types/inverterDataFrame";

let hap: HAP;
export = (api: API): void => {
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
  private readonly solisInverterClient: SolisInverterClient;

  private on: boolean;
  private generating: boolean;
  private generatedToday: number;
  private currentlyGenerating: number;

  private readonly inverterService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig) {
    this.log = log;
    this.name = config.name;
    this.on = false;
    this.generating = false;
    this.generatedToday = 0
    this.currentlyGenerating = 0;

    this.interval = <number>config.interval;
    this.address = <string>config.hostname;
    this.username = <string>config.username;
    this.password = <string>config.password;
    this.solisInverterClient = new SolisInverterClient(this.address, this.username, this.password)

    this.fetchData().then(() => setInterval(this.fetchData, this.interval * 1000))

    this.inverterService = new hap.Service(this.name, hap.Service.Outlet.UUID,)
    this.inverterService.addCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info(`Inverter State: ${this.on ? "On" : "Off"}`)
        callback(undefined, this.on ? 1 : 0)
      })
    this.inverterService.addCharacteristic(hap.Characteristic.OutletInUse)
    .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
      log.info(`Inverter In Use (generating): ${this.generating ? "Yes" : "No"}`)
      callback(undefined, this.generating ? 1 : 0)
    })
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

  async fetchData(): Promise<InverterDataFrame> {
    this.generating = false;
    this.on = false;
    try {
      return await this.solisInverterClient.fetchData()
      .then((data: InverterDataFrame) => {
        this.log.debug(JSON.stringify(data))
        if (data.inverter.serial) {
          this.on = true
          this.generatedToday = data.energy.today;
          this.currentlyGenerating = data.power
          if(data.power > 0)
            this.generating = true;
        }
      })
      .catch((err: unknown) => this.log.error(JSON.stringify(err)));
    } catch {
      return {
        lastSeen: 0,
        inverter: {
          model: "",
          serial: "",
          firmwareMain: "",
          firmwareSlave: ""
        },
        logger: {
          serial: "",
          version: "",
          mode: "",
          ap: {
            ssid: "",
            ip: "",
            mac: ""
          },
          sta: {
            ssid: "",
            ip: "",
            mac: "",
            rssi: ""
          }
        },
        remoteServer: {
          a: false,
          b: false
        },
        power: 0,
        energy: {
          today: 0,
          total: 0
        }
      }
    }
  }
}