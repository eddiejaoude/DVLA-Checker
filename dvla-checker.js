var page = require('webpage').create(), fs = require('fs'), config = fs.exists('./config.json') ? require('./config.json') : false, system = require('system'), args = String(system.args.slice(1));

if (!config)
{
    console.log("config.json does not exist");
    phantom.exit();
}

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

<<<<<<< HEAD
=======
page.viewportSize = {
  width: config.width,
  height: config.height
};

>>>>>>> ed004214871858d6aaa7da5092862928d3039a0f
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

<<<<<<< HEAD
    page.render("test.png");

    page.evaluate(function (config) {
        document.getElementById(config.radio).checked = true;
=======
    page.evaluate(function (config) {
        document.querySelector('input[type="radio"]').checked = true;
>>>>>>> ed004214871858d6aaa7da5092862928d3039a0f
        document.querySelector(config.confirmForm).submit();
    }, config);

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
page.open(config.host + "/ViewVehicle");
