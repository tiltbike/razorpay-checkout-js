import { loadCheckout } from '../../../src';

(async () => {
  // setup DOM
  const rootNode = document.getElementById('root');
  const form = document.createElement('form');
  const button = document.createElement('button');
  button.innerText = 'Pay';
  form.appendChild(button);
  rootNode.appendChild(form);

  // setup Razorpay checkout.js
  const razorpay = await loadCheckout({
    // change below key to your live Razorpay key
    key: 'rzp_test_ThB8MHSwsn2cQPU',
    amount: 10000,
    name: 'Razorpay',
    description: 'Testing checkout.js',
  });

  // handle form submit
  form.addEventListener('submit', async (e) => {
    razorpay.open();
    e.preventDefault();
  });
})();
