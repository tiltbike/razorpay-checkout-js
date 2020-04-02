# Razorpay checkout.js ES Module

_This is not an official package by Razorpay. It's just a simple wrapper for Razorpay's checkout.js script inspired from a [similar wrapper by Stripe](https://github.com/stripe/stripe-js)._

Use [Razorpay checkout.js](https://razorpay.com/docs/payment-gateway/web-integration/) as an ES module.

**Note**: To be PCI compliant, you must load checkout.js directly from `https://checkout.razorpay.com`. You cannot include it in a bundle or host it yourself. This package wraps the global `Razorpay` function provided by the checkout.js script as an ES module.

![Tests](https://github.com/tiltbike/razorpay-checkout-js/workflows/Tests/badge.svg?branch=master) [![npm version](https://img.shields.io/npm/v/@tiltbike/razorpay-checkout-js.svg?style=flat-square)](https://www.npmjs.com/package/@tiltbike/razorpay-checkout-js)

## Installation

Use `npm` to install the checkout.js module:

```sh
npm install @tiltbike/razorpay-checkout-js
```

## Usage

### `loadCheckout`

This function returns a `Promise` that resolves with a newly created `Razorpay` object once checkout.js has loaded. If necessary, it will load checkout.js for you by inserting the checkout.js script tag. If you call `loadCheckout` in a server environment it will resolve to `null`.

```js
import { loadCheckout } from '@tiltbike/razorpay-checkout-js';

const razorpay = await loadCheckout('rzp_test_ThB8MHSwsn2cQPU');
```

We’ve placed a random API key in this example. Replace it with your [actual publishable API keys](https://dashboard.razorpay.com/#/app/keys) to test this code through your Razorpay account.

For more information on how to use checkout.js once it loads, please refer to the [checkout.js API reference](https://razorpay.com/docs/payment-gateway/quick-integration/) or learn to [accept a payment](https://razorpay.com/docs/payment-gateway/payments/) with Razorpay.

## Ensuring checkout.js is available everywhere

It is recommended that checkout.js is loaded on every page, not just your checkout page. This might help detect anomalous behavior that may be indicative of fraud as customers browse your website.

By default, this module will insert a `<script>` tag that loads checkout.js from `https://checkout.razorpay.com`. This happens as a side effect immediately upon importing this module. If you utilize code splitting or only include your JavaScript app on your checkout page, the checkout.js script will only be available in parts of your site. To ensure checkout.js is available everywhere, you can perform either of the following steps:

### Import as a side effect

Import `@tiltbike/razorpay-checkout-js` as a side effect in code that will be included throughout your site (e.g. your root module). This will make sure the checkout.js script tag is inserted immediately upon page load.

```js
import '@tiltbike/razorpay-checkout-js';
```

### Manually include the script tag

Manually add the checkout.js script tag to the `<head>` of each page on your site. If an existing script tag is already present, this module will not insert a new one. When you call `loadCheckout`, it will use the existing script tag.

```html
<!-- Somewhere in your site's <head> -->
<script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
```

## Razorpay Documentation

- [Razorpay Docs](https://razorpay.com/docs)
- [Razorpay Web Integration Docs](https://razorpay.com/docs/payment-gateway/web/)

## Credits

Most of the code and documentation for this package has been picked up from the [open-source loading wrapper for Stripe.js](https://github.com/stripe/stripe-js). Thanks to the [Stripe](https://github.com/stripe/) team!
