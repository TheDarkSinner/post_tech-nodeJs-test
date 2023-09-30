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
  "0x95c0ad928e5701e6b460995422ba93ddf9bb0f9fb14a3df93b80a37a91cdf9ad",
  provider
);
const fromAddress = "0x4c00ee4f0dc2f9366864ec8c80f4ea905bb82074";
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
    for (const y of list) {
      if (list.indexOf(y) < 1500) {
        const txInfo = await provider.getTransaction(y);
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
    return start();
  }
};

const placeSell = async function (raw) {
  try {
    let data = {
      rawData: raw,
      value: 0,
      to: "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC",
      price: 0.00025,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.post.tech/wallet-post/wallet/send-transaction",
      headers: {
        Authorization:
          "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkNWM1ZTlmNTdjOWI2NDYzYzg1ODQ1YTA4OTlhOWQ0MTI5MmM4YzMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0aGV1cyBPbGl2ZWlyYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNDc0Qy1ndGh2QzlaRWxmSUFvTFdiRk9ydmFSY3VrSjJnV0p4WE5ldDA9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9zdC10ZWNoLXByb2QiLCJhdWQiOiJwb3N0LXRlY2gtcHJvZCIsImF1dGhfdGltZSI6MTY5NjEwMDYxNCwidXNlcl9pZCI6IkM3cGlQZ0xIc01XU1dtcHRJSXc1cngxYjZQbzEiLCJzdWIiOiJDN3BpUGdMSHNNV1NXbXB0SUl3NXJ4MWI2UG8xIiwiaWF0IjoxNjk2MTAwNjE0LCJleHAiOjE2OTYxMDQyMTQsImVtYWlsIjoib2dvcmRvMDA4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InR3aXR0ZXIuY29tIjpbIjE0NTU1NTI5OTAwMzU3MjIyNTAiXSwiZ29vZ2xlLmNvbSI6WyIxMDU0NTE3ODUxNjM4Mjg5Mzg0ODUiXSwiZW1haWwiOlsib2dvcmRvMDA4QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InR3aXR0ZXIuY29tIn19.ZsmlC_W0n-q4WPZkMKr0bV_BE7XT-j85r80aCIDzfucKas23bymFxal4z2xImct0khomqpJgYDOJL_O6pZy5umXDkeGVfyuHhy5Ky0GFLBKqUU76K6ZjYgMAMsFg6-lhk1mOU98dchbOgKCrJ3FE1ymQDHuwWufYL5l4nAyYXbCDXJ8xMFJL-6KgrmxbC7TgpklROjUyX_kM6UzD9gx5zi6XPZTyT3-OsXWFr7vBJ9Mzx6wBfTts6ef3t4wgudy3vudUHBY9ootLWcif5APmS3OdfzJxtRdr3jEbEP6qjAt8PRo4qjlfl8FnFKz3j0aeHblEwxa_5lQxGcn1Bck1cA",
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
