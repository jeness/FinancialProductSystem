var namespace = "default"
var clusterList = new Array();
var admin = "0";
var activeRole = "";
var activeCluster = "dev";
var activeSection = "sectionHome";
var activeView = "home";
var activeObject = "";
var curtime = 0;
var refreshSeconds = 5;
var version;
var writeMode = 1
var username = ""
var password = ""
var filterCreateOrEdit = "create";
var codeMirror;
var isResizing = false;
var lastDownX = 0;
var slowOperationDetailHeaderTemplate =
    '    <tr>' +
    '        <td><strong>Stacktrace</strong></td>' +
    '        <td class="valueTd">$stackTrace</td>' +
    '    </tr>';
var slowOperationDetailTemplate =
    '    <tr>' +
    '        <td></td>' +
    '        <td class="valueTd"></td>' +
    '    </tr>' +
    '    <tr>' +
    '       <td><strong>Operation</strong></td>' +
    '       <td class="valueTd">$operationDetails</td>' +
    '    </tr>' +
    '    <tr>' +
    '        <td><strong>Start Time</strong></td>' +
    '        <td class="valueTd">$startTime</td>' +
    '    </tr>' +
    '    <tr>' +
    '       <td><strong>Duration</strong></td>' +
    '       <td class="valueTd">$duration ms</td>' +
    '    </tr>';

$(document).ready(function () {

    // fix for bootstrap modal error.
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
    };

    var container = $('.primary-sidebar'),
        left = $('.sidebar-background'),
        right = $('.main-content'),
        handle = $('#resizer');

    handle.on('mousedown', function (e) {
        isResizing = true;
        lastDownX = e.clientX;
        container.css("-moz-user-select", "none");
        container.css("-webkit-user-select", "none");
        right.css("-moz-user-select", "none");
        right.css("-webkit-user-select", "none");
    });

    $(document).on('mousemove', function (e) {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing) {
            container.css("-moz-user-select", "text");
            container.css("-webkit-user-select", "text");
            right.css("-moz-user-select", "text");
            right.css("-webkit-user-select", "text");
            return true;
        }

        var offsetRight = container.width() - (e.clientX - container.offset().left);
        if (e.clientX < 180) {
            container.css('width', 180);
            left.css('width', 180);
            right.css('margin-left', 180);
            return true;
        } else if (e.clientX > ($(document).width() / 2 )) {
            var width = $(document).width() / 2;
            container.css('width', width);
            left.css('width', width);
            right.css('margin-left', width);
            return;
        }

        container.css('width', e.clientX);
        left.css('width', e.clientX);
        right.css('margin-left', e.clientX);
        e.stopPropagation();
    }).on('mouseup', function (e) {
        // stop resizing
        isResizing = false;
        return true;
    });

    initSecurityProvidersDialog();

    if ($.urlParam("login_error") != null) {
        $.growl.error({message: "Wrong username or password !"});
    }

    if ($.urlParam("access_denied") != null) {
        $.growl.error({message: "Access denied! User has no roles!"});
    }
    initDialogs();
    getVersionAction();

    //timetravel is not available in the login page, so we can skip its initialization
    if (document.getElementById('datepicker')) {
        $("#datepicker").datepicker({
            onSelect: function (dateText, inst) {
                prepareSlider()
            }
        });
        $("#datepicker").datepicker("setDate", new Date());
        $('#datepickerButton').click(function () {
            var visible = $('#ui-datepicker-div').is(':visible');
            $('#datepicker').datepicker(visible ? 'hide' : 'show');
        });

        prepareSlider();
        curtime = 0;
    }

    var data = {operation:"getLicenseType"}
    opcall(data)

    $.ajax({
        url: "user.do",
        data: {operation:"isReloadSecurityConfigSupported"},
        cache: false,
        dataType: "json"
    }).done(function (resp) {
        for (key in resp) {
            if (key == "success") {
                if (resp[key] == true) {
                    $("#reloadSecurityConfigButtonContainer").show();
                } else {
                    $("#reloadSecurityConfigButtonContainer").hide();
                }
            }
        }
    });

    $('#operationDropdownList').find('li').on('click', function(){
        var selected = $(this).find('a').attr('id');
        if (selected == "operationDropdownClusterState") {
            tabs.newTab('Cluster State', 'clusterstate', 'icon-wrench');
        } else if (selected == "operationDropdownHotRestart") {
            tabs.newTab('Hot Restart','hotrestart','icon-repeat');
        } else if (selected == "operationDropdownWanSync"){
            tabs.newTab('WAN Sync','wanreptop','icon-cloud-upload');
        } else if (selected == "operationDropdownRollingUpgrade") {
            showChangeVersionScreen();
        }
    });
});

