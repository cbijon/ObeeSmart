const { InfluxDB } = require("@influxdata/influxdb-client");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;

const client = new InfluxDB({ url: process.env.INFLUX_URL, token: token });

const queryApi = client.getQueryApi(org);

const queryTotalFrelons =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  1970-01-01T00:00:00Z, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_frags")
  |> filter(fn: (r) => r["_field"] == "value")
  |> sum()`;

const queryPoidruche =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -7d, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_load")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
  |> last()`;

const queryLastPoidruche =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_load")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
  |> yield(name: "mean")`;

const queryTemp =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_temperature")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

const queryTempOut =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_temperatureOut")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

const queryTempMiel =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_temperatureMiel")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

const queryHumidity =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_humidity")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

const queryHumidityOut =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_humidityOut")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

  const queryPressureOut =
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_pressure")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;


const queryHarpeStats = (harpeNumber) =>
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_Harpe${harpeNumber}")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

const queryHarpePower = (harpeNumber) =>
  `
from(bucket: "` +
  process.env.INFLUX_BUCKET +
  `")
  |> range(start:  -2h, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "device_frmpayload_data_Harpe${harpeNumber}power")
  |> filter(fn: (r) => r["_field"] == "value")
  |> last()`;

const influxConnect = async () => {
  const frelons = [];
  const poid = [];
  const lastPoid = [];
  const temp = [];
  const tempMiel = [];
  const tempOut = [];
  const humidity = [];
  const humidityOut = [];
  const pressureOut = [];
  const harpeStats = [];
  const harpePower = [];

  await queryApi
    .collectRows(
      queryTotalFrelons /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        frelons.push({ frags: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  await queryApi
    .collectRows(
      queryPoidruche /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        poid.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

    await queryApi
    .collectRows(
      queryLastPoidruche /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        lastPoid.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  await queryApi
    .collectRows(queryTemp /*, you can specify a row mapper as a second arg */)
    .then((data) => {
      data.forEach((x) => {
        temp.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  await queryApi
    .collectRows(
      queryTempMiel /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        tempMiel.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  await queryApi
    .collectRows(
      queryTempOut /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        tempOut.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  await queryApi
    .collectRows(
      queryHumidity /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        humidity.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  await queryApi
    .collectRows(
      queryHumidityOut /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        humidityOut.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

    await queryApi
    .collectRows(
      queryPressureOut /*, you can specify a row mapper as a second arg */
    )
    .then((data) => {
      data.forEach((x) => {
        pressureOut.push({ [x.device_name]: x._value });
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("\nCollect ROWS ERROR");
    });

  // Ajoutez une boucle pour récupérer l'état de chaque harpe
  for (let i = 1; i <= 7; i++) {
    await queryApi
      .collectRows(queryHarpeStats(i))
      .then((data) => {
        data.forEach((x) => {
          harpeStats.push({ [`Harpe${i}`]: x._value });
        });
      })
      .catch((error) => {
        console.error(error);
        console.log(`\nCollect ROWS ERROR for Harpe${i}`);
      });
    await queryApi
      .collectRows(queryHarpePower(i))
      .then((data) => {
        data.forEach((x) => {
          harpePower.push({ [`Harpe${i}power`]: x._value });
        });
      })
      .catch((error) => {
        console.error(error);
        console.log(`\nCollect ROWS ERROR for Harpe${i}`);
      });
  }

  return {
    frelons,
    poid,
    lastPoid,
    temp,
    tempMiel,
    tempOut,
    humidity,
    humidityOut,
    pressureOut,
    harpeStats,
    harpePower,
  };
};

module.exports = influxConnect;
