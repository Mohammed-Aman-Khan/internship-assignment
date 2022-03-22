const initializeService = require('../util/initializeService')
const rateLimiter = require('../middleware/rateLimiter')
const User = require('../schemas/User.model')

const UserService = initializeService()

const USER_SERVICE_ROUTE_CONFIG = [
    {
        route: '/registerUser',
        method: 'put',
        routeHandler: async (req, res) => {
            try {
                const newUser = new User({
                    name: req.body.name,
                    buddies: [],
                    giftBoxes: []
                })

                await newUser.save()

                res.send({
                    status: true
                })
            }
            catch (err) {
                res.send({
                    status: false,
                    error: err.message
                })
            }
        }
    },
    {
        route: '/addBuddy',
        method: 'post',
        routeHandler: async (req, res) => {
            try {
                const result = await User.updateOne(
                    { _id: req.body.myId },
                    { $push: { buddies: req.body.buddyId } }
                )

                if (result.modifiedCount) {
                    res.send({
                        status: true
                    })
                }
                else {
                    res.send({
                        status: false,
                        error: 'Internal Error'
                    })
                }
            }
            catch (err) {
                res.send({
                    status: true,
                    error: err.message
                })
            }
        }
    }
]

USER_SERVICE_ROUTE_CONFIG
    .forEach(({ route, method, routeHandler }) => UserService[ method ](route, rateLimiter, routeHandler))

module.exports = UserService