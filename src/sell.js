const axios = require("axios");
const ethers = require("ethers");
const { Alchemy, Network, fromHex } = require("alchemy-sdk");
require("dotenv").config();

const config = {
  apiKey: "ptdQezDinbQE_dIzDAKA0XOaFlYnNo2x",
  network: Network.ARB_MAINNET,
};
const alchemy = new Alchemy(config);
const provider = new ethers.WebSocketProvider(
  "wss://arb-mainnet.g.alchemy.com/v2/ptdQezDinbQE_dIzDAKA0XOaFlYnNo2x"
);
const wallet = new ethers.Wallet(
  "0x912cefd65050fd1e85a4623a37e3c2f970dff88f4aaa1bf47c67a53c72ed92a5",
  provider
);
const fromAddress = "0x1310cbf77ec2f8c7745739e64dc2df8860bcf07e";
const abi =
  '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"address","name":"subject","type":"address"},{"indexed":false,"internalType":"bool","name":"isBuy","type":"bool"},{"indexed":false,"internalType":"uint256","name":"shareAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"protocolEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"subjectEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"holderEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referralEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"supply","type":"uint256"}],"name":"Trade","type":"event"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyShares","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getBuyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getBuyPriceAfterFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"supply","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getSellPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getSellPriceAfterFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"holderAndReferralFeeDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"holderFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFeeDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referralFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sellShares","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeDestination","type":"address"}],"name":"setFeeDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeDestination","type":"address"}],"name":"setHolderFeeDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"setProtocolFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"setSubjectFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"sethHolderFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"sethReferralFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"sharesBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"sharesSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"subjectFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]';

const contract = new ethers.Contract(
  "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC",
  abi,
  wallet
);

// Main function to fetch all transactions for an address
const main = async () => {
  try {
    // Get all transactions for an address from block 0 and store in txns
    const txns = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: fromAddress,
      category: ["external"],
    });

    const { transfers } = txns;
    const hashList = [];
    for (const x of transfers) {
      const { value } = x;
      //0.000071875
      if (value >= 0.000071875) {
        const { hash } = x;
        hashList.push(hash);
      }
    }
    return queryShares(hashList);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
  }
};

const queryShares = async function (list) {
  try {
    const sharesList = [];
    const txPromises = [];
    for (const y of list) {
      const txInfo = provider.getTransaction(y);
      txPromises.push(txInfo);
    }

    const txResult = await Promise.all(txPromises);
    for (const h of txResult) {
      if (list.indexOf(h) < 900) {
        const decode = new ethers.Interface([
          "function buyShares(address, uint256 )",
        ]);
        const data = decode.decodeFunctionData("buyShares", txInfo.data);
        const params = [data[0], 1];
        if (!sharesList.includes(params)) {
          sharesList.push(params);
        }
      }
    }

    const verifiedSharesList = [];
    for (const m of sharesList) {
      const verifyInfo = await contract.sharesBalance(m[0], fromAddress);
      const number = parseInt(verifyInfo.toString());
      if (number >= 1) {
        verifiedSharesList.push(m);
      }
    }

    const reverseList = verifiedSharesList.reverse();
    return createSell(reverseList);
  } catch (error) {
    console.log(error);
    return start();
  }
};

const placeSell = async function (raw) {
  try {
    let data = {
      rawData: raw,
      value: 0,
      to: "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC",
      //0.00006250
      //0.00025
      price: 0.00025,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.post.tech/wallet-post/wallet/send-transaction",
      headers: {
        Authorization:
          "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkNWM1ZTlmNTdjOWI2NDYzYzg1ODQ1YTA4OTlhOWQ0MTI5MmM4YzMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0aGV1cyBNLiAoU2lubmVycz8pIPCflbjvuI8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzE2NDI5MzQ3MTYwNzk2NjkyNDkvTUpQejJkX3dfbm9ybWFsLmpwZyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wb3N0LXRlY2gtcHJvZCIsImF1ZCI6InBvc3QtdGVjaC1wcm9kIiwiYXV0aF90aW1lIjoxNjk2MDUzOTA2LCJ1c2VyX2lkIjoiVEx1TFZxV1gyWGUxbWNraWxrRkJuYTZXb1pUMiIsInN1YiI6IlRMdUxWcVdYMlhlMW1ja2lsa0ZCbmE2V29aVDIiLCJpYXQiOjE2OTYyMDg4MzEsImV4cCI6MTY5NjIxMjQzMSwiZW1haWwiOiJncy5tYXRoLm1tQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJ0d2l0dGVyLmNvbSI6WyIzNDM4NTg3MzI3Il0sImVtYWlsIjpbImdzLm1hdGgubW1AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoidHdpdHRlci5jb20ifX0.wSPAWBXT9iJ16gRHx-ceehWIclB6J5yBl6BGdPhfsEdMdp9-NY-kj_vE6OuwOTR91wwJdxh_pqaZFxQNfXT2LGw9ahfv_KNiIcKk5TXAMxzNBfS0AJ9-pp-ZSc25Dq6Zo3g8hK1RTAu1VSCF4XxnShNd6s8L1YCsstY-5y9qjVa03ocSrgf6mZOXPD5m8XiJ0uscaNaszyxqNVwfnf4dKnzXHr_AjEUN3bJD4-sNQ60ZEUlrkiubxKo0TUdzURK2a8iiNS32RuaTuHUCzDP2eG4y9yqSZa774NE9Nq1f6e4g0RebOL7EEWT2EbWDh_PF7XlcwgkWcaoXoykpYmxIGg",
        "Content-Type": " application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    const result = JSON.stringify(response.data.data.tx_hash);
    console.log(`\n${result}`);
  } catch (error) {
    if (error.response.status == 400) {
      const log = console.log("\n", error.response.data.message);
      return log;
    } else if (error.response.status == 401) {
      console.log("\n", error.response.data.message);
    }
  }
};

const createSell = async function (params) {
  try {
    for (const z of params) {
      const info = await contract.getSellPrice(z[0], z[1]);
      const numberInfo = parseInt(info.toString());
      if (numberInfo >= 250000000000000) {
        console.log("\nTem um no preço.");
        const data = contract.interface.encodeFunctionData("sellShares", [
          z[0],
          z[1],
        ]);
        await placeSell(data);
      } else {
        continue;
      }
    }
  } catch (error) {
    return main();
  }
};

const start = async function () {
  while (true) {
    console.log("\nIniciando.");
    await main();
    console.log("\nAguardando.");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log("\nPróximo loop.");
  }
};

start();
