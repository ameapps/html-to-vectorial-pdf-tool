const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");


const A4HEIGHT = 1684; // Altezza A4 in pixel a 96 DPI

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
    const heightIt = 3225;
    const heightEn = 3275;

    // Genera PDF vettoriale
    const outName = `output-${langUsed}.pdf`;
    const isSinglePage = true;
    if (isSinglePage) {
      await page.pdf({
        path: outName,
        printBackground: true,
        width: "750px", // larghezza fissa
        height: langUsed === "it" ? `${heightIt} px` : `${heightEn} px`, // altezza grande a piacere, oppure calcolata
      });
    } else {
      await page.pdf({
        path: outName,
        format: "A4",
        printBackground: true, // mantiene i colori di sfondo e CSS
        preferCSSPageSize: true, // usa eventuali @page CSS
      });
    }
    // Riduco il PDF a una sola pagina (opzionale)
    await trimPdf(outName, `output-${langUsed}-trimmed.pdf`, 1);
    await browser.close();
    console.log(`✅ PDF generato: ${outName}`);
  });
})();

/**Mantieni solo il numero specificato di pagine invece che esportare tutto il documento*/
async function trimPdf(inputPath, outputPath, pageCount) {
  const existingPdf = await fs.promises.readFile(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdf);

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdfDoc, [...Array(pageCount).keys()]);
  pages.forEach((p) => newPdf.addPage(p));

  const pdfBytes = await newPdf.save();
  await fs.promises.writeFile(outputPath, pdfBytes);
}