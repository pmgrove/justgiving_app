(function() {

  return {
    events: {
      'app.activated':'init',
      'user.just_giving_short_name.changed': 'lookUpUserEvent',
      'ticket.custom_field_21262112.changed': 'lookUpDonationEvent',
      'getFundraisingPageFromService.done': 'displayUser',
      'getFundraisingPageFromService.fail': 'userNotFound',
      'getDonationsFromService.done': 'displayDonations',
      'getDonationFromService.done': 'displayDonation',
      'getDonationFromService.fail': 'donationNotFound'
    },

    requests: {
      // This is a simple object style.
      getFundraisingPageFromService: function(shortName){
        return {
          url: helpers.fmt('%@/%@/%@/fundraising/pages/%@', this.api_url, this.app_id, this.api_version, shortName),
          type: 'GET',
          dataType: 'json'
        };
      },
      getDonationsFromService: function(shortName){
        return {
          url: helpers.fmt('%@/%@/%@/fundraising/pages/%@/donations', this.api_url, this.app_id, this.api_version, shortName),
          type: 'GET',
          dataType: 'json'
        };
      },
      getDonationFromService: function(donationId){
        return {
          url: helpers.fmt('%@/%@/%@/donation/%@', this.api_url, this.app_id, this.api_version, donationId),
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    init: function() {
      console.log(this.currentLocation());
      this.app_id = this.setting('app_id');
      this.api_url = this.setting('api_url');
      this.api_version = this.setting('api_version');

      switch(this.currentLocation()){
        case "user_sidebar":
          if (this.user().customField('just_giving_short_name') === undefined){
            this.switchTo("user_search");
          } else {
            this.lookUpUser();
          }
          break;
        case "ticket_sidebar":
        debugger;
          if (this.ticket().customField("custom_field_21262112") === ""){
            this.switchTo("donation_search");
          } else {
            this.lookUpDonation();
          }
          break;
      }
    },

    lookUpUserEvent: _.debounce(function(){
      this.lookUpUser();
    }, 500),

    lookUpDonationEvent: _.debounce(function(){
      this.lookUpDonation();
    }, 500),

    lookUpUser: function(){
      this.switchTo('loading_screen');
      this.ajax('getFundraisingPageFromService', this.user().customField('just_giving_short_name'));
    },

    lookUpDonation: function(){
      this.switchTo('loading_screen');
      this.ajax('getDonationFromService', this.ticket().customField("custom_field_21262112"));
    },

    displayUser: function(data){
      this.switchTo('user_details', data);
      this.ajax('getDonationsFromService', this.user().customField('just_giving_short_name'));
      console.log(data);
    },

    displayDonation: function(data){
      this.switchTo('donation_details', data);
      console.log(data);
    },

    displayDonations: function(data){
      console.log(data);
      this.$('#donations').html(this.renderTemplate('donations', data));
      this.$('#donations').show();
      this.$('#donations-loading').hide();
    },

    userNotFound: function(){
      this.switchTo('user_not_found');
    },

    donationNotFound: function(){
      this.switchTo('donation_not_found');
    }

  };

}());
