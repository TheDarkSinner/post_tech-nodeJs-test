const axios = require("axios");
const ethers = require("ethers");
require("dotenv").config();

const start = async () => {
  try {
    const provider = new ethers.WebSocketProvider(
      "wss://arb-mainnet.g.alchemy.com/v2/ptdQezDinbQE_dIzDAKA0XOaFlYnNo2x"
    );

    //0x912cefd65050fd1e85a4623a37e3c2f970dff88f4aaa1bf47c67a53c72ed92a5 - 1
    //0x95c0ad928e5701e6b460995422ba93ddf9bb0f9fb14a3df93b80a37a91cdf9ad - 2
    const wallet = new ethers.Wallet(
      "0x912cefd65050fd1e85a4623a37e3c2f970dff88f4aaa1bf47c67a53c72ed92a5",
      provider
    );

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
        try {
          const sharesList = [];
          for (const y of list) {
            const txInfo = await provider.getTransaction(y);
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
            Authorization:
              "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhNTE5MDc0NmU5M2JhZTI0OWIyYWE3YzJhYTRlMzA2M2UzNDFlYzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0aGV1cyBNLiAoU2lubmVycz8pIPCflbjvuI8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzE2NDI5MzQ3MTYwNzk2NjkyNDkvTUpQejJkX3dfbm9ybWFsLmpwZyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wb3N0LXRlY2gtcHJvZCIsImF1ZCI6InBvc3QtdGVjaC1wcm9kIiwiYXV0aF90aW1lIjoxNjk1OTkxMTU3LCJ1c2VyX2lkIjoiVEx1TFZxV1gyWGUxbWNraWxrRkJuYTZXb1pUMiIsInN1YiI6IlRMdUxWcVdYMlhlMW1ja2lsa0ZCbmE2V29aVDIiLCJpYXQiOjE2OTYzMDc2MzEsImV4cCI6MTY5NjMxMTIzMSwiZW1haWwiOiJncy5tYXRoLm1tQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJ0d2l0dGVyLmNvbSI6WyIzNDM4NTg3MzI3Il0sImVtYWlsIjpbImdzLm1hdGgubW1AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoidHdpdHRlci5jb20ifX0.dHhDiOEasJob38y9LKvB3A0NKtcmU1xzP0xoUSf-Qm3ECwOGlt8v3wQgUfmYmBKpi441Ky8LhYbuaFNOm_NSSkQ3BPGtF-UvdLiGq9CDFYmMCNxUYpZSmS4glo_kuhcMhkyVLhY4aC2Ms0ybM6nLqYbEhdV0RObC3g6KRrRkAd7HEA3tOTs-_tcq5Bxyg2b3obf9tVstMnBCwkDnsPUrn9KIWXjP6li5mJsezrgKmQhm2G9m1WM4SRowJoxEUaG_ov1zYMZ8o-jIp-rUfZHHuuJRKfnLMn7KjEEfcrIaJXhAMqT_w23ISKYMxQbNU0zbwfKCRiNHsKIYqJo8TnYT3w",
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
          //console.error("\n", error.response.data.message);
        } else if (error.response.status == 401) {
          console.log("\n", error.response.data.message);
        }

        return start();
        // console.log(error.response.data.message);
      }
    };

    await fetch();
    return start();
  } catch (error) {
    return start();
  }
};

start();
