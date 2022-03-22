const UserService = require("./UserService")
const GiftService = require("./GiftService")
const GiftBoxService = require("./GiftBoxService")

const SERVICES_CONFIG = [
    {
        serviceName: 'user-service',
        serviceHandler: UserService,
        port: 10001,
    },
    {
        serviceName: 'gift-service',
        serviceHandler: GiftService,
        port: 10002,
    },
    {
        serviceName: 'giftbox-service',
        serviceHandler: GiftBoxService,
        port: 10003,
    },
]

module.exports = {
    SERVICES_CONFIG,
}