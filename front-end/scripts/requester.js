async function requester(url, method, authneed, contentType = null, data = {}, isFormData = false) {
    let definedHeaders = {}
    if (contentType) {
        definedHeaders['Content-Type'] = contentType
    }
    if (authneed == true) {
        var theToken = await localStorage.getItem('tkn');
        definedHeaders['x-access-token'] = theToken
    }
    let customBody = undefined
    if (method == 'PUT' || method == 'POST') {
        customBody = {}
        if (isFormData == true) {
            customBody = data
        }
        else {
            customBody = await JSON.stringify(data)
        }
    }

    try {
        let customRequest = await fetch(
            url,
            {
                method: method,
                headers: definedHeaders,
                body: customBody
            }
        );
        let result = await customRequest.json();
        return (result)
    }
    catch (err) {
        let result = {}
        result.statusCode = 500
        result.success = false
        result.data = { error: 'مشکلی در ارتباط با سرور به وجود آمد! لطفا مجددا تلاش کنید.' }
        return (result)
    }
}

module.exports = requester;