function handlesidebar(data) {
    if (data != "Enterprise HD") {
        $('.enterprise-hd-only').hide()
        if (data != "Enterprise") {
            $('.enterprise-only').hide()
        }
    }
}

function resetsidebar() {
    $('.enterprise-hd-only').show()
    $('.enterprise-only').show()
}

function reloadPage() {
    location.reload();
}

function loginInit() {
    opcall({operation: "clusternames"})
}

function getVersionAction() {
    opcall({operation: "getVersion"})
}

function writeCheckAction() {
    opcall({operation: "writecheck"})
}

function getVersion(data) {
    version = data;
    $("#mainVersion").html("Version " + version);
    document.title = "Hazelcast Management Center " + version
    $(".versionText").html(version);
    writeCheckAction();
}
function initTimeTravel(writeMode) {
    if (writeMode == 2) {
        $('#timeTravelSwitch').bootstrapSwitch('setState', true, false);
        $("#continueOperationButton").bind('click', function () {
            continueOperation()
        });
        $("#forwardTimeButton").bind('click', function () {
            forwardTime()
        });
        $("#backTimeButton").bind('click', function () {
            backTime()
        });
    }
    else {
        $("#slider").slider("disable")
        $("#datepicker").datepicker("disable")
    }
}

function writecheck(data) {

    if (data.indexOf("SUCCESS-") == 0) {
        writeMode = parseInt(data.split("-")[1])
        loginInit()
        initTimeTravel(writeMode);
    }
    else {
        $("#dataDirectory").html(data);
        $("#writeErrorDialog").dialog("open")
    }
}

function getInitialContent() {
    return $("#" + activeView + "ContentTemplate").html()
}

function detectVersionMismatch() {
    var data = {
        cluster: activeCluster,
        operation: "detectVersionMismatch",
    }
    opcall(data)
}

function versionmismatch(data) {
    if (data == "OK") {
        $('#versionMismatch').hide();
        return;
    } else {
        $('#versionMismatch').show();
        $("#versionMismatchText").html(data);
    }
}

function switchCluster(clusterName) {
    if (activeCluster == clusterName)
        return;
    activeCluster = clusterName;
    document.title = activeCluster + " | Management Center";
    $('#activeClusterName').html(clusterName);
    tabs.closeAll();
    tabs.newTab('Home', 'home', 'icon-home');
    $('#healthCheckTable .has-spinner').empty();
    refreshpage(0, true);
}

function showChangeUrlScreen() {
    $("#changeUrlDialog").dialog("open")
    $('#changeUrlDialog').keypress(function (e) {
        if (e.keyCode == 13 && e.target.type != "textarea") {
            changeUrlAction();
        }
    });
    var host = location.href
    host = host.substring(0, host.indexOf("/main"))
    $(".yourUrlInput").val(host)
}

function showChangeVersionScreen() {
    getClusterVersion();
    $("#changeVersionDialog").dialog("open");
}

function editCurrentClusterVersion(version) {
    clusterVersionCache = version;
    $("#currentVersionContainer").html(version);
}

function getClusterVersion() {
    var data = {
        cluster: activeCluster,
        operation: "getClusterVersion"
    }
    opcall(data)
}

function showSmtpConfigScreen() {
    fillSmtpIfExist()
    $("#smtpConfigDialog").dialog("open")
    $('#smtpConfigDialog').keypress(function (e) {
        if (e.keyCode == 13 && e.target.type != "textarea") {
            smtpConfigAction()
        }
    });
}

function fillSmtpIfExist() {
    var data = {operation: "loadEmailConfig", emailconfigname: "defaultConfig"}
    opcall(data)
}

function loadEmailConfig(eMailAttr) {
    if(eMailAttr.length == 0)
    {
        return
    } else {
        $("#userNameInput").val(eMailAttr[1])
        $("#userPasswordInput").val(eMailAttr[2])
        $("#hostAdressInput").val(eMailAttr[3])
        $("#hostPortInput").val(eMailAttr[4])
        $("#tlsEnabledInput").prop('checked', eMailAttr[5])
    }

}

function showSlowOperationDetail(data) {
    var detailHtml = slowOperationDetailHeaderTemplate.replace(/\$stackTrace/g, data[4]);
    var details = data[3];
    if (details && details.length > 0) {
        for (var i = 0; i < details.length; i++) {
            detailHtml += slowOperationDetailTemplate
                .replace(/\$operationDetails/g, details[i].operationDetails)
                .replace(/\$startTime/g, moment(details[i].startedAt).format("dddd, MMMM Do YYYY, h:mm:ss a"))
                .replace(/\$duration/g, details[i].durationMs);
        }
        $("#slowOperationDetail").html(detailHtml);
        var title = 'Details of ' + data[0] + ' (' + data[2] + ' invocations)';
        $("#slowOperationDialog").dialog('option', 'title', title).dialog("open");
    }
}

