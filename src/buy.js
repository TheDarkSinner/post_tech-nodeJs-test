const axios = require("axios");
const ethers = require("ethers");
const { getToken } = require("./refreshToken");
require("dotenv").config();

let bearerToken;

const start = async () => {
  try {
    const alchemy = new ethers.WebSocketProvider(process.env.alchemy);

    const wallet = new ethers.Wallet(process.env.wallet, alchemy);

    if (bearerToken == undefined) {
      bearerToken = await getToken();
    }

    const fetch = async function () {
      const dataList = [];
      while (dataList.length == 0) {
        const url =
          "https://api.post.tech/wallet-post/wallet/get-recent-action";
        const resp = await axios.get(url);
        const result = resp.data.data;

        for (const x of result) {
          if (result.indexOf(x) < 5) {
            const { value } = x;
            const { txHash } = x;
            if (value <= 0.0000625) {
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
          const txInfo = await alchemy.getTransaction(y);
          const decode = new ethers.Interface([
            "function sellShares(address, uint256 )",
          ]);
          const data = decode.decodeFunctionData("sellShares", txInfo.data);
          const params = [data[0], 1];
          sharesList.push(params);
        }
        return createBid(sharesList);
      } catch (error) {
        try {
          const sharesList = [];
          for (const y of list) {
            const txInfo = await alchemy.getTransaction(y);
            const decode = new ethers.Interface([
              "function buyShares(address, uint256 )",
            ]);
            const data = decode.decodeFunctionData("buyShares", txInfo.data);
            const params = [data[0], 1];
            sharesList.push(params);
          }
          return createBid(sharesList);
        } catch {}
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
            Authorization: bearerToken,
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
          console.log("\nFalhou!");
        } else if (error.response.status == 401) {
          console.log("\n", error.response.data.message);
          bearerToken = await getToken();
        }

        return start();
      }
    };

    await fetch();
    return start();
  } catch (error) {
    return start();
  }
};

start();
