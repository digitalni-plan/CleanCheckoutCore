define([
    'jquery',
    'Magento_Ui/js/lib/validation/validator'
], function ($, validator) {
    'use strict';

    return function () {

        let isHR_VAT_valid = function (v) {
            if (v.length !== 11) {
                return false;
            }

            // According to this 12345678903 is valid OIB
            if (v.match(/\d{11}/) === null) {
                return false;
            }

            let calculated = 10;

            for (const digit of v.substring(0, 10)) {
                calculated += parseInt(digit);
                calculated %= 10;

                if (calculated === 0) {
                    calculated = 10;
                }

                calculated *= 2;
                calculated %= 11;
            }

            const check = 11 - calculated;

            if (check === 10) {
                check = 0;
            }

            return check === parseInt(v[10]);
        };

        let validateVatIdOrEmpty = function(v) {
            if (v.toString() === '') {
                return true;
            }
            return isHR_VAT_valid(v);
        };

        $.validator.addMethod(
            'rubic-checkout-validate-vat-id-or-empty',
            validateVatIdOrEmpty,
            $.mage.__('Please enter valid OIB, VAT ID or leave empty')
        );

        /** validator addRule method allow to use our custom validation with ui component field (checkout) */
        validator.addRule(
            'rubic-checkout-validate-vat-id-or-empty',
            validateVatIdOrEmpty,
            $.mage.__('Please enter valid OIB, VAT ID or leave empty')
        );
    };
});
