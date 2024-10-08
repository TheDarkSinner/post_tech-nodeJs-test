const axios = require("axios");
const ethers = require("ethers");
const { getToken } = require("./refreshToken");
require("dotenv").config();

// Infura é um serviço de infraestrutura Ethereum que permite acesso à rede Ethereum.
const importProvider = process.env.provider;

// Seu endereço Ethereum e o contrato com o método específico que você deseja rastrear.

const seuEndereco = process.env.seuEndereco;
const contratoEndereco = "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC";
const contratoAbi =
  '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"address","name":"subject","type":"address"},{"indexed":false,"internalType":"bool","name":"isBuy","type":"bool"},{"indexed":false,"internalType":"uint256","name":"shareAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"protocolEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"subjectEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"holderEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referralEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"supply","type":"uint256"}],"name":"Trade","type":"event"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyShares","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getBuyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getBuyPriceAfterFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"supply","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getSellPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getSellPriceAfterFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"holderAndReferralFeeDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"holderFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFeeDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referralFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sellShares","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeDestination","type":"address"}],"name":"setFeeDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeDestination","type":"address"}],"name":"setHolderFeeDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"setProtocolFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"setSubjectFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"sethHolderFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"sethReferralFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"sharesBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"sharesSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"subjectFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'; // O ABI do contrato com o método específico.

const apiKey = process.env.apiKey; // Você precisa se registrar no ArbitrumScan para obter uma chave de API.

const provider = new ethers.WebSocketProvider(importProvider);
const contrato = new ethers.Contract(contratoEndereco, contratoAbi, provider);

let bearerToken;

const verify = async function (number, z) {
  //62500000000000
  //250000000000000
  if (number >= 250000000000000) {
    console.log("\nTem um no preço.");
    const data = contrato.interface.encodeFunctionData("sellShares", [
      z[0],
      z[1],
    ]);

    await placeSell(data);
  }
};

const createSell = async function (params) {
  try {
    await Promise.all(
      params.map(async (z) => {
        const info = await contrato.getSellPrice(z[0], z[1]);
        const numberInfo = parseInt(info.toString());
        await verify(numberInfo, z);
      })
    );

    return await start();
  } catch (error) {
    console.log("Promise all rejeitada: ", error);
    return await start();
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
        Authorization: bearerToken,
        "Content-Type": " application/json",
      },
      data: data,
    };

    const response = await axios.request(config, { timeout: 7000 });
    const result = JSON.stringify(response.data.data.tx_hash);
    console.log(`\n${result}\n`);
    return await start();
  } catch (error) {
    if (error.response.status == 400) {
      console.log("\n", error.response.data.message);
    } else if (error.response.status == 401) {
      console.log("\n", error.response.data.message);
      bearerToken = await getToken();
      return await start();
    } else {
      console.log(error);
      return await start();
    }
  }
};

async function obterTransacoes() {
  // Primeiro, obtenha as transações do seu endereço usando a API do ArbitrumScan.
  try {
    const response = await axios.get(
      `https://api.arbiscan.io/api?module=account&action=txlist&address=${seuEndereco}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`,
      { timeout: 7000 }
    );
    const transacoes = response.data.result;
    // Filtrar as transações que chamam o método específico do contrato.
    const transacoesChamandoMetodo = await Promise.all(
      transacoes.map(async (tx) => {
        if (
          tx.functionName ==
            "buyShares(address sharesSubject,uint256 amount)" &&
          tx.value == "71875000000000"
        ) {
          const decode = new ethers.Interface([
            "function buyShares(address, uint256 )",
          ]);
          const data = decode.decodeFunctionData("buyShares", tx.input);
          const verifyInfo = await contrato.sharesBalance(data[0], seuEndereco);
          const number = parseInt(verifyInfo.toString());
          if (number >= 1) {
            return [data[0], 1];
          } else {
            return null;
          }
        }
        return null;
      })
    );

    const transacoesValidas = transacoesChamandoMetodo.filter(
      (tx) => tx !== null
    );

    return await createSell(transacoesValidas);
  } catch (error) {
    console.log(error);
    return await start();
  }
}

const start = async function () {
  try {
    console.log("Iniciando.");

    if (bearerToken == undefined) {
      bearerToken = await getToken();
    }

    console.log("\nAguardando.");

    await obterTransacoes();

    console.log("\nEnd loop!");
  } catch (error) {
    console.log("Erro ao obter transações: ", error);
    return await start();
  }
};

start();
