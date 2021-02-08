/**
 * Copyright © 2018 Rubic. All rights reserved.
 * See LICENSE.txt for license details.
 */
define([
    'jquery',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Customer/js/action/check-email-availability',
    'Magento_Checkout/js/checkout-data',
], function (
    $,
    stepNavigator,
    checkEmailAvailability,
    checkoutData
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
                        'isEmailInputEnabled',
                        'isRegisterButtonVisible',
                        'isGuestButtonVisible',
                        'isNextButtonVisible',
                        'isEmailInvalid'
                    ]);

                this.isEmailInputEnabled(true);
                this.isEmailInvalid(false);

                //this.email.subscribe(this.emailAddressChanged, this);
                // this.isPasswordVisible.subscribe(this.haveAccountChanged, this);
                this.isNextButtonVisible(this.isPasswordVisible() === false);
                return this;
            },

            nextAction: function () {
                // this.emailAddressChanged(this.email());

                if (this.validateEmail()) {
                    // this.isEmailInvalid(false);
                    this.checkEmailAvailability();
                } else {
                    this.isEmailInvalid(false);
                    this.isEmailInvalid(true);
                    this.updateButtons();
                }




            },

            // emailHasChanged: function () {
            //
            // },


            checkEmailAvailability: function () {
                this.validateRequest();
                this.isEmailCheckComplete = $.Deferred();
                this.isLoading(true);
                this.checkRequest = checkEmailAvailability(this.isEmailCheckComplete, this.email());

                $.when(this.isEmailCheckComplete).done(function () {
                    this.isPasswordVisible(false);
                    this.updateButtons();
                }.bind(this)).fail(function () {
                    this.isPasswordVisible(true);
                    this.updateButtons();
                    checkoutData.setCheckedEmailValue(this.email());
                }.bind(this)).always(function () {
                    this.isLoading(false);
                }.bind(this));
            },

            continueAsGuest: function () {
                stepNavigator.next();
            },

            allowEmailInput: function () {
                this.isEmailInputEnabled(true);
                this.isPasswordVisible(false);
                this.isNextButtonVisible(true);
                this.isRegisterButtonVisible(false);
                this.isGuestButtonVisible(false);
            },

            updateButtons: function () {

                if (this.validateEmail()) {
                    this.isEmailInputEnabled(false);
                    this.isNextButtonVisible(false);
                    this.isRegisterButtonVisible(true);
                    this.isGuestButtonVisible(true);
                } else {
                    this.isEmailInputEnabled(true);
                    this.isNextButtonVisible(true);
                    this.isRegisterButtonVisible(false);
                    this.isGuestButtonVisible(false);
                    return;
                }


                if (this.isPasswordVisible()) {
                    console.log('isPasswordVisible = true');
                    this.isEmailInputEnabled(false);
                    this.isNextButtonVisible(false);
                    this.isRegisterButtonVisible(false);
                    this.isGuestButtonVisible(false);
                    return;
                }





            }

            // emailAddressChanged: function (email) {
            //     this.isRegisterButtonVisible(this.validateEmail());
            //     this.isGuestButtonVisible(this.validateEmail());
            //     this.isNextButtonVisible(false);
            // },
            //
            // haveAccountChanged: function (haveAccount) {
            //     haveAccount = Boolean(haveAccount);
            //     console.log("haveAccount", haveAccount);
            //     if (haveAccount) {
            //         this.isRegisterButtonVisible(false);
            //         this.isGuestButtonVisible(false);
            //         this.isNextButtonVisible(false);
            //     }
            // }
        });
    }
});
