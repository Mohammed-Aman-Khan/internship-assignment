require('dotenv').config()

const os = require('os')
const cluster = require('cluster')
const mongoose = require('mongoose')

const { SERVICES_CONFIG } = require('./services')

const DB_URI = process.env.DB_URI

const startServices = () => {
    SERVICES_CONFIG
        .forEach(({
            serviceName,
            serviceHandler,
            port
        }) => {
            console.log(mongoose.connection.readyState === 1 && `${ process.pid } - ${ serviceName }: : Connected to database`)
            serviceHandler
                .listen(port, err => {
                    if (err) {
                        throw err
                    }
                    else {
                        console.log(`${ process.pid } - ${ serviceName }: : Service Started`)
                    }
                })
        })
}

mongoose
    .connect(DB_URI)
    .then(() => {
        if (os.cpus().length > 1)

            if (cluster.isMaster) {
                os
                    .cpus()
                    .forEach(() => cluster.fork())

                cluster
                    .on(
                        'exit',
                        async (worker, code, signal) => {
                            if (code !== 0 && !worker.exitedAfterDisconnect) {
                                if (mongoose.connection.readyState === 1)
                                    await mongoose.disconnect()
                                cluster.fork()
                            }
                        }
                    )
            }
            else {
                startServices()
            }

        else {
            startServices()
        }
    })
    .catch(err => { throw err })