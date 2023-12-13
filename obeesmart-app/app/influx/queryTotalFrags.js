const { InfluxDB } = require('@influxdata/influxdb-client');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js')[env];

const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG

const client = new InfluxDB({ url: process.env.INFLUX_URL, token: token })

const queryApi = client.getQueryApi(org)


const query = `
from(bucket: "`+process.env.INFLUX_BUCKET+`")
  |> range(start:  1970-01-01T00:00:00Z, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_frags")
  |> filter(fn: (r) => r["_field"] == "value")
  |> sum()`

/*
const queryold = `
from(bucket: "`+process.env.INFLUX_BUCKET+`")
|> range(start: -48h, stop: now())
|> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_frags")
|> filter(fn: (r) => r["_field"] == "value")`
*/
const influxConnect = async () => {
    const total = [];
    
    await queryApi
        .collectRows(query /*, you can specify a row mapper as a second arg */)
        .then(data => {
            data.forEach((x) => {
                total.push({ FraggedHornet: x._value });    
            })
        
        })
        .catch(error => {
            console.error(error)
            console.log('\nCollect ROWS ERROR')
        })
    return ({ total })

}

module.exports = influxConnect