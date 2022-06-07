const Web3 = require('web3')
require('dotenv').config()
const urlwss = process.env.INFURA_URL

const options = {
    timeout: 30000,
    clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 15,
        onTimeout: false,
    },
}

const web3 = new Web3(new Web3.providers.WebsocketProvider(urlwss, options))
const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err)
})

async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms))
}

const mempoolMonitoring = function (delayms) {
    subscription.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                await delay(delayms)
                if (await web3.eth.getTransaction(txHash)) {
                    let tx = await web3.eth.getTransaction(txHash)
                    console.log(tx)
                } else {
                    await delay(delayms)
                    if (await web3.eth.getTransaction(txHash)) {
                        let tx = await web3.eth.getTransaction(txHash)
                        console.log(tx)
                    }
                }
            } catch (err) {
                console.error(err)
            }
        })
    })
}

mempoolMonitoring(20000)