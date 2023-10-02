const axios = require("axios");
const ethers = require("ethers");
require("dotenv").config();

const start = async () => {
  const provider = new ethers.WebSocketProvider(
    "wss://arb-mainnet.g.alchemy.com/v2/ptdQezDinbQE_dIzDAKA0XOaFlYnNo2x"
  );
  const wallet = new ethers.Wallet(
    "0x95c0ad928e5701e6b460995422ba93ddf9bb0f9fb14a3df93b80a37a91cdf9ad",
    provider
  );

  const fetch = async function () {
    const dataList = [];
    while (dataList.length == 0) {
      const url = "https://api.post.tech/wallet-post/wallet/get-recent-action";
      const resp = await axios.get(url);
      const result = resp.data.data;

      for (const x of result) {
        if (result.indexOf(x) < 5) {
          const { value } = x;
          const { txHash } = x;
          if (value == 0.0000625) {
            dataList.push(txHash);
          }
        }
      }
    }
    return queryShares(dataList);
  };

  const queryShares = async function (list) {
    try {
      const sharesList = [];
      for (const y of list) {
        const txInfo = await provider.getTransaction(y);
        const decode = new ethers.Interface([
          "function sellShares(address, uint256 )",
        ]);
        const data = decode.decodeFunctionData("sellShares", txInfo.data);
        const params = [data[0], 1];
        sharesList.push(params);
      }
      return createBid(sharesList);
    } catch (error) {
      console.log(error);
      return start();
    }
  };

  const createBid = async function (params) {
    try {
      const contract = new ethers.Contract(
        "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC",
        ["function buyShares(address, uint256)"],
        wallet
      );

      for (const z of params) {
        const data = contract.interface.encodeFunctionData("buyShares", [
          z[0],
          z[1],
        ]);

        return placeBid(data);
      }
    } catch (error) {
      console.log("\nErro em createBid.");
      return start();
    }
  };

  const placeBid = async function (raw) {
    try {
      let data = {
        rawData: raw,
        value: 0.000071875,
        to: "0x87da6930626Fe0c7dB8bc15587ec0e410937e5DC",
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.post.tech/wallet-post/wallet/send-transaction",
        headers: {
          Authorization:
            "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkNWM1ZTlmNTdjOWI2NDYzYzg1ODQ1YTA4OTlhOWQ0MTI5MmM4YzMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0aGV1cyBPbGl2ZWlyYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNDc0Qy1ndGh2QzlaRWxmSUFvTFdiRk9ydmFSY3VrSjJnV0p4WE5ldDA9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9zdC10ZWNoLXByb2QiLCJhdWQiOiJwb3N0LXRlY2gtcHJvZCIsImF1dGhfdGltZSI6MTY5NjEwMDYxNCwidXNlcl9pZCI6IkM3cGlQZ0xIc01XU1dtcHRJSXc1cngxYjZQbzEiLCJzdWIiOiJDN3BpUGdMSHNNV1NXbXB0SUl3NXJ4MWI2UG8xIiwiaWF0IjoxNjk2MTgwNTgwLCJleHAiOjE2OTYxODQxODAsImVtYWlsIjoib2dvcmRvMDA4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InR3aXR0ZXIuY29tIjpbIjE0NTU1NTI5OTAwMzU3MjIyNTAiXSwiZ29vZ2xlLmNvbSI6WyIxMDU0NTE3ODUxNjM4Mjg5Mzg0ODUiXSwiZW1haWwiOlsib2dvcmRvMDA4QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InR3aXR0ZXIuY29tIn19.T1iDu9ZWoma6W_x09xOFUj8aMukCDopP33iEBpD2jWvPYnsVPJ-UVJbWDIPTCvsSAp8cedlGfohVwQDLfWe6Y__J3WyWel5pnny91SsAkCKqvzEY6zV5cx4HvuDoCXV8Yzi3Q2n4IFuc47dJ6OkeXBEl4JNPHDInaVo_CiWaMlfiTifDp9DSdj5e0hW-sdPZ4yCffh2uzqbfIs6q8X1wAFtjRwtWguCUwyNxE27Z_FBFlQMas0S7qreJRP99p213UmLJKu1oub_kWpoBJoaVc5-UUT5IY3_Ohr7KYSBhZSODAtg0gwcV8ytd0UG2fY-TFsDkSBuHtrakJmj-CPC4uQ",
          "Content-Type": " application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      const result = JSON.stringify(response.data.data.tx_hash);
      console.log(`\n${result}`);
      return start();
    } catch (error) {
      if (error.response.status == 400) {
        console.log("\n", error.response.data.message);
      } else if (error.response.status == 401) {
        console.log("\n", error.response.data.message);
      }

      return start();
      // console.log(error.response.data.message);
    }
  };

  await fetch();
};

start();
