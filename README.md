# <!-- PROJECT LOGO -->
<div align="center">
  <h1 align="center">Ali-server</h1>
  <p align="center">
    A simple server to scrape Aliexpress products HTML pages and return price and shipping value
    </br>
  </p>
</div>

## About
This project is a simple [Node.js](https://nodejs.org/en/) Server. It exposes an endpoint `/aliexpress-product-price` that receives a JSON body like:

```bash
{
	"url": "https://pt.aliexpress.com/item/1005005104596168.html",
	"product_options": [2, 5]
}
```

Where, `url` is the product's URL that we want to scrape and the `product_options` is a numeric array with the positions (starting from 1) of the selected options of the product (from top to bottom). Then, the server will return an response with a JSON body like this:
```bash
{
	"price": 1849.45,
	"shipping_value": 0
}
```

It returns the price of the variant and the shipping value. The price is considering the BRL currency (Brazilian Real) and shipping to Brazil. May be you can change it to consider other currencies and countries editing the line 22 of index.js.

Note: the URL passed in the body must be in the format `pt.aliexpress.com` or `aliexpress.com`. But you can try with other URL types changing some things... And lastly, the region where the server is running may influence on it working or not.
