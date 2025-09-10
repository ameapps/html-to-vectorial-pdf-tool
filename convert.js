
const puppeteer = require("puppeteer");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


async function convertHtmlToPdf(htmlPath, outputPath) {
  const filePath = path.resolve(htmlPath);
  const fileUrl = "file://" + filePath;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outputPath,
    printBackground: true,
    width: "750px",
    height: "3030px",
  });
  await browser.close();
  console.log(`✅ PDF generated: ${outputPath}`);
}

// Modalità CLI
if (require.main === module) {
  const inputPath = process.argv[2];
  if (inputPath) {
    const outputPath = path.join(
      path.dirname(inputPath),
      `output-${path.basename(inputPath, path.extname(inputPath))}.pdf`
    );
    convertHtmlToPdf(inputPath, outputPath);
  } else {
    // Avvia server Express se non viene passato un file da linea di comando
    const app = express();

  app.use(cors());
  app.use(bodyParser.json());

    app.post("/convert", async (req, res) => {
      const htmlPath = req.body.htmlPath;
      if (!htmlPath) {
        return res.status(400).json({ error: "Missing htmlPath in request body" });
      }
      const outputPath = path.join(
        path.dirname(htmlPath),
        `output-${path.basename(htmlPath, path.extname(htmlPath))}.pdf`
      );
      try {
        await convertHtmlToPdf(htmlPath, outputPath);
        res.json({ success: true, output: outputPath });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    const PORT = process.env.PORT || 3100;
    app.listen(PORT, () => {
      console.log(`Express server listening on port ${PORT}`);
      console.log("POST /convert { htmlPath: 'path/to/file.html' }");
    });
  }
}
