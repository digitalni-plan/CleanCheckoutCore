/**
 * Copyright © 2018 Rubic. All rights reserved.
 * See LICENSE.txt for license details.
 */
define([
    'jquery'
], function (
    $
) {
    'use strict';

    return function (target) {
        return target.extend({
            formNextStepSelector: '#checkoutSteps form.form-next-step',

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
                        'isLoginButtonVisible'
                    ]);

                this.email.subscribe(this.emailAddressChanged, this);
                this.isPasswordVisible.subscribe(this.haveAccountChanged, this);

                var haveAccount = Boolean(this.resolveInitialPasswordVisibility());
                this.isRegisterButtonVisible(!haveAccount);
                this.isLoginButtonVisible(haveAccount);
                this.displayFormNavigateToNextStep(!haveAccount);

                return this;
            },

            emailAddressChanged: function (email) {
                this.isRegisterButtonVisible(this.validateEmail());
                this.displayFormNavigateToNextStep(this.validateEmail());
            },

            haveAccountChanged: function (haveAccount) {
                haveAccount = Boolean(haveAccount);
                if (haveAccount) {
                    this.isRegisterButtonVisible(false);
                    this.displayFormNavigateToNextStep(false);
                }
                this.isLoginButtonVisible(haveAccount);
            },

            displayFormNavigateToNextStep: function (value) {
                var formNextStep = $(this.formNextStepSelector);
                if (value) {
                    formNextStep.show();
                } else {
                    formNextStep.hide();
                }
            }
        });
    }
});
