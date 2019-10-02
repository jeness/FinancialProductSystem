function saveLicenseAction() {
    var key = $("#licenseKeyInput").val()
    var data = {operation:"savelicense_getLicenseInfo", key:key}
    opcall(data)
}

function updateLicenseAction() {
    var key = $("#updateLicenseKeyInput").val()
    $("#updateLicenseKeyInput").val('')
    var data = {operation:"updatelicense", key:key}
    opcall(data)
}

function updatelicense(data) {
    if (data.expiry_date == 0) {
        $.growl.error({message: "Invalid license key."});
    }
    else if (data.expiry_date == 1) {
        $("#licenseUpdateInfo").html("The license key entered has been expired.")
        $("#licenseUpdateInfo").css('color', 'red')
    }
    else if (data.expiry_date > 1) {
        $("#licenseUpdateInfo").html("Your license " + data.license_type + " has been activated. License end date:" + moment(new Date(data.expiry_date)).format("MMMM, DD YYYY"))
        $("#licenseInfo").html("Your license " + data.license_type + " has been activated. License end date:" + moment(new Date(data.expiry_date)).format("MMMM, DD YYYY"))
        $('.updatelicense').hide()
        $("#licenseUpdateInfo").css('color', 'green')
        resetsidebar()
        handlesidebar(data.license_type)
    }
}

function licenseinfo(data) {
    if (data.expiry_date == 0 || data.expiry_date == 1) {
    $("#licenseUpdateInfo").html("Your license has been expired. You can continue in developer Mode (Limited to 2 nodes) or renew your license.")
    $("#licenseUpdateInfo").css('color', 'red')
    } else if (data.expiry_date > 1) {
        $("#licenseUpdateInfo").html("Your license " + data.license_type + " is active. License end date: " + moment(new Date(data.expiry_date)).format("MMMM, DD YYYY"))
        $("#licenseUpdateInfo").css('color', 'green')
    }
}

function savelicense(data) {
    if (data.expiry_date == 0)
        $("#licenseSaveInfo").html("Invalid license key.")
    else if (data.expiry_date == 1)
        $("#licenseSaveInfo").html("The license key entered has been expired.")
    else if (data.expiry_date > 1) {
        $("#licenseSaveInfo").html("Your license " + data.license_type + " has been activated. License end date:" + moment(new Date(data.expiry_date)).format("MMMM, DD YYYY"))
        $("#licenseInfo").html("Your license " + data.license_type + " has been activated. License end date:" + moment(new Date(data.expiry_date)).format("MMMM, DD YYYY"))
        $("#applyWarnDiv").hide()
        $("#licenseKeyDialog").dialog('close')
        resetsidebar()
        handlesidebar(data.license_type)
    }
}

function showEnterLicense() {
    $("#licenseKeyDialog").dialog('open')
    $('#licenseKeyDialog').keypress(function(e) {
        if (e.keyCode == 13 && e.target.type != "textarea") {
            saveLicenseAction();
        }
    });
}

function showUpdateLicense() {
    $('.updatelicense').show()
    $("#updateLicenseKeyDialog").dialog('open')
    $('#updateLicenseKeyDialog').keypress(function(e) {
        if (e.keyCode == 13 && e.target.type != "textarea") {
            updateLicenseAction();
        }
    });
}
