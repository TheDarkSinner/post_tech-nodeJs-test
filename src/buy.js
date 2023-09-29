const axios = require("axios");
const ethers = require("ethers");
require("dotenv").config();

const start = async () => {
  const provider = new ethers.WebSocketProvider(process.env.provider);
  const wallet = new ethers.Wallet(process.env.privatekey, provider);

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
          if (value == 0) {
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
          "function buyShares(address, uint256 )",
        ]);
        const data = decode.decodeFunctionData("buyShares", txInfo.data);
        const params = [data[0], 1];
        sharesList.push(params);
      }
      return createBid(sharesList);
    } catch (error) {
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
            "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkNWM1ZTlmNTdjOWI2NDYzYzg1ODQ1YTA4OTlhOWQ0MTI5MmM4YzMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTWF0aGV1cyBNLiAoU2lubmVycz8pIPCflbjvuI8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzE2NDI5MzQ3MTYwNzk2NjkyNDkvTUpQejJkX3dfbm9ybWFsLmpwZyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wb3N0LXRlY2gtcHJvZCIsImF1ZCI6InBvc3QtdGVjaC1wcm9kIiwiYXV0aF90aW1lIjoxNjk1OTkxMTU3LCJ1c2VyX2lkIjoiVEx1TFZxV1gyWGUxbWNraWxrRkJuYTZXb1pUMiIsInN1YiI6IlRMdUxWcVdYMlhlMW1ja2lsa0ZCbmE2V29aVDIiLCJpYXQiOjE2OTYwMDc2NjIsImV4cCI6MTY5NjAxMTI2MiwiZW1haWwiOiJncy5tYXRoLm1tQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJ0d2l0dGVyLmNvbSI6WyIzNDM4NTg3MzI3Il0sImVtYWlsIjpbImdzLm1hdGgubW1AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoidHdpdHRlci5jb20ifX0.IoThoEpJgV82wcIQMdItqrsEkiWi5RMWNP_HRUex-EJGjkQZRIqOdZcJr6FuB1nMozv5FN--2oMw5Q_b4LV4plg8XJo8RvNCxreSP1dpYN-WSO2vu41LvisO2wdM7gfrz9Lgv9xJvY_SYOQA_HFwRz86TKRaIHLajQ3-skb0UL1XhIMxnuXi49VNcCVhcanpQfftartS1o2eJztAUH2onez-pDT9zGlbaB4pn-VUWTTHUclBt082R3LVeu2OuvqmV8Ch8V2ci9jztqxeMyTDuijvoV35IMiCe4U3fkCosPxeYGLM7hiR4ldzCb_oyOFdjss8SDQR8lJ65kVvFt2Cfg",
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
        console.log(error.response.data.message);
      }

      return start();
      // console.log(error.response.data.message);
    }
  };

  await fetch();
};

start();
