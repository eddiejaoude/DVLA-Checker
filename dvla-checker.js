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

    var isInvalid = page.evaluate(function ()
    {
        var radioBtn = document.getElementById("Correct_True");

        return ( radioBtn !== null && radioBtn.length > 0 ? true : false );
    });

    if (!isInvalid)
    {
        console.log(false);
        phantom.exit();
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
        var detailItems = document.querySelectorAll('.column-half, .list-summary-item');
        for (var i = 0; i < detailItems.length; i++)
        {
            if (i === detailItems.length - 1) continue;

            if (i > 1)
            {
                var detailTitle = detailItems[i].getElementsByTagName("span")[0].innerText;
                var detailValue = detailItems[i].getElementsByTagName("strong")[0].innerText.toLowerCase();
                detailValue = detailTitle + detailValue.charAt(0).toUpperCase() + detailValue.substr(1);
                carInfo.push(detailValue);
                continue;
            }

            var headingTitle = detailItems[i].querySelector(".incorrect-status .summary").innerText;
            headingTitle = String(headingTitle).replace(/([^\s]+)/, '');
            headingTitle = headingTitle.trim();
            headingTitle = headingTitle.replace("?", ":");

            var headingStatus = headingTitle + String(detailItems[i].querySelector("h2.heading-large").innerText.substr(2));

            carInfo.push(headingStatus);
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
