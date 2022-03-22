const initializeService = require('../util/initializeService')
const rateLimiter = require('../middleware/rateLimiter')
const GiftBox = require('../schemas/GiftBox.model')

const GiftBoxService = initializeService()

const GIFTBOX_SERVICE_ROUTE_CONFIG = [
    {
        route: '/createGiftbox',
        method: 'put',
        routeHandler: async (req, res) => {
            try {
                const newGiftBox = new GiftBox({
                    name: req.body.name,
                    creatorId: req.body.creatorId,
                    gifts: req.body.gifts,
                    creationTimeStamp: Date(),
                    upvotes: [],
                    downvotes: [],
                })

                await newGiftBox.save()

                res.send({
                    status: true,
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
        route: '/getBuddysGiftBoxes/:buddyId',
        method: 'get',
        routeHandler: async (req, res) => {
            try {
                const result = await GiftBox.find(
                    { creatorId: req.params.buddyId },
                    { __v: false }
                )

                res.send({
                    status: true,
                    result,
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
        route: '/vote',
        method: 'post',
        routeHandler: async (req, res) => {
            try {
                if (![ 'upvote', 'downvote' ].includes(req.body.voteType))
                    throw new Error('Invalid Vote Type')

                const { creationTimeStamp } = await GiftBox.findOne({ _id: req.body.giftBoxId })

                if ((new Date() - new Date(creationTimeStamp)) <= (24 * 60 * 60 * 1000)) {
                    const result = await GiftBox.updateOne(
                        { _id: req.body.giftBoxId },
                        { $push: { upvotes: req.body.buddyId } }
                    )

                    if (result.modifiedCount) {
                        res.send({
                            status: true,
                        })
                    }
                    else {
                        res.send({
                            status: false,
                            error: 'Internal Error'
                        })
                    }
                }
                else {
                    res.send({
                        status: false,
                        error: 'Voting duration is completed'
                    })
                }
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
        route: '/getVotes/:creatorId',
        method: 'get',
        routeHandler: async (req, res) => {
            try {
                const result = await GiftBox.find(
                    { creatorId: req.params.creatorId },
                    { creationTimeStamp: false },
                )

                result.sort((a, b) => a.upvotes.length - b.upvotes.length)

                res.send({
                    status: true,
                    result: result.map(giftBox => ({
                        ...giftBox,
                        upvotesCount: giftBox.upvotes.length,
                        downvotesCout: giftBox.downvotes.length
                    })),
                })
            }
            catch (err) {
                res.send({
                    status: false,
                    error: err.message,
                })
            }
        }
    }
]

GIFTBOX_SERVICE_ROUTE_CONFIG
    .forEach(({ route, method, routeHandler }) => GiftBoxService[ method ](route, rateLimiter, routeHandler))

module.exports = GiftBoxService