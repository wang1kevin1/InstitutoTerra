import { STRIPE } from './stripeSettings.js';


/**
 * Create the Stripe Checkout redirect html code for a given user
 * @param {String} userID
 * @returns {String}
 */
export function stripeCheckoutRedirectHTML(userID) {
  if (!userID) {
    throw new Error('Invalid userID');
  }

  return `
  <html>
  <!-- Load Stripe.js on your website. -->
  <script src="https://js.stripe.com/v3"></script>
  
  <div id="error-message"></div>
  
  <script>
  (function() {
    var stripe = Stripe('pk_test_BH7KSQ3Fi4OnbVNcB5t6P2PR00cBZApc9f');
  
    stripe.redirectToCheckout({
        items: [{sku: 'sku_GcvolINXQ7ltwi', quantity: 1}],
  
        // Do not rely on the redirect to the successUrl for fulfilling
        // purchases, customers may not always reach the success_url after
        // a successful payment.
        // Instead use one of the strategies described in
        // https://stripe.com/docs/payments/checkout/fulfillment
        successUrl: 'https://your-website.com/success',
        cancelUrl: 'https://your-website.com/canceled',
      })
    .then(function (result) {
        if (result.error) {
          // If redirectToCheckout fails due to a browser or network
          // error, display the localized error message to your customer.
          var displayError = document.getElementById('error-message');
          displayError.textContent = result.error.message;
        }
    });
  })();
  </script>
  </html>
  `;
}