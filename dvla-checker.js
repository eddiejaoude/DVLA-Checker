var page = require('webpage').create(),
    system = require('system'),
    args = String(system.args.slice(1));

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

page.viewportSize = {
  width: 800,
  height: 800
};

function login_callback (status) {
    if (status != "success") {
        console.log("Failure loading login page");
        return;
    }

    page.onLoadFinished = post_login_callback;

    page.evaluate(function (regNumber) {
        document.querySelector("#Vrm").value=regNumber;
        document.querySelector("form").submit();
    }, args);

}

function post_login_callback (status) {
    if (status != "success") {
        console.log("Failure logging in");
        return;
    }

    page.evaluate(function () {
        document.getElementById("Correct_True").checked = true;
        document.querySelector('form[action="/ViewVehicle"]').submit();
    });

    page.onLoadFinished = getResults;

}


function getResults (status) {

    if (status != "success") {
        console.log("Failure logging in");
        return;
    }

    var registrationDetails = page.evaluate(function(){
        var carInfo = [];
        var detailItems = document.querySelectorAll('h2.heading-large, .list-summary-item');
        for (var i = 0; i < detailItems.length; i++)
        {
            if (i === detailItems.length - 1) continue;

            if (i > 1)
            {
                var detailValue = detailItems[i].getElementsByTagName("strong")[0].innerText.toLowerCase();
                detailValue = detailValue.charAt(0).toUpperCase() + detailValue.substr(1);
                carInfo.push(detailValue);
                continue;
            }

            carInfo.push(detailItems[i].innerText.substr(2));
        }
        return carInfo;
    });

    for (var i = 0; i < registrationDetails.length; i++)
    {
        console.log(registrationDetails[i]);
    }

    phantom.exit();

}

page.onLoadFinished = login_callback;
page.open("https://vehicleenquiry.service.gov.uk/ViewVehicle");
