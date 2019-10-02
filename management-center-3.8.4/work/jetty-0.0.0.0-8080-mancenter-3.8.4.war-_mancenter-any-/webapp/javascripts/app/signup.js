function showSecurityConfigParams(securityProvider) {
    $.ajax({
        url: 'user.do',
        data: {
            operation: 'getSecurityConfigParams',
            provider: securityProvider
        },
        cache: false,
        dataType: 'json'
    }).done(function (resp) {
        $('#securityProviderConfigForm').empty();
        $('#securityProviderConfigForm').append($('<input>', {type: 'hidden', id: 'providerHiddenInput'}));
        $('#providerHiddenInput').val(securityProvider);
        $.each(resp['success'], function (i, item) {
            var inputElementId = item['name'] + 'Input';

            var div = $('<div>', {class: 'control-group'});
            var label = $('<label>', {for: inputElementId, class: 'control-label'});
            label.append(item['display']);

            var innerDiv = $('<div>', {class: 'controls'});

            var input = null;
            if (item['type'] == 'String') {
                var inputType = item['secret'] ? 'password' : 'text';
                var attrs = {type: inputType, id: inputElementId};
                if (item['defaultValue'] != null && item['defaultValue'] != '') {
                    attrs['value'] = item['defaultValue'];
                }
                input = $('<input>', attrs);
            } else if (item['type'] == 'Boolean') {
                input = $('<input>', {type: 'checkbox', id: inputElementId});
            }
            if (input != null) {
                innerDiv.append(input);
            }

            div.append(label);
            div.append(innerDiv);

            $('#securityProviderConfigForm').append(div);
        });
    });
}

function saveSecurityProviderConfiguration() {
    var myData = {
        operation: 'saveSecurityProviderConfiguration'
    };

    $('#securityProviderConfigForm').find('input').each(function () {
        var inputValue = null;
        if ($(this).attr('type') == 'checkbox') {
            inputValue = $(this).is(':checked');
        } else {
            inputValue = $(this).val();
        }
        myData[$(this).attr('id')] = inputValue;
    });

    $.ajax({
        url: 'user.do',
        data: myData,
        cache: false,
        dataType: 'json'
    }).done(function(resp) {
        for (key in resp) {
            if (key == "fail") {
                $.growl.error({message: resp[key]});
            } else if (key == "success") {
                $.growl.notice({message: resp[key]});
                $("#securityProvidersDialog").dialog("close");
            }
        }
    });
}

function checkIfSignUpNeeded() {
    data = {operation:"anyUser"};

    var request = $.ajax({
        url: "user.do",
        data: data,
        cache: false,
        dataType: "json"
    });

    request.done(function (resp) {
        if (resp["anyUser"] == "false") {
            $.ajax({
                url: 'user.do',
                data: {
                    operation: 'getSecurityProviders'
                },
                cache: false,
                dataType: 'json'
            }).done(function(secProvidersResp) {
                if (secProvidersResp["success"]) {
                    $.each(secProvidersResp["success"], function (i, item) {
                        $('#securityProviderSelect').append($('<option>', {
                            value: item,
                            text : item
                        }));
                    });
                    $('#securityProviderSelect').change();

                    $("#securityProvidersDialog").dialog("open");
                    $("#securityProvidersDialog").parent().find(".ui-dialog-titlebar-close").hide();
                }
            });
        }
    });
}

function isPasswordComplexEnough(pswd) {
    if (!pswd.match(/[A-z]/) || !pswd.match(/[A-Z]/) || !pswd.match(/\d/) || pswd.length<8) {
            $.growl.error({message: "Password must meet the following requirements:<br>" +
            "<ul>" +
            "<li> At least one letter</li>" +
            "<li> At least one capital letter</li>" +
            "<li> At least one number</li>" +
            "<li> Be at least 8 characters</li>" +
            "</ul>"});
            return false;
    }
    return true;
}
