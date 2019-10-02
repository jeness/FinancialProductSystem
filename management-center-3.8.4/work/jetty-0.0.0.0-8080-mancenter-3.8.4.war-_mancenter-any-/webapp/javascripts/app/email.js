function smtpConfigAction() {
    $("#setSmtpButton").append("<span class=\"spinner\"><i class=\"icon-spin icon-refresh\"></i></span>")
    $("#setSmtpButton").addClass("active")
    $("#setupSMTPMessage").html("")
    var data = {operation:"saveEmailConfig", emailconfigname:"defaultConfig", username:$("#userNameInput").val(),
        password:$("#userPasswordInput").val(), hostname:$("#hostAdressInput").val(), portnum:$("#hostPortInput").val(),
        tlsenabled:$("#tlsEnabledInput").is(':checked'), isactive:"true", intervalsec:$("#intervalSecInput").val()}
    console.log(data)
    opcall(data)
}


function saveEmailConfig(data) {
    $("#setSmtpButton").removeClass("active")
    $("#setSmtpButton span").remove(".spinner")
    if (data == "success") {
        $("#setupSMTPMessage").html("Successfully setup SMTP configuration.")
        $(".login-div").dialog('close')
    }
    else if (data == "fail") {
        $("#setupSMTPMessage").html("Wrong SMTP configuration. Or your SMTP server has connectivity problems.")
    }
}
