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

app.get('/aliexpress-product-price', async (req, res) => {
    const { url, product_options } = req.body;

    const response = await axios.get(url);
    const html = await response.data;

    const dataStr = html.match(/data: ({.+})/)?.[1];

    const data = JSON.parse(dataStr);
    
    const index = data.skuModule.skuPriceList.findIndex(sku => product_options.map(t => sku.skuAttr.includes(t)).every(Boolean));

    const skuVal = data.skuModule.skuPriceList[index].skuVal;

    const price = skuVal.isActivity ? skuVal.skuActivityAmount.value : skuVal.skuAmount.value;

    return res.send({ price });
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