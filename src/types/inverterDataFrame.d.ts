export type InverterDataFrame = {
    lastSeen: number,
    inverter: {
        model: string,
        serial: string,
        firmwareMain: string,
        firmwareSlave: string
    },
    logger: {
        serial: string,
        version: string,
        mode: string,
        ap: {
        ssid: string,
        ip: string,
        mac: string
        },
        sta: {
        ssid: string,
        ip: string,
        mac: string,
        rssi: string
        }
    },
    remoteServer: {
        a: boolean,
        b: boolean
    },
    power: number,
    energy: {
        today: number,
        total: number
    }
}