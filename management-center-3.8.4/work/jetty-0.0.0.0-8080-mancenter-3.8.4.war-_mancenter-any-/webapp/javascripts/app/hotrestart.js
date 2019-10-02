// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function hotrestartInit() {
    refreshpage(0,true);
}

function openForceStartDialog() {
    $("#forceStartDialog").dialog("open");
}

function forceStartCluster() {
    $("#hotRestartDialog").dialog('option', 'title', 'Force Starting Cluster')
    data = {operation:"forceStartCluster", cluster:activeCluster}
    $("#hotRestartDialog").dialog("open")
    $("#hotRestartDialog").parent().find(".ui-dialog-titlebar-close").hide()
    opcall(data)
}

function forcestartcluster(data) {
    $("#hotRestartDialog").dialog("close")
    if (data == "SUCCESS") {
        $.growl.notice({message: "Force start is triggered successfully"});
    } else if (data == "FAILED") {
        $.growl.error({duration: 16000, message: "Force start triggering failed! This may be due to a few reasons:<br/> \
        - License key is not configured for the cluster.<br/> \
        - Hot restart is not configured for the cluster.<br/> \
        - An error occurred while triggering Force Start.<br/> \
        Check cluster member logs for more information."});
    } else {
        $.growl.error({message: "Force start triggering failed! Reason: " + data});
    }
}

function openPartialStartDialog() {
    $("#partialStartDialog").dialog("open");
}

function partialstartcluster(data) {
    $("#partialStartDialog").dialog("close");
    if (data == 'success')
        $.growl.notice({message: "Partial Start triggered"});
    else {
        $.growl.error({message: "Partial Start can not be triggered"});
        $.growl.error({message: data});
    }
}

function getClusterHotRestartStatus() {
     var data = {
            operation: 'getClusterHotRestartStatus',
            cluster: activeCluster
     }
     opcall(data)
}

function fillClusterHotRestartStatus(data) {
    $("#clusterNameContainer").empty()
    $("#clusterNameContainer").append("<span id=\"clusterName\">" + activeCluster + "<\/span>")

    $("#clusterHRStatus").remove();
    $("#dataRecoveryPolicy").remove();
    $("#remainingDataLoadTime").remove();
    $("#remainingValidationTime").remove();

    $("#clusterHRStatusContainer").empty();
    $("#dataRecoveryPolicyContainer").empty();
    $("#remainingDataLoadTimeContainer").empty();
    $("#remainingValidationTimeContainer").empty();

    var clusterHRStatus = data['clusterHRStatus'];
    $("#clusterHRStatusContainer").append("<span id=\"clusterHRStatus\">" + clusterHRStatus + "<\/span>");

    var dataRecoveryPolicy = data['dataRecoveryPolicy'];
    $("#dataRecoveryPolicyContainer").append("<span id=\"dataRecoveryPolicy\">" + dataRecoveryPolicy + "<\/span>");

    var remainingDataLoadTime = data['remainingDataLoadTime'];
    if(remainingDataLoadTime == "-1"){
        remainingDataLoadTime = "undefined"
        $("#remainingDataLoadTimeContainer").append("<span id=\"remainingDataLoadTime\">" + remainingDataLoadTime + "<\/span>");
    } else {
        $("#remainingDataLoadTimeContainer").append("<span id=\"remainingDataLoadTime\">" + remainingDataLoadTime + "  ms" + "<\/span>");
    }

    var remainingValidationTime = data['remainingValidationTime'];
    if(remainingValidationTime == "-1"){
        remainingValidationTime = "undefined"
        $("#remainingValidationTimeContainer").append("<span id=\"remainingValidationTime\">" + remainingValidationTime + "<\/span>");
    } else {
        $("#remainingValidationTimeContainer").append("<span id=\"remainingValidationTime\">" + remainingValidationTime + "  ms" + "<\/span>");
    }
}

function getMembersHotRestartStatus() {
     var data = {
            operation: 'getMemberHotRestartStatus',
            cluster: activeCluster
     }
     opcall(data)
}

function fillMemberHotRestartStatus(data) {
    $('#memberHRStatusTable').find('tbody').empty();
    for(member in data){
        var memberStr = member.substring(member.lastIndexOf("["),member.lastIndexOf(" "));
        var status = data[member];
        $('#memberHRStatusTable').find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .text(memberStr)
                )
                .append($('<td>')
                    .text(status)
                )
            );
    }
}

function openHRBackupDialog() {
    $("#hrBackupDialog").dialog("open");

}

function openHRBackupInterruptDialog() {
    $("#hrBackupInterruptDialog").dialog("open");

}

function triggerHotRestartBackup(result) {
    if (result == 'success')
        $.growl.notice({message: "Backup Process started"});
    else {
        $.growl.error({message: "Backup Process can not be started"});
        $.growl.error({message: result});
    }
}

function interruptHotRestartBackup(result) {
    if (result == 'success')
        $.growl.notice({message: "Backup Process is interrupted"});
    else {
        $.growl.error({message: "Backup Process can not be interrupted"});
        $.growl.error({message: result});
    }
}

function getClusterHRBackupStatus() {
     var data = {
            operation: 'getClusterHRBackupStatus',
            cluster: activeCluster
     }
     opcall(data)
     getHotBackupEnabled();
}

function getHotBackupEnabled() {
    var data = {
        operation: 'getHotBackupEnabled',
        cluster: activeCluster
    }
    opcall(data)
}

function isHotBackupEnabled(data) {
    if(data) {
        $('#memberHRBackupStatusTableBox').show();
    } else {
        $('#openHRBackupDialogButton').replaceWith("<h5> Please configure Hot Backup programmatically or add <em>backup-dir</em> to hazelcast.xml to use this feature </h5>")
        $('#memberHRBackupStatusTableBox').hide();
    }
}

function fillMemberHRBackupStatus(data) {
    $('#memberHRBackupStatusTable').find('tbody').empty();
    var statuses = Array(); //to enable-disable HR buttons
    for(member in data){
        var status = data[member];
        var backupStatus = status[0]
        statuses.push(backupStatus);

        var progress = status[1]
        var $progressBar = $('<div/>').attr('class', 'progress progress-striped');
        var $div = $('<div class="bar" style="width: '+progress+'%;"></div>').attr('id', 'hrBackup-progress-bar');
        $progressBar.append($div);

        $('#memberHRBackupStatusTable').find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .text(member)
                )
                .append($('<td>')
                    .text(backupStatus)
                )
                .append($('<td>')
                    .append($progressBar)
                )
            );
    }

    //decide Interrupt button is enabled or not
    if("IN_PROGRESS" in statuses) {
        enableInterruptHRBackup();
    } else {
        enableTriggerHRBackup();
    }
}

function enableInterruptHRBackup() {
    $('#openHRBackupDialogButton').replaceWith('<button id="openHRBackupInterruptDialogButton" onclick="openHRBackupInterruptDialog()" type="button" class="btn btn-danger"><i class="icon-remove"></i> Interrupt </button>');
}

function enableTriggerHRBackup() {
    $('#openHRBackupInterruptDialogButton').replaceWith('<button id="openHRBackupDialogButton" onclick="openHRBackupDialog()" type="button" class="btn btn-primary"><i class="icon-repeat"></i> Hot Restart Backup</button>');
}