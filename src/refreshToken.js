const puppeteer = require("puppeteer");

async function getToken() {
  try {
    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      userDataDir: "/tmp/myChromeSession",
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto("https://post.tech");

    const request = await page.waitForRequest(
      "https://api.post.tech/wallet-post/wallet/get-recent-action"
    );

    await new Promise((resolve) => setTimeout(resolve, 10000));
    const response = await request.headers();
    const result = response.authorization;
    await browser.close();
    console.log("\nRefresh token realizado!");
    return result;
  } catch (error) {
    console.log("Quebrou, aguardando...");
    await new Promise((resolve) => setTimeout(resolve, 15000));
    return getToken();
  }
}

module.exports = { getToken };
