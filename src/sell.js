const axios = require("axios");
const ethers = require("ethers");

// Infura é um serviço de infraestrutura Ethereum que permite acesso à rede Ethereum.
const provider = new ethers.WebSocketProvider(
  "wss://arbitrum.blockpi.network/v1/ws/2f969b1f02203399a9c3fa0ab42e0cc8900548a6"
);

// Seu endereço Ethereum e o contrato com o método específico que você deseja rastrear.
//0x1310cbf77ec2f8c7745739e64dc2df8860bcf07e - 1
//0x4c00ee4f0dc2f9366864ec8c80f4ea905bb82074 - 2
const seuEndereco = "0x4c00ee4f0dc2f9366864ec8c80f4ea905bb82074";
const contratoEndereco = "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC";
const contratoAbi =
  '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"address","name":"subject","type":"address"},{"indexed":false,"internalType":"bool","name":"isBuy","type":"bool"},{"indexed":false,"internalType":"uint256","name":"shareAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"protocolEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"subjectEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"holderEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"referralEthAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"supply","type":"uint256"}],"name":"Trade","type":"event"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyShares","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getBuyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getBuyPriceAfterFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"supply","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getSellPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getSellPriceAfterFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"holderAndReferralFeeDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"holderFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFeeDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"referralFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sharesSubject","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"sellShares","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeDestination","type":"address"}],"name":"setFeeDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_feeDestination","type":"address"}],"name":"setHolderFeeDestination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"setProtocolFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"setSubjectFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"sethHolderFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePercent","type":"uint256"}],"name":"sethReferralFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"sharesBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"sharesSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"subjectFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'; // O ABI do contrato com o método específico.

const apiKey = "BIAWVZJQB7VCJ5F743FCNUB8W3ZT1F7P8I"; // Você precisa se registrar no ArbitrumScan para obter uma chave de API.

async function obterTransacoes() {
  try {
    // Primeiro, obtenha as transações do seu endereço usando a API do ArbitrumScan.
    const response = await axios.get(
      `https://api.arbiscan.io/api?module=account&action=txlist&address=${seuEndereco}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    );

    if (response.data && response.data.status === "1") {
      const transacoes = response.data.result;

      if (transacoes.length === 0) {
        console.log("Nenhuma transação encontrada para este endereço.");
        return [];
      }

      // Em seguida, crie uma instância do contrato usando seu endereço e ABI.
      const contrato = new ethers.Contract(
        contratoEndereco,
        contratoAbi,
        provider
      );

      // Filtrar as transações que chamam o método específico do contrato.
      const transacoesChamandoMetodo = await Promise.all(
        transacoes.map(async (tx) => {
          await new Promise((resolve) => setTimeout(resolve, 1));
          if (
            tx.functionName ==
              "buyShares(address sharesSubject,uint256 amount)" &&
            tx.value == "71875000000000"
          ) {
            const decode = new ethers.Interface([
              "function buyShares(address, uint256 )",
            ]);
            const data = decode.decodeFunctionData("buyShares", tx.input);
            const verifyInfo = await contrato.sharesBalance(
              data[0],
              seuEndereco
            );
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

      // Remova transações nulas (aquelas que não chamaram o método específico).
      const transacoesValidas = transacoesChamandoMetodo.filter(
        (tx) => tx !== null
      );

      const createSell = async function (params) {
        try {
          await Promise.all(
            params.map(async (z) => {
              await new Promise((resolve) => setTimeout(resolve, 1));
              const info = await contrato.getSellPrice(z[0], z[1]);
              const numberInfo = parseInt(info.toString());
              if (numberInfo >= 250000000000000) {
                console.log("\nTem um no preço.");
                const data = contrato.interface.encodeFunctionData(
                  "sellShares",
                  [z[0], z[1]]
                );
                await placeSell(data);
              }
            })
          );
        } catch (error) {
          console.log(error);
          return main();
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
                "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhNTE5MDc0NmU5M2JhZTI0OWIyYWE3YzJhYTRlMzA2M2UzNDFlYzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0aGV1cyBPbGl2ZWlyYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNDc0Qy1ndGh2QzlaRWxmSUFvTFdiRk9ydmFSY3VrSjJnV0p4WE5ldDA9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9zdC10ZWNoLXByb2QiLCJhdWQiOiJwb3N0LXRlY2gtcHJvZCIsImF1dGhfdGltZSI6MTY5NjMzMzc5MywidXNlcl9pZCI6IkM3cGlQZ0xIc01XU1dtcHRJSXc1cngxYjZQbzEiLCJzdWIiOiJDN3BpUGdMSHNNV1NXbXB0SUl3NXJ4MWI2UG8xIiwiaWF0IjoxNjk2MzMzNzkzLCJleHAiOjE2OTYzMzczOTMsImVtYWlsIjoib2dvcmRvMDA4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InR3aXR0ZXIuY29tIjpbIjE0NTU1NTI5OTAwMzU3MjIyNTAiXSwiZ29vZ2xlLmNvbSI6WyIxMDU0NTE3ODUxNjM4Mjg5Mzg0ODUiXSwiZW1haWwiOlsib2dvcmRvMDA4QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InR3aXR0ZXIuY29tIn19.Q-hiJ9FE8Fs6G6_2q-h6lPnHC8wJPSfSfRL8DqE9zGyl91_YhsL4xVxfAT6LYBaB-lw8_EP5L3QN5Um9BkF6Wdhy81C7P0QzXutKF2SujpvDeECplH3U4OWA-XfqYRVnLNVT-UWxJQkvEFiBTAX827Ziv3jPz9H4w2lKySXiuyeKWLIiBI-rVrKWMNUa8-66CpciuV1DDKSgfpjHQYa3UGwlXk10fWkegNNLXzcjzysjUWy_LfBe8J1xkb2Yc7kx9xeeGWfrNPlquVLC-32kG9V6bOe8a2QIBCfZQsmfplUw4WiXVgk3hrciFTmpfIt50yunie5_0dfWVpqHjgmp8w",
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

      await createSell(transacoesValidas);
    } else {
      throw new Error("Erro na solicitação ao ArbitrumScan API");
    }
  } catch (error) {
    console.error("Erro ao obter transações:", error);
  }
}

async function start() {
  while (true) {
    console.log("Iniciando.");
    await obterTransacoes();
    console.log("Aguardando.");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Proximo loop.");
  }
}

start();
