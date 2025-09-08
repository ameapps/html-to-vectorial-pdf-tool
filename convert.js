const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  // Percorso del file HTML locale (modifica qui)
  const filePath = path.resolve(__dirname, "input.html");
  const fileUrl = "file://" + filePath;

  // Avvia browser headless
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Carica l'HTML
  await page.goto(fileUrl, { waitUntil: "networkidle0" });

  // Genera PDF vettoriale
  const isSinglePage = true;
  if (isSinglePage) {
    await page.pdf({
      path: "output.pdf",
      printBackground: true,
      width: "700px", // larghezza fissa
      height: "3000px", // altezza grande a piacere, oppure calcolata
    });
  } else {
    await page.pdf({
      path: "output.pdf",
      format: "A4",
      printBackground: true, // mantiene i colori di sfondo e CSS
      preferCSSPageSize: true, // usa eventuali @page CSS
    });
  }

  await browser.close();
  console.log("✅ PDF generato: output.pdf");
})();
