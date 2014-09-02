angular.module('donebytheway.controllers')
    .controller('LocationMapCtrl', function($scope,$ionicActionSheet, $location, $log, $timeout, $ionicNavBarDelegate, $stateParams, taskService, locationService, leafletEvents) {
        var taskId = $stateParams.taskId;
        var marker = {
            draggable: true,
            message: "Lokalizacja zadania",
            icon: {}
        };
        var locationReminder = locationService.selectedLocationReminder;

        if (!locationReminder) {
            $location.path('/');
            return;
        }

        marker.lat = locationReminder.location.coords.latitude;
        marker.lng = locationReminder.location.coords.longitude;
        $scope.locationName = locationReminder.location.name;
        $scope.whenIgetCloser = locationReminder.whenIgetCloser;
        
        $scope.map = {
            center: {
                lat: marker.lat,
                lng: marker.lng,
                zoom: 12
            }
        };
        $scope.paths = {
            circle: {
                type: "circle",
                radius: locationReminder.radius,
                latlngs: marker,
                clickable: true
            }
        };
        $scope.markers = {
            marker: marker
        };

        function saveReminder(newLocation){
            var task = taskService.findById(taskId);
            locationReminder.location = newLocation;
            locationReminder.radius = $scope.paths.circle.radius;
            locationReminder.whenIgetCloser = $scope.whenIgetCloser;

            if(task.locationReminders.indexOf(locationReminder) < 0){
                task.locationReminders.push(locationReminder);    
            }
            taskService.saveChanges();
        };

        function saveReminderAndAddLocation(newLocation){
            saveReminder(newLocation);
            locationService.locations.push(newLocation);
            locationService.saveChanges();
        };

        $scope.edit = function(){
            var newName = prompt('Wpisz nazwę lokalizacji', $scope.locationName);
            if(newName){
                $scope.locationName = newName;
            }
        };

        $scope.save = function() {
            var actionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Zapisz' },
                    { text: 'Zapisz i dodaj nową lokalizację' }
                ],
                cancelText: 'Anuluj',
                buttonClicked: function(index){
                    var newLocation = locationService.createNew({
                        name: $scope.locationName,
                        coords: {
                            latitude: marker.lat,
                            longitude: marker.lng
                        }
                    });
                    switch(index){
                        case 0:  
                            saveReminder(newLocation);
                            break;
                        case 1: 
                            saveReminderAndAddLocation(newLocation);
                            break;
                    }
                    $location.path('/task/'+taskId);
                    return true;
                }
            })
        };

        $scope.chooseWhenIgetCloser = function() {
            $scope.whenIgetCloser = true;
        };
        $scope.chooseWhenIamLeaving = function() {
            $scope.whenIgetCloser = false;
        };

        $scope.goBack = function() {
            $ionicNavBarDelegate.back();
        };
    });