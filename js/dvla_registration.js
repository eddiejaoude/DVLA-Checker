window.onload = init;

function init()
{
    var formElem = document.getElementById('dvla-registration-lookup');

    if ( formElem.length === 0 || !formElem.elements ) return;

    var customValidation = function(form)
    {

        for ( var i = 0; i < form.elements.length; i++ )
        {
            
            var formInput = form.elements[i].tagName.toLowerCase();

            if ( formInput === "button" || formInput === "label" ) continue;

            instantiateMethods(form.elements[i]);
        }

    };

    customValidation(formElem);

    function formHandler(event)
    {

        event.preventDefault();

        if ( !this.checkValidity() )
        {
            alert("Form is not valid!");
            return;
        }

        var xhr = new XMLHttpRequest(),
            regNumber = this.querySelector('*[name="reg_number"]').value;

        xhr.open('POST', site_url + '/wp-content/plugins/dvla-checker/dvla-checker.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function()
        {
            if ( xhr.status !== 200 )
            {
                alert('Request failed and returned a status code of: ' + xhr.status);
            }
        };

        xhr.send(encodeURI('reg_number=' + regNumber ));

        console.log(xhr);
    }


    if ( formElem.addEventListener )
    {
        formElem.addEventListener('submit', formHandler, false);
    }

    else 
    {
        formElem.addEventListener('onsubmit', formHandler, false);
    }

    for ( var i = 0; i < formElem.elements.length; i++ )
    {

        var formInput = formElem.elements[i];

        formInput.addEventListener("keyup", function()
        {
            customValidation(formElem);
        });
    }
}
