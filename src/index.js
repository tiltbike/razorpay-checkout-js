const CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

const injectScript = () => {
  const script = document.createElement('script')
  script.src = CHECKOUT_URL

  const headOrBody = document.head || document.body

  if (!headOrBody) {
    throw new Error(
      'Expected document.body not to be null. checkout.js requires a <body> element.'
    )
  }

  headOrBody.appendChild(script)

  return script
}

// Execute our own script injection after a tick to give users time to
// do their own script injection.
const checkoutPromise = Promise.resolve().then(() => {
  if (typeof window === 'undefined') {
    // Resolve to null when imported server side. This makes the module
    // safe to import in an isomorphic code base.
    return null
  }

  if (window.Razorpay) {
    return window.Razorpay
  }

  const script =
    document.querySelector(
      `script[src="${CHECKOUT_URL}"], script[src="${CHECKOUT_URL}/"]`
    ) || injectScript()

  return new Promise((resolve, reject) => {
    script.addEventListener('load', () => {
      if (window.Razorpay) {
        resolve(window.Razorpay)
      } else {
        reject(new Error('checkout.js not available'))
      }
    })

    script.addEventListener('error', () => {
      reject(new Error('Failed to load checkout.js'))
    })
  })
})

let loadCalled = false

checkoutPromise.catch((err) => {
  if (!loadCalled) console.warn(err)
})

export const loadCheckout = (...args) => {
  loadCalled = true

  return checkoutPromise.then((maybeCheckout) =>
    maybeCheckout ? maybeCheckout(...args) : null
  )
}
