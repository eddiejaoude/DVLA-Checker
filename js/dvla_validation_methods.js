window.onload = instantiateMethods;

function instantiateMethods(formInput)
{

    switch (formInput.type)
    {
        case "text":
            if ( formInput.value.length < 1 || !formInput.value.replace(/\s/g, '').length )
            {
                formInput.setCustomValidity("Please enter a value");
            }
            else if (formInput.value.length >= 1 && formInput.value.length < 7)
            {
                formInput.setCustomValidity("Please enter at least 7 characters.");
            }
            else formInput.setCustomValidity("");
        break;

        default:
            console.log(formInput.type);
        break;
    }
}
