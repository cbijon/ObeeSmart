const { InfluxDB } = require('@influxdata/influxdb-client');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js')[env];

const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG

const client = new InfluxDB({ url: process.env.INFLUX_URL, token: token })

const queryApi = client.getQueryApi(org)


const query1 = `
from(bucket: "`+process.env.INFLUX_BUCKET+`")
  |> range(start:  1970-01-01T00:00:00Z, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_frags")
  |> filter(fn: (r) => r["_field"] == "value")
  |> filter(fn: (r) => r["application_name"] == "ObeePowerWatch")
  |> sum()`

const query = `
from(bucket: "`+process.env.INFLUX_BUCKET+`")
|> range(start: -48h, stop: now())
|> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_frags")
|> filter(fn: (r) => r["_field"] == "value")`

const influxConnect = async () => {
    const scatterData = [];
    const lineBarData = [];
    await queryApi
        .collectRows(query /*, you can specify a row mapper as a second arg */)
        .then(data => {
            data.forEach((x) => {
                scatterData.push({ x: new Date(x._time).getHours(), y: x._value });
                lineBarData.push({ x: x._time, y: x._value })
            })
            //console.log('\nCollect ROWS SUCCESS')
        })
        .catch(error => {
            console.error(error)
            console.log('\nCollect ROWS ERROR')
        })
    return ({ scatterData, lineBarData })

}

module.exports = influxConnect