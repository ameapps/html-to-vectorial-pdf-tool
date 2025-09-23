const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  // Percorso del file HTML locale (modifica qui)
  const files = [
    'input-cv-it.html', 
    'input-cv-en.html'
  ];
  files.forEach(async element => {
    const filePath = path.resolve(__dirname, element);
    const fileUrl = "file://" + filePath;
    const langUsed = filePath.includes("-it.") ? "it" : "en";

    // Avvia browser headless
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Carica l'HTML
    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    const heightIt = 3205;
    const heightEn = 3185;

    // Genera PDF vettoriale
    const isSinglePage = true;
    if (isSinglePage) {
      await page.pdf({
        path: `output-${langUsed}.pdf`,
        printBackground: true,
        width: "750px", // larghezza fissa
        height: langUsed === "it" ? `${heightIt} px` : `${heightEn} px`, // altezza grande a piacere, oppure calcolata
      });
    } else {
      await page.pdf({
        path: `output-${langUsed}.pdf`,
        format: "A4",
        printBackground: true, // mantiene i colori di sfondo e CSS
        preferCSSPageSize: true, // usa eventuali @page CSS
      });
    }
    await browser.close();
    console.log(`✅ PDF generato: output-${langUsed}.pdf`);
  });



})();
