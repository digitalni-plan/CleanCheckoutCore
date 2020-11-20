/**
 * Copyright © 2018 Rubic. All rights reserved.
 * See LICENSE.txt for license details.
 */
define([
    'jquery',
    'Magento_Checkout/js/model/step-navigator',
], function (
    $,
    stepNavigator
) {
    'use strict';

    return function (target) {
        return target.extend({
            /**
             * Reduce form delay when checking if entered email already exists.
             */
            initialize: function () {
                this.checkDelay = 500;
                return this._super();
            },

            /**
             * Initializes observable properties of instance
             *
             * @returns {Object} Chainable.
             */
            initObservable: function () {
                this._super()
                    .observe([
                        'isRegisterButtonVisible',
                        'isGuestButtonVisible',
                        'isNextButtonVisible'
                    ]);

                this.email.subscribe(this.emailAddressChanged, this);
                this.isPasswordVisible.subscribe(this.haveAccountChanged, this);
                this.isNextButtonVisible(this.isPasswordVisible() === false);
                return this;
            },

            nextAction: function () {
                this.emailAddressChanged(this.email());
            },

            continueAsGuest: function () {
                stepNavigator.next();
            },

            emailAddressChanged: function (email) {
                this.isRegisterButtonVisible(this.validateEmail());
                this.isGuestButtonVisible(this.validateEmail());
                this.isNextButtonVisible(false);
            },

            haveAccountChanged: function (haveAccount) {
                haveAccount = Boolean(haveAccount);
                if (haveAccount) {
                    this.isRegisterButtonVisible(false);
                    this.isGuestButtonVisible(false);
                    this.isNextButtonVisible(false);
                }
            }
        });
    }
});
