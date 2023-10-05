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
    //0xc04afafdeb1d6055bcded6bf2a8a3856db7fbdc20bf3040237b84e5e660aac4b - 3
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
              "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhNTE5MDc0NmU5M2JhZTI0OWIyYWE3YzJhYTRlMzA2M2UzNDFlYzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGhlRGFya1Npbm5lciIsInBpY3R1cmUiOiJodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvMTcwOTI0NDAwMTI4MTM1NTc4Ni9OZmhOSFdJM19ub3JtYWwucG5nIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3Bvc3QtdGVjaC1wcm9kIiwiYXVkIjoicG9zdC10ZWNoLXByb2QiLCJhdXRoX3RpbWUiOjE2OTY0NjI0OTIsInVzZXJfaWQiOiI4ZmJXeWhhOWtCZHcxOEhZeEp2VnFNemtPMVEyIiwic3ViIjoiOGZiV3loYTlrQmR3MThIWXhKdlZxTXprTzFRMiIsImlhdCI6MTY5NjQ2NTc5MywiZXhwIjoxNjk2NDY5MzkzLCJlbWFpbCI6InRoZWRhcmtzaW5uZXIwMDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InR3aXR0ZXIuY29tIjpbIjE3MDkyNDM5MTI2NjQxMDA4NjUiXSwiZW1haWwiOlsidGhlZGFya3Npbm5lcjAwMUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJ0d2l0dGVyLmNvbSJ9fQ.SyxrMG4Jyny0Af7y8AUXHhVSJMH3YYKvCaeBZLHab220kqkjHfg8vPjuWJiysK6HYVuG6kVdaUenAlvlCyKIIHuqytqLV0rtEkfE8VonwChHuj-A8TCTKF8XkY2eTdZZK8l2HOk1jucglF6qAFKcvBA-Qn2BMkAo6RofZbDGLxl68PIENBXg3C9kA-agnmHBFMbWe0BNl2mjGJ3gvCTwv0vEAmP5wpa-O29X735nCKWhUwdtUPuaqrVyoq0EscFMXOwAmYpa-_gYR894F4dYRQfNrp5-BFjEPL1KiOjojYUWT5l9PtQJDC841Ijdd05OYAxIpkeXYmBU-PPd3eZQUg",
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
