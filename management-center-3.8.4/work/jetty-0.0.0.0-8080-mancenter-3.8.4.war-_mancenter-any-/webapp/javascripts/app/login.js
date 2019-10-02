
function clusterConnect() {
    activeCluster = $("[name='clusterradiolist']:checked").val();
    document.title = activeCluster + " | Management Center";
    $('#activeClusterName').html(activeCluster);
    $(".login-div").dialog('close');
    tabs.newTab('Home','home','icon-home');
    refreshpage(0,true);

}

function clusternames(user) {
    admin = user.admin
    $('#clusterList').empty()
    clusterList = new Array()
    var nocluster = true
    var clusterNames = user.clusterNames;
    for (var i = 0; i < clusterNames.length ; i++) {
        var cluster = clusterNames[i]
        $('#clusterList').append("<label class='radio'><input id='clusterradiolist" + i + "' type='radio' name='clusterradiolist' value='" + cluster + "'  /><span class='badge badge-inverse'>" + cluster + "</span></label>")
        clusterList.push(cluster)
        $('#clusterDropdownList').append("<li><a onclick='switchCluster(\""+ cluster +"\")'><i class=\"icon-caret-right\"></i><span>" + cluster + "</span></a></li>")
        nocluster = false
    }

    $("[name='clusterradiolist']:first").attr("checked", true)


    $("#loginModal").modal('hide')

    if (user.licenseInfo == null || user.licenseInfo == 'EXPIRED') {
        $("#applyWarnDiv").show()
        if (user.licenseInfo == null)
            $("#licenseInfo").html("Developer Mode: Limited to 2 nodes")
        else if (user.licenseInfo == 'EXPIRED'){
            $("#licenseInfo").html("Your license has been expired. You can continue in developer Mode (Limited to 2 nodes) or renew your license.")
        }
        if($('#enterLicenseButton').size()==0)
        {
            var buttons = $( "#clusterConnectDialog" ).dialog( "option", "buttons");
            $( "#clusterConnectDialog" ).dialog("option", "buttons", [buttons[0], {id:"enterLicenseButton", text:"Enter License",click:function () {
                showEnterLicense()
            }}]);
        }
    }
    else {
        $("#licenseInfo").html(user.licenseInfo)
    }

    refreshpage(refreshSeconds);
    if(nocluster == true){
        $("#noDataDialog").dialog( "open" );
    }else {
        $('#clusterConnectDialog').dialog('open')
        $("#clusterConnectButton").focus()
    }
}


function changeUrlAction() {
    var data = {
        operation: "changeurl",
        clusterName: $("#clusterNameInput").val(),
        password: $("#clusterPasswordInput").val(),
        memberIP: $("#memberIPInput").val(),
        memberPort: $("#memberPortInput").val(),
        serverUrl: $("#serverUrlInput").val(),
        sslEnabled: $("#sslEnabledCheckbox").is(':checked')
    }
    console.log(data)
    opcall(data)
}


function changeurl(data) {
    if (data == "wrongpass") {
        $("#changeUrlMessage").html("Wrong cluster name/password.")
    } else if (data == "success") {
        $("#changeUrlMessage").html("Successfully assigned new URL.")
        $(".login-div").dialog('close')
        getVersionAction(); // re - init
    } else if (data == "notallowed") {
        $("#changeUrlMessage").html("URL change is disabled. To enable set system property 'hazelcast.mc.url.change.enabled' to true")
    } else {
        $("#changeUrlMessage").html("Problem occured. Check member IP/Port and be sure the member is running. " +
            "Remember to check SSL box if SSL is enabled for your cluster.")
    }
}

function changeClusterVersion(version) {
    var newClusterVersion = $("#changeClusterVersionInput").val();

    var newClusterVersionFloat = parseFloat(newClusterVersion);
    var currentVersionFloat = parseFloat(version);
    if(newClusterVersionFloat <= currentVersionFloat){
        $.growl.error({message: "Please enter version(major.minor) released after " + version});
        return;
    }

    var cluster = $("#clusterVerNameInput").val();
    var password = $("#clusterVerPasswordInput").val();
    data = {
        cluster: cluster,
        password: password,
        version: newClusterVersion,
        operation: "changeClusterVersion"
    }
    console.log(data)
    opcall(data)

}

function changeclusterversion(result) {
    $("#changeVersionDialog").dialog("close")
    if (result == 'success')
        $.growl.notice({message: "Cluster Version has been successfully changed."});
    else {
        $.growl.error({message: "There is a problem with changing cluster version."});
        $.growl.error({message: result});
    }
}

function reloadSecurityConfig() {
    var request = $.ajax({
        url: "user.do",
        data: {operation:"reloadSecurityConfig"},
        cache: false,
        dataType: "json"
    });

    request.done(function (resp) {
       for (key in resp) {
           if (key == "fail") {
               $.growl.error({message: resp[key]})
           } else if (key == "success") {
               $.growl.notice({message: resp[key]})
           }
       }
    });
}
