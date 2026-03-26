document.getElementById('bank-info').style.display = 'none';

const chargify = new Chargify();
const context = localStorage.getItem('context');

const surchargeState = {
  addressFields: null,
  cardDetails: null,

  fetchPreview: function() {
    const address = this.addressFields;
    const card = this.cardDetails;

    if (!address || !address.state || !address.country) return;
    if (!card || !card.funding_source) return;

    const serverHost = localStorage.getItem(`${context}serverHost`);

    fetch(`${serverHost}/surcharging/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: '0',
        currency: 'USD',
        card_brand: card.brands[0],
        card_type: card.funding_source,
        billing_country: address.country,
        billing_state: address.state,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const percentage = parseFloat(data.percentage);
        const el = document.getElementById('surcharge-notice');
        if (percentage > 0) {
          el.textContent = `A surcharge of ${percentage}% will be applied to payments made with this card`;
          el.style.display = 'block';
        } else {
          el.textContent = '';
          el.style.display = 'none';
        }
      })
      .catch(err => {
        console.log('{host} surcharge preview ERROR: ', err); // eslint-disable-line no-console
      });
  },
};

chargify.load({
  selector: '#chargify-form',
  publicKey: localStorage.getItem(`${context}publicKey`),
  securityToken: localStorage.getItem(`${context}securityToken`),
  type: 'card',
  serverHost: localStorage.getItem(`${context}serverHost`),
  gatewayHandle: localStorage.getItem(`${context}gatewayHandle`),
  addressDropdowns: true,

  fields: {
    firstName: {
      selector: '#chargify-form',
      label: 'First Name',
      placeholder: 'John',
      required: true,
    },
    lastName: {
      selector: '#chargify-form',
      label: 'Last Name',
      placeholder: 'Doe',
      required: true,
    },
    number: {
      selector: '#chargify-form',
      label: 'Number',
      placeholder: 'xxxx xxxx xxxx xxxx',
    },
    month: {
      selector: '#chargify-form',
      label: 'Mon',
      placeholder: 'mm',
    },
    year: {
      selector: '#chargify-form',
      label: 'Year',
      placeholder: 'yy',
    },
    cvv: {
      selector: '#chargify-form',
      label: 'CVV',
      placeholder: 'xxx',
      required: true,
    },
    address: {
      selector: '#chargify-billing',
      label: 'Address',
      placeholder: '1234 Hill St',
      required: true,
      maxlength: '70',
    },
    city: {
      selector: '#chargify-billing',
      label: 'City',
      placeholder: 'Austin',
      required: true,
      maxlength: '30',
    },
    state: {
      selector: '#chargify-billing',
      label: 'State',
      placeholder: 'Select...',
      required: true,
      maxlength: '2',
    },
    zip: {
      selector: '#chargify-billing',
      label: 'Zip Code',
      placeholder: '10001',
      required: true,
      maxlength: '5',
    },
    country: {
      selector: '#chargify-billing',
      label: 'Country',
      placeholder: 'Select...',
      required: true,
      maxlength: '2',
    },
  },
}, {
  onAddressChange: function(data) {
    surchargeState.addressFields = data.addressFields;
    surchargeState.fetchPreview();
  },
  onCardDetailsChange: function(cardDetails) {
    surchargeState.cardDetails = cardDetails;
    surchargeState.fetchPreview();
  },
});
