<span align="center">

# Homebridge Solis Plugin

<a href="https://www.npmjs.com/package/homebridge-solis"><img title="npm version" src="https://badgen.net/npm/v/homebridge-solis" ></a>
<a href="https://www.npmjs.com/package/homebridge-solis"><img title="npm downloads" src="https://badgen.net/npm/dt/homebridge-solis" ></a>

</span>

<img src="https://github.com/simonarnell/homebridge-solis/blob/resources/inverter.jpg" align="right" alt="inverter">

**Homebridge-solis** is a [homebridge](https://homebridge.io) plugin that collects solar panel generation data from [Solis PV inverters](https://www.ginlong.com/) with attached [data logging sticks](https://www.ginlong.com/accessories2/1083.html) and publishes the collected data to the Apple [HomeKit](https://developer.apple.com/homekit/) ecosystem.

Due to Apple's HomeKit currently only natively supporting a limited set of service types and specifically not domestic energy generation equipment, the inverters are modelled as [outlets](https://developer.apple.com/documentation/homekit/hmservicetypeoutlet). Whilst outlets are modelled in Apple's [Home](https://www.apple.com/uk/ios/home/) app on iOS and macOS, it is only to the degree of representing and allowing modification of their state (on/off). 

Fortunately [Eve](https://www.evehome.com/en)'s [app](https://www.evehome.com/en/eve-app) supports their own smart outlets that extend the HomeKit API to publish consumption data. The plugin, uses these consumption characteristics to represent PV generation data. In the Eve app, the inverter appears as an outlet that switches on and off according to the sun's intensity and its ability to energise the inverter, in addition the energy generated appears as consumption data.

<img src="https://github.com/simonarnell/homebridge-solis/blob/resources/eve.png" align="center" alt="eve app">