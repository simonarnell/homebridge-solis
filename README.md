<span align="center">

# Homebridge Solis Plugin

<a href="https://www.npmjs.com/package/homebridge-solis"><img title="npm version" src="https://badgen.net/npm/v/homebridge-solis" ></a>
<a href="https://www.npmjs.com/package/homebridge-solis"><img title="npm downloads" src="https://badgen.net/npm/dt/homebridge-solis" ></a>

</span>

<img src="https://github.com/simonarnell/homebridge-solis/blob/resources/inverter.jpg" align="right" alt="inverter">

## About

**Homebridge-solis** is a [homebridge](https://homebridge.io) plugin that collects solar panel generation data from [Solis PV inverters](https://www.ginlong.com/) with attached [data logging sticks](https://www.ginlong.com/accessories2/1083.html) and publishes the collected data to the Apple [HomeKit](https://developer.apple.com/homekit/) ecosystem.

## Background

Due to Apple's HomeKit currently only natively supporting a limited set of service types and specifically not domestic energy generation equipment, the inverters are modelled as [outlets](https://developer.apple.com/documentation/homekit/hmservicetypeoutlet). Whilst outlets are modelled in Apple's [Home](https://www.apple.com/uk/ios/home/) app on iOS and macOS, it is only to the degree of representing and allowing modification of their state (on/off). 

Fortunately [Eve](https://www.evehome.com/en)'s [app](https://www.evehome.com/en/eve-app) supports their own smart outlets that extend the HomeKit API to publish consumption data. The plugin, uses these consumption characteristics to represent PV generation data. In the Eve app, the inverter appears as an outlet that switches on and off according to the sun's intensity and its ability to energise the inverter, in addition the energy generated appears as consumption data.

<img src="https://github.com/simonarnell/homebridge-solis/blob/resources/eve.png" align="left" alt="eve app">

## Instructions

### GUI

Install an instance of [homebridge](https://homebridge.io) on your network. If you prefer a graphical interface install [Homebridge Config UI X](https://github.com/oznu/homebridge-config-ui-x#readme). 

Once installed, login to the interface and scan the QR code with your iPhone, this will start the process to add the homebridge to your Apple Home instance. 

Once added, login back into the Homebridge Comfig UI X interface, click plugins from the menu, type `solis` as the search term, click install next to the plugin called `homebridge-solis`. You will be asked to provide the IP address and credentials to your inverter's data logging stick. 

Assuming it's daylight outside, the app should start collecting data immediately, open the Eve [app](https://www.evehome.com/en/eve-app) and select the inverter - its generation data, albeit labelled as consumption data, should be visible as per the above screenshot.

### Configuration

Alternatively the plugin can be configured within the homebridge `config.json`. The following is an example configuration:
```
{
  "accessories": [{
    "name": "Solis PV Inverter",
    "username": "",
    "password": "",
    "hostname": "",
    "interval": 30,
    "accessory": "Solis PV Inverter Homebridge Plugin"
  }]
}
```

The username, password and hostname properties all relate to the details associated with the inverter data logging stick.
