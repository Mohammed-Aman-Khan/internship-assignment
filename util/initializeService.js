const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const express = require('express')

module.exports = () => {

    const ExpressService = express()

    ExpressService.use(cors())
    ExpressService.use(helmet())
    ExpressService.use(compression())
    ExpressService.use(express.json())

    return ExpressService

}