
MyApp.controller("mainController", function ($scope, $http) {
    
    //INIT CONTROLLER
    $scope.Init = function () {
        $('#phoneNumber').inputmask("(999) 999-9999");
        $scope.filtro = {
            Page: 1,
            Take: 0,
            searchText: ''
        };        

        GetEmployeeList();
    }

    //search employees method
    $scope.searchEmployees = () => {
        if ($scope.filtro.searchText.length > 0)
            $scope.filtro.Take = 6;
        else
            $scope.filtro.Take = 0;

        GetEmployeeList();
    }

    //get employee list from API
    function GetEmployeeList() {
        $http.post(`${ApiServer}/Employees/GetEmployeeList`, $scope.filtro, headersApi)
            .then(function (result) {
                $scope.EmployeeList = result.data;
                //console.log('lista de usuarios', $scope.ListaUsuarios);
            })
            .catch(function (result) {
                console.log("Error while getting employee list...");
            });
    }

    //configure object to add new employee
    $scope.startAddNewEmployee = () => {
        $scope.EmployeeTemp = {
            EmployeeId: 0
        };
        $('#addEmployeeModal').modal('show');
    }

    //configure object to update employee info
    $scope.startEditEmployee = (oldEmployee) => {
        $scope.EmployeeTemp = {
            EmployeeId: angular.copy(oldEmployee.employeeId),
            EmployeeLastName: angular.copy(oldEmployee.employeeLastName),
            EmployeeFirstName: angular.copy(oldEmployee.employeeFirstName),
            EmployeePhone: angular.copy(oldEmployee.employeePhone),
            EmployeeZip: angular.copy(oldEmployee.employeeZip),
            HireDate: angular.copy(moment(oldEmployee.hireDate).format('MM/DD/YYYY'))
        };

        $('#addEmployeeModal').modal('show');
    }

    //save employee method
    $scope.AddOrUpdateEmployee = () => {
        //check if date is valid
        $scope.EmployeeTemp.HireDate = new Date($scope.EmployeeTemp.HireDate);
        $scope.EmployeeTemp.validDate = isValidDate($scope.EmployeeTemp.HireDate);

        //if date is not valid, reset date field
        if (!$scope.EmployeeTemp.validDate)
            $scope.EmployeeTemp.HireDate = undefined;

        //validate required form fields
        if ($('#addUsrForm').is(':valid') && $scope.EmployeeTemp.validDate) {            
            $http.post(`${ApiServer}/Employees/AddOrUpdateEmployee`, $scope.EmployeeTemp, headersApi)
            .then(function (result) {
                if (result.data) {
                    $('#addEmployeeModal').modal('hide');
                    ShowMessage('Employee saved!');
                    $scope.EmployeeTemp = {
                        EmployeeId: 0
                    };
                    GetEmployeeList();
                }
                else
                    ShowMessage('Error while saving employee...');
            })
            .catch(function (result) {
                console.log("Error check results");
            });
        }
    }

    //show result request on tooltip
    function ShowMessage(message ) {
        document.getElementById('toasttittle').innerHTML = message;
        var toastLiveExample = document.getElementById('liveToast');

        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();

        setTimeout(function () {
            toast.hide();
        }, 2000);
    }

    //ask to users to be sure of deleting employee
    $scope.askDeleteEmployee = (id) => {
        if (confirm('Are you sure to delete this employee?') == true) {
            deleteEmployee(id);
        }
    }

    //delete employee method
    function deleteEmployee(id) {
        $http.get(`${ApiServer}/Employees/DeleteEmployee/${id}`, headersApi)
            .then(function (result) {
                if (result.data) {
                    ShowMessage('Employee deleted!');
                    $scope.EmployeeTemp = {
                        EmployeeId: 0
                    };
                    GetEmployeeList();
                }
                else
                    ShowMessage('Error while deleting employee...');
            })
            .catch(function (result) {
                console.log("Error check results");
            });
    }

});