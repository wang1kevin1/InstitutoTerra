import { STRIPE } from './StripeSettings.js';

export function stripeCheckoutRedirectHTML(quantity) {

  return `
    <html>
    <!-- Load Stripe.js on your website. -->
    <script src="https://js.stripe.com/v3"></script>
  
    <div id="error-message"></div>
  
    <script>
      (function() {
        var stripe = Stripe('${STRIPE.PUBLIC_KEY}');
  
        stripe.redirectToCheckout({
          items: [{
            sku: '${STRIPE.SKU}', 
            quantity: ${quantity}
          }],
          successUrl: '${STRIPE.SUCCESS_URL}',
          cancelUrl: '${STRIPE.CANCELED_URL}',
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