function initSecurityProvidersDialog() {
    $("#securityProvidersDialog").dialog({
        autoOpen: false,
        height: 700,
        width: 400,
        modal: true,
        closeOnEscape: false,
        buttons: [
            {
                id: "saveSecurityProviderConfigurationButton", text: "Save", class: "has-spinner",
                click: function () {
                    saveSecurityProviderConfiguration();
                }
            }

        ]
    });

    $('#securityProvidersDialog').find('#securityProviderSelect').on('change', function() {
        showSecurityConfigParams(this.value);
    });
}

function initDialogs() {
    $("#slowOperationDialog").dialog({
        autoOpen: false,
        height: 800,
        width: 1000,
        modal: true
    });
    $("#changeUrlDialog").dialog({
        autoOpen: false,
        height: 320,
        width: 400,
        modal: true,
        buttons: [
            {
                id: "setUrlButton", text: "Set URL", click: function () {
                changeUrlAction()
            }
            }
        ]
    });
    $("#changeVersionDialog").dialog({
        autoOpen: false,
        height: 300,
        width: 400,
        modal: true,
        buttons: [
            {
                id: "changeClusterVersionButton", text: "Change Version", click: function () {
                changeClusterVersion(clusterVersionCache)
            }
            }
        ]
    });
    $("#smtpConfigDialog").dialog({
        autoOpen: false,
        height: 370,
        width: 400,
        modal: true,
        buttons: [
            {
                id: "setSmtpButton", text: "Save Config", class: "has-spinner", click: function () {
                smtpConfigAction()
            }
            }
        ]
    });

    $("#hotRestartDialog").dialog({
        autoOpen: false,
        height: 150,
        width: 300,
        modal: true,
        closeOnEscape: false
    });

    $("#changeClusterStatusDialog").dialog({
        autoOpen: false,
        height: 150,
        width: 300,
        modal: true,
        closeOnEscape: false
    });

    $("#clusterConnectDialog").dialog({
        autoOpen: false,
        height: 240,
        width: 300,
        modal: true,
        buttons: [
            {
                id: "clusterConnectButton", text: "Connect", click: function () {
                clusterConnect()
            }
            }
        ]
    });
    $("#licenseKeyDialog").dialog({
        autoOpen: false,
        height: 240,
        width: 300,
        modal: true,
        buttons: [
            {
                id: "licenseEnterButton", text: "Enter", click: function () {
                saveLicenseAction()
            }
            }
        ]
    });
    $("#updateLicenseKeyDialog").dialog({
        autoOpen: false,
        height: 270,
        width: 300,
        modal: true,
        buttons: [
            {
                id: "licenseUpdateButton", text: "Enter", class:"updatelicense", click: function () {
                updateLicenseAction()
            }
            }
        ]
    });
    $("#noDataDialog").dialog({
        autoOpen: false,
        height: 350,
        width: 360,
        modal: true
    });
    $("#saveScriptDialog").dialog({
        autoOpen: false,
        height: 200,
        width: 300,
        modal: true,
        buttons: [
            {
                id: "saveScriptOverwrite", text: "Overwrite", click: function () {
                saveScriptAction();
                $(this).dialog("close")

            }
            },
            {
                id: "saveScriptCancel", text: "Cancel", click: function () {
                $(this).dialog("close")
            }
            }
        ]
    });
    $("#saveScriptNoNameDialog").dialog({
        autoOpen: false,
        height: 180,
        width: 250,
        modal: true,
        buttons: [
            {
                id: "saveScriptNoNameCancel", text: "OK", click: function () {
                $(this).dialog("close")
            }
            }
        ]
    });
    $("#deleteScriptDialog").dialog({
        autoOpen: false,
        height: 160,
        width: 320,
        modal: true,
        buttons: [
            {
                id: "deleteScriptDialog", text: "Delete", click: function () {
                var name = $('#scriptName').val();
                var data = {userName: username, name: name, operation: "deleteScript"}
                opcall(data)
                $(this).dialog("close")
            }
            },
            {
                id: "deleteScriptDialog", text: "Cancel", click: function () {
                $(this).dialog("close")
            }
            }
        ]
    });
    $("#deleteUserConfirm").dialog({
        autoOpen: false,
        height: 180,
        modal: true,
        buttons: {
            "Delete User": function () {
                deleteUserAction()
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
    $("#changePasswordModal").dialog({
        autoOpen: false,
        height: 250,
        width: 380,
        modal: true,
        buttons: {
            "Change Password": function () {
                changePasswordAction()
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function() {
            $("#changePassInput").val("")
            $("#confirmPassInput").val("")
            $("#changePasswordModalForm").parsley('destroy')
        }
    });
    $("#mapBrowseDialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable: false,
        height: 400,
        width: 550

    });
    $("#mapConfigDialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable: false,
        height: 400,
        width: 550
    });
    $("#cacheBrowseDialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable: false,
        height: 300,
        width: 550

    });
    $("#wanConfigDialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable: false,
        height: 550,
        width: 800
    });
    $("#wanSyncDialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        resizable: false,
        height: 350,
        width: 500
    });
    $("#threadDumpDialog").dialog({
        autoOpen: false,
        height: 360,
        width: 550
    });
    $("#nodeShutdownDialog").dialog({
        autoOpen: false,
        height: 300,
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).dialog("close");
            },
            "Shutdown Member": function () {
                $("#shutdownNodeButton").attr('disabled', true)
                var groupName = $("#groupNameInputForShutdown").val();
                var pass = $("#clusterPasswordInputForShutdown").val();
                var data = {cluster: activeCluster, operation: "memberShutdown", member: activeObject, groupName: groupName, password: pass}
                memberTobeKilled = activeObject;
                opcall(data)
                $(this).dialog("close");
            }
        },
        close: function (ev, ui) {
            if (!memberTobeKilled || 0 === memberTobeKilled.length) {
                $("#shutdownNodeButton").removeClass("active")
            }
        }
    });

     $("#clusterShutdownDialog").dialog({
           autoOpen: false,
           height: 230,
           width: 400,
           modal: true,
           buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                },
                "Shutdown Cluster": function () {
                    $("#shutdownNodeButton").attr('disabled', true)
                    // clusterstate.js
                    shutdownCluster();
                    $(this).dialog("close");
                }
           }
    });

    $("#forceStartDialog").dialog({
            autoOpen: false,
            height: 275,
            width: 500,
            modal: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                },
                "Force Start": function () {
                    $("#forcestartClusterButton").attr('disabled', true)
                    //hotrestart.js
                    forceStartCluster();
                    $(this).dialog("close");
                }
            }
    });

    $("#partialStartDialog").dialog({
            autoOpen: false,
            height: 230,
            width: 400,
            modal: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                },
                "Partial Start": function () {
                    var password = $("#passInputForPartialStart").val();
                    var data = {
                        operation: 'triggerPartialStart',
                        cluster: activeCluster,
                        password: password
                    }
                    opcall(data)
                    $(this).dialog("close");
                }
            }
    });

    $("#hrBackupDialog").dialog({
            autoOpen: false,
            height: 230,
            width: 400,
            modal: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                },
                "Start": function () {
                    var password = $("#passInputForHRBackup").val();
                    var data = {
                        operation: 'triggerHotRestartBackup',
                        cluster: activeCluster,
                        password: password
                    }
                    opcall(data)
                    $(this).dialog("close");
                }
            }
    });

    $("#hrBackupInterruptDialog").dialog({
            autoOpen: false,
            height: 230,
            width: 400,
            modal: true,
            buttons: {
                Cancel: function () {
                    $(this).dialog("close");
                },
                "Interrupt": function () {
                    var password = $("#passInputForHRBackupInterrupt").val();
                    var data = {
                        operation: 'interruptHotRestartBackup',
                        cluster: activeCluster,
                        password: password
                    }
                    opcall(data)
                    $(this).dialog("close");
                }
            }
    });

    $("#saveFilterDialog").dialog({
        autoOpen: false,
        height: 180,
        modal: true
    });
    $("#deleteFilterDialog").dialog({
        autoOpen: false,
        height: 180,
        modal: true
    });
    $("#saveFilterNoNameDialog").dialog({
        autoOpen: false,
        height: 180,
        modal: true
    });
    $("#enableTimeTravelDialog").dialog({
        autoOpen: false,
        height: 180,
        width: 500,
        modal: true,
        buttons: {
            "Enable": function () {
                enableTimeTravelAction()
                $(this).dialog("close")

            },
            Cancel: function () {
                $('#timeTravelSwitch').bootstrapSwitch('setState', false, true);
                $(this).dialog("close")
            }
        }
    });
    $("#disableTimeTravelDialog").dialog({
        autoOpen: false,
        height: 180,
        width: 500,
        modal: true,
        buttons: {
            "Disable": function () {
                disableTimeTravelAction()
                $(this).dialog("close")

            },
            Cancel: function () {
                $('#timeTravelSwitch').bootstrapSwitch('setState', true, true);
                $(this).dialog("close")
            }
        }
    });
    $("#writeErrorDialog").dialog({
        autoOpen: false,
        height: 220,
        width: 500,
        modal: true,
        buttons: {
            "Continue Read-Only": function () {
                writeMode = 0;
                loginInit();
                $(this).dialog("close");

            },
            "Retry": function () {
                reloadPage()
            }
        }
    });
}
