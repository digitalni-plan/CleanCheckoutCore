var rules = {
        'validate-min-letters':[
            function (value, element, params) {
                return this.optional(element) || /^[a-zA-Z \-]+$/i.test(value) && value.length >= params;
            },
            'Please enter at least {0} letter without numeric character.' //{0} will be replaced by params
        ],

        /** In case where you need to translate the error message **/
          'validate-min-letters':[
                function (value, element, params) {
                    this.params = params;
                    return this.optional(element) || /^[a-zA-Z \-]+$/i.test(value) && value.length >= params;
                }, function() {
                    return $.mage.__('Please enter at least %1 letters').replace('%1' , this.params)
                }
            ],

        'validate-min-character':[
                function (value, element, params) {
                   this.params = params;
                    return this.optional(element) || /^(.*)+$/i.test(value) && value.length >= params;
                }, function() {
                    return $.mage.__('Please enter at least %1 characters').replace('%1' , this.params);
                }
            ],

        'validate-zip-fr':[
             function(v){
                 return $.mage.isEmptyNoTrim(v) || /(^\d{5}$)/.test(v);
             },
             $.mage.__('Please enter a valid fr zip code.')
        ],

        'validate-alpha-with-spaces:[
            function (v) {
                return $.mage.isEmptyNoTrim(v) || /^[a-zA-Z ]+$/.test(v);
            },
            $.mage.__('Please use only letters (a-z or A-Z) or spaces only in this field.')
        ],
}