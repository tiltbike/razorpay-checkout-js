const dispatchScriptEvent = (eventType) => {
  const injectedScript = document.querySelector(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
  );

  if (!injectedScript) {
    throw new Error('could not find checkout.js script element');
  }

  injectedScript.dispatchEvent(new Event(eventType));
};

describe('Razorpay module loader', () => {
  afterEach(() => {
    const script = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"], script[src="https://checkout.razorpay.com/v1/checkout.js/"]'
    );
    if (script && script.parentElement) {
      script.parentElement.removeChild(script);
    }
    delete window.Razorpay;
    jest.resetModules();
  });

  it('injects the Razorpay script as a side effect after a tick', () => {
    require('./index');

    expect(
      document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    ).toBe(null);

    return Promise.resolve().then(() => {
      expect(
        document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      ).not.toBe(null);
    });
  });

  it('does not inject the script when Razorpay is already loaded', () => {
    require('./index');

    window.Razorpay = jest.fn((key) => ({ key }));

    return new Promise((resolve) => setTimeout(resolve)).then(() => {
      expect(
        document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      ).toBe(null);
    });
  });

  describe('does not inject a duplicate script when one is already present', () => {
    test('when the script does not have a trailing slash', () => {
      require('./index');

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      return Promise.resolve().then(() => {
        expect(
          document.querySelectorAll(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"], script[src="https://checkout.razorpay.com/v1/checkout.js/"]'
          )
        ).toHaveLength(1);
      });
    });

    test('when the script has a trailing slash', () => {
      require('./index');

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js/';
      document.body.appendChild(script);

      return Promise.resolve().then(() => {
        expect(
          document.querySelectorAll(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"], script[src="https://checkout.razorpay.com/v1/checkout.js/"]'
          )
        ).toHaveLength(1);
      });
    });
  });

  describe('loadCheckout', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockReturnValue();
    });

    it('resolves loadCheckout with Razorpay object', async () => {
      const { loadCheckout } = require('./index');
      const razorpayPromise = loadCheckout({ key: 'rzp_test_ThB8MHSwsn2cQPU' });

      await new Promise((resolve) => setTimeout(resolve));
      window.Razorpay = jest.fn((key) => ({ key }));
      dispatchScriptEvent('load');

      return expect(razorpayPromise).resolves.toEqual({ key: { key: 'rzp_test_ThB8MHSwsn2cQPU' } });
    });

    it('rejects when the script fails', async () => {
      const { loadCheckout } = require('./index');
      const razorpayPromise = loadCheckout({ key: 'rzp_test_ThB8MHSwsn2cQPU' });

      await Promise.resolve();
      dispatchScriptEvent('error');

      await expect(razorpayPromise).rejects.toEqual(
        new Error('Failed to load checkout.js')
      );

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('does not cause unhandled rejects when the script fails', async () => {
      require('./index');

      await Promise.resolve();
      dispatchScriptEvent('error');

      // Turn the task loop to make sure the internal promise handler has been invoked
      await new Promise((resolve) => setImmediate(resolve));

      expect(console.warn).toHaveBeenCalledWith(
        new Error('Failed to load checkout.js')
      );
    });

    it('rejects when Razorpay is not added to the window for some reason', async () => {
      const { loadCheckout } = require('./index');
      const razorpayPromise = loadCheckout({ key: 'rzp_test_ThB8MHSwsn2cQPU' });

      await Promise.resolve();
      dispatchScriptEvent('load');

      return expect(razorpayPromise).rejects.toEqual(
        new Error('checkout.js not available')
      );
    });
  });
});
