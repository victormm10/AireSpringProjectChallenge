
var rootserver = 'https://localhost:44348';
var ApiServer = 'https://localhost:44396/api';

var MyApp = angular.module("MyApp", []);

var headersApi = {
    headers: {
        'Content-Type': 'application/json'
    }
};

function GetUrlParam(url) {
    //var str = "http://localhost:25980/Sistemas/Detalles/1";
    var arr = url.split("/");
    var index = arr.length - 1;
    var Id = arr[index];
    //alert('Id : ' + Id);

    return Id;
}
$("#datepicker").datepicker();

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}