
document.getElementById('credit-card-info').style.display = 'none';
document.getElementById('billing-info').style.display = 'none';
document.getElementById('bank-info').style.display = 'none';
document.getElementById('example-card-numbers').style.display = 'none';

const chargify = new Chargify();
const context = localStorage.getItem('context');

chargify.load({
    // selector where the iframe will be included in the host's HTML (i.e. '#chargify-form')
    // optional if you have a `selector` on each and every field
    selector: '#chargify-form',

    // (i.e. '1a2cdsdn3lkn54lnlkn')
    publicKey: localStorage.getItem(`${context}publicKey`),

    type: 'direct_debit',

    addressDropdowns: true,

    currency: 'CAD',

    serverHost: localStorage.getItem(`${context}serverHost`),
    securityToken: localStorage.getItem(`${context}securityToken`),
    fields: {
        firstName: {
            selector: '#chargify-form',
            required: true,
        },
        lastName: {
            selector: '#chargify-form',
            required: true,
        },
        address: {
            selector: '#chargify-form',
            required: true,
        },
        address2: {
            selector: '#chargify-form',
        },
        country: {
            selector: '#chargify-form',
        },
        city: {
            selector: '#chargify-form',
            required: true,
        },
        state: {
            selector: '#chargify-form',
            required: true,
        },
        zip: {
            selector: '#chargify-form',
            required: true,
        },
    },
},{
    onDirectDebitReceiveConfigurationError: function(error) { console.log('onDirectDebitReceiveConfigurationError: ' + error) },
    onReceivedDirectDebitConfiguration: function() { console.log('onReceivedDirectDebitConfiguration') },
});
