/* MQTT configuration for sensors's data transfer to a database. */
var mqtt_config = {
    host: "",
    port: 1883,
    username: "",
    password: "",
    protocolId: 'MQIsdp',
    protocolVersion: 3
};

module.exports.mqtt_config = mqtt_config;