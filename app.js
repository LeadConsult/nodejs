const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// List of common installation paths for Chrome or Chromium on Linux
const possiblePaths = [
    '/usr/bin/chromium-browser', // Example path, add more if needed
    '/usr/bin/google-chrome',    // Example path, add more if needed
    // Add more paths here
];

async function findChromeExecutable() {
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            return possiblePath;
        }
    }
    return null;
}

async function main() {
    const chromeExecutablePath = await findChromeExecutable();

    if (chromeExecutablePath) {
        console.log(`Found Chrome executable at: ${chromeExecutablePath}`);

        const browser = await puppeteer.launch({
            executablePath: chromeExecutablePath,
            headless: true, // Set this as needed
        });

        const page = await browser.newPage();
        // Your scraping code here

        await browser.close();
    } else {
        console.error('Chrome executable not found.');
    }
}

main();


const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

</head>
<body>
    <button id="scrapeButton">Scrape Data</button>

<div class="container">
    <div class="row">
        <div class="col-md-2">
            <div id="result2">Result 2</div>
        </div>
        <div class="col-md-2">
            <div id="result">Result 1</div>
        </div>
    </div>
</div>

    <script>
        document.getElementById("scrapeButton").addEventListener("click", () => {
            // When the button is clicked, send a request to initiate scraping
            document.getElementById("result").innerText = "Fetching...";
            fetch("/scrape")
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById("result").innerText = 'Error: ' + data.error;
                    } else {
                        // document.getElementById("result").innerText = JSON.stringify(data, null, 2);
                        console.log(JSON.stringify(data, null, 2));

                    // /////////////////
                    // Assuming 'data' is an array of arrays containing objects
                    let formattedDataArray = [];
                    let formattedDataArray2 = [];

                    data.forEach(innerArray => {
                        // Convert tweet counts to integers
                        innerArray.forEach(item => {
                            item.tweetCount = parseInt(item.tweetCount);
                        });

                        // Sort the inner array by tweet count in descending order
                        innerArray.sort((a, b) => b.tweetCount - a.tweetCount);

                        // Create an array to store formatted data
                        const formattedData = innerArray.map(function(item) {
                            return item.trendText + " " + item.tweetCount + "K";
                        });
                        const formattedData2 = innerArray.map(function(item) {
                            return item.trendText;
                        });

                        // Concatenate the formatted data to the accumulator array
                        formattedDataArray = formattedDataArray.concat(formattedData);
                        formattedDataArray2 = formattedDataArray2.concat(formattedData2);
                    });
                    // Join all formatted data with line breaks
                    const formattedDataString = formattedDataArray.join('<br>');
                    const formattedDataString2 = formattedDataArray2.join('<br>');

                    // Output the sorted data to an HTML element with the ID "result"
                    document.getElementById("result").innerHTML = formattedDataString;
                    document.getElementById("result2").innerHTML = formattedDataString2;


                    // /////////////////
                    }
                })
                .catch(error => {
                    document.getElementById("result").innerText = 'Fetch error: ' + error.message;
                });
        });
    </script>
    <!-- Bootstrap JavaScript (optional) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>


</body>
</html>`;
