const SolisInverterClient: any = require('solis-inverter/lib/solis_inverter_client');

const interval: number = (() => {
  let envVar:number = parseInt(<string>process.env["INTERVAL"]) 
  if(isNaN(envVar) || envVar < 30)
    return 30
  else 
    return envVar
})()

const address: string = <string>process.env.SOLIS_ADDRESS
const username: string = <string>process.env.SOLIS_USERNAME
const password: string = <string>process.env.SOLIS_PASSWORD

if (!address) {
  console.error('address not given')
  process.exit(1)
}

const inverter = new SolisInverterClient(address, username, password)

const fetchData = () => inverter.fetchData()
  .then((data: { inverter: { serial: any; }; }) => {
    if (data.inverter.serial) {
      // only store valid responses
      console.log(JSON.stringify(data))
    }
  })
  .catch((err: any) => console.log(JSON.stringify(err)))

  fetchData().then(() => setInterval(fetchData, interval * 1000))

  console.log(interval*1000)