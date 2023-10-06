const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    userDataDir: "/tmp/myChromeSession",
    headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 800,
    height: 600,
    deviceScaleFactor: 1,
  });
}

main();
