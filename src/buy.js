const axios = require('axios')
const ethers = require('ethers')
require('dotenv').config()

const provider = new ethers.WebSocketProvider(process.env.provider)
const wallet = new ethers.Wallet(process.env.privatekey,provider)

const fetch = async function () {
    const dataList= []
    while(dataList.length == 0){
        const url = "https://api.post.tech/wallet-post/wallet/get-recent-action"
        const resp = await axios.get(url)
        const result = resp.data.data

        
        for (const x of result){
            if (result.indexOf(x) < 3){
                const {value} = x
                const {txHash} = x
                if (value == 0){
                    dataList.push(txHash)
                }
            }
        }
    }
    return queryShares(dataList)

}


const queryShares = async function(list) {
    const sharesList= []
    for(const y of list){
        const txInfo = await provider.getTransaction(y)
        const decode = new ethers.Interface(["function buyShares(address, uint256 )"])
        const data = decode.decodeFunctionData('buyShares', txInfo.data)
        const params = [data[0], 1]
        sharesList.push(params)
    }
    return placeBid(sharesList)
}

const placeBid = async function (params) {
    try {
        const contract = new ethers.Contract('0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC',["function buyShares(address, uint256 )"],wallet)

        for (const z of params) {

            const tx = await contract.buyShares(z[0],z[1],{
                gasLimit: 300000,
                value: 71875000000000
            })
            const txhash = await tx.wait()
            console.log(txhash.hash)
        }
        return start()
    } catch (error) {
        return start()
    }
}

const start = async () => (await fetch())

start()
