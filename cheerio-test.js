const cheerio = require("cheerio");

const html = `
<html>
  <head><title>GGWP</title></head>
  <body>
    <article>
      <h1>Test</h1>
      <p>No</p>
      <p>Yes</p>
      <h3>GGGGGGG</h3>
    </article>
  </body>
</html>
`;

const $ = cheerio.load(html);

const title = $("title").text();
const content = $("article").text().trim();

console.log("Title:", title);
console.log("Content:", content);
