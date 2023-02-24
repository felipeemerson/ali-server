const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', async (req, res) => {
    return res.send('<div style="display: flex; justify-content: center; height: 100vh">' + 
    '<h1 style="align-self: center; -webkit-text-stroke: 1px #000; color: #70b2ff; font-size: 72px">It\'s Working!!!</h1>'+
    '</div>');
});

app.post('/aliexpress-product-price', async (req, res) => {
    const { url, product_options } = req.body;
 
    var urlFormatted = url.replace("pt.aliexpress.com", "aliexpress.com");
    urlFormatted = urlFormatted.replace(/\/?\?.*|\/$/, "");  // remove any query params
    urlFormatted += "?gatewayAdapt=glo2usa&_randl_shipto=BR&_randl_currency=BRL";

    console.log(`URL: ${urlFormatted}`);

    const response = await axios.get(urlFormatted, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' } });

    try {
        const html = await response.data;

        console.log(`Html:\n${html}...`); //.substring(0, 50)

        const dataStr = html.match(/data: ({.+})/)?.[1];

        const data = JSON.parse(dataStr);

        const skuPriceList = data.skuModule.skuPriceList;
        console.log(`skuPriceList size: ${skuPriceList.length}`);
        
        const index = skuPriceList.findIndex(sku => product_options.map(t => sku.skuAttr.includes(t)).every(Boolean));

        const skuVal = skuPriceList[index].skuVal;
    
        const price = skuVal.isActivity ? skuVal.skuActivityAmount.value : skuVal.skuAmount.value;
    
        return res.send({ price });
    } catch (error) {
        return res.status(400).send(`Something goes wrong... ${error.message}`);
    }

});

app.get('*', async (req, res) => {
    return res.status(404).send('<div style="display: flex; flex-direction: column; justify-content: center; height: 100vh">' + 
    '<h1 style="align-self: center; -webkit-text-stroke: 1px #000; font-size: 64px; color: #d75413">Error 404!</h1>'+
    '<h2 style="align-self: center; -webkit-text-stroke: 1px #000; font-size: 48px; color: #d75413">Not Found.</h3>'+
    '</div>');
});


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Now listening on port ${port}!`); 
});

module.exports = app;