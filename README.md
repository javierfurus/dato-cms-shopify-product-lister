# DatoCMS Shopify product plugin

A plugin that allows users to search and select Shopify products, using the latest version of Shopify's GraphQL endpoint.

Based on the following project: https://github.com/datocms/plugins/tree/master/shopify-product#readme

## Configuration

Please specify your Shopify domain and Storefront access token on the plugin global settings:

![Demo](https://raw.githubusercontent.com/javierfurus/dato-cms-shopify-product-lister/main/docs/settings.png)

You can either hook this plugin manually to your single-line fields, or specifying an automatic match rule based on the API key.

![Demo](https://raw.githubusercontent.com/javierfurus/dato-cms-shopify-product-lister/main/docs/assign-to-field.png)

If you wish to use the field while generating models/blocks in the JavaScript SDK, you can use the following setup:

```ts
await client.fields.create('ITEM_TYPE_OR_ITEM_TYPE_ID', {
    label: 'Shopify Product SKU',
    api_key: 'sku',
    field_type: 'string',
    appearance: {
      addons: [],
      editor: 'PLUGIN_ID_FROM_SETTINGS',
      parameters: {},
      field_extension: 'shopifyProductLister',
    },
    validators: {
      required: {},
      unique: {},
    },
  });
```

## Obtain a Shopify API key

To request a Storefront API access token follow [these instructions](https://www.shopify.com/partners/blog/storefront-api-learning-kit).

Remember to give products read permissions.
![Demo](https://raw.githubusercontent.com/javierfurus/dato-cms-shopify-product-lister/main/docs/shopify-storefront-key.png)
