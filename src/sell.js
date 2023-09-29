const axios = require('axios')
const ethers = require('ethers')
const { Alchemy, Network, fromHex } = require("alchemy-sdk");
require('dotenv').config()

const config = {
    apiKey: "ptdQezDinbQE_dIzDAKA0XOaFlYnNo2x",
    network: Network.ARB_MAINNET,
  };
const alchemy = new Alchemy(config);
const provider = new ethers.WebSocketProvider(process.env.provider)
const wallet = new ethers.Wallet(process.env.privatekey,provider)
const fromAddress = "0x1310cbf77ec2f8c7745739e64dc2df8860bcf07e"


// Main function to fetch all transactions for an address
const main = async () => {
    try {
        // Get all transactions for an address from block 0 and store in txns
        const txns = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: fromAddress,
        category: ["external"],
        });

        const {transfers} = txns
        const hashList = []
        for(const x of transfers){
            const {value} = x
            if(value == 0.000071875){
                const {hash} = x
                hashList.push(hash)
            }
        }
        return queryShares(hashList)
    } catch (error) {
        console.error('Error fetching transaction history:', error);
    }
}

const queryShares = async function(list) {
    const sharesList= []
    for(const y of list){
        if (list.indexOf(y) < 20) {
            const txInfo = await provider.getTransaction(y)
            const decode = new ethers.Interface(["function buyShares(address, uint256 )"])
            const data = decode.decodeFunctionData('buyShares', txInfo.data)
            const params = [data[0], 1]
            sharesList.push(params)
        }
    }
    return createSell(sharesList)
}


const createSell = async function (params) {
    try {
        const contractGetPrice = new ethers.Contract('0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC',["function getSellPrice(address, uint256)"],wallet)
  
        for (const z of params) {

            const info = await contractGetPrice.getSellPrice(z[0],z[1])
            if(info == 250000000000000){
                console.log('\nTem um no preço.')
                const contract = new ethers.Contract('0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC',["function sellShares(address, uint256 )"],wallet)

                for (const a of params) {
        
                    const tx = await contract.sellShares(a[0],a[1],{
                        gasLimit: 300000
                    })
                    const txhash = await tx.wait()
                    console.log(txhash.hash)
                }
            } else {
                continue
            }
        }
    } catch (error) {
        return main()
    }
}

const start = async function(){
    while(true){
        console.log('\nIniciando.')
        await main();
        console.log('\nAguardando.')
        await new Promise (resolve => setTimeout(resolve, 1000*60*5))
        console.log('\nPróximo loop.')
    }
}


start()