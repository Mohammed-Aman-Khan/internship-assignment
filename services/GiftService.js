const initializeService = require('../util/initializeService')
const rateLimiter = require('../middleware/rateLimiter')
const Gift = require('../schemas/Gift.model')

const GiftService = initializeService()

const GIFT_SERVICE_ROUTE_CONFIG = [
    {
        route: '/catalog',
        method: 'get',
        routeHandler: async (req, res) => {
            try {
                const allGifts = await Gift.find({})

                res.send({
                    status: true,
                    result: allGifts,
                })
            }
            catch (err) {
                res.send({
                    status: false,
                    error: err.message,
                })
            }
        }
    },
    {
        route: '/addGift',
        method: 'put',
        routeHandler: async (req, res) => {
            try {
                const newGift = new Gift({
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                })

                await newGift.save()

                res.send({
                    status: true,
                })
            }
            catch (err) {
                res.send({
                    status: true,
                    error: err.message,
                })
            }
        }
    }
]

GIFT_SERVICE_ROUTE_CONFIG
    .forEach(({ route, method, routeHandler }) => GiftService[ method ](route, rateLimiter, routeHandler))

module.exports = GiftService