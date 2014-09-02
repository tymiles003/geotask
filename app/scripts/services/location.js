angular.module('donebytheway.services')
.factory('locationService', function(storage){
    var locationService = {
        locations: [],
        selectedLocationReminder: undefined,
        createNew: function(options){
            options = options || { };
            return {
                id: UUIDjs.create().toString(),
                name: options.name,
                coords: options.coords
            };
        },
        remove: function(location){
            this.locations.splice(this.locations.indexOf(location), 1);
        },
        findById: function(locationId){
            return this.locations.firstOrDefault(function(location){ return location.id === locationId; });
        },
        saveChanges: function(){
            storage.setItem('donebytheway-locations', angular.toJson(this.locations));
        },
        loadFromStorage: function(){
            this.initialized = storage.getItem('donebytheway-locations').then(function(result){
                locationService.locations = angular.fromJson(result);
            });
            return this.initialized;
        }
    };
    locationService.loadFromStorage();

    return locationService;
});