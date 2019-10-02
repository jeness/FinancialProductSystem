var clusterShutDownByUser = false
var prevState = ""

// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function clusterstateInit() {
    $('#activeStateDrop').off("click").click(function(){ changeClusterState("ACTIVE"); return false; });
    $('#frozenStateDrop').off("click").click(function(){ changeClusterState("FROZEN"); return false; });
    $('#passiveStateDrop').off("click").click(function(){ changeClusterState("PASSIVE"); return false; });

    refreshpage(0,true);
}

function arrangeClusterState(data) {
    $("#clusterName").remove()
    $("#stateButton").remove()

    $("#clusterState_clusterNameContainer").empty()
    $("#clusterState_clusterNameContainer").append("<span id=\"clusterName\">" + activeCluster + "<\/span>")

    var stateButton = ""
    if (data == "ACTIVE") {
        if (prevState == "PASSIVE" && clusterShutDownByUser) {
            $('#stateChangeButton').removeAttr("disabled");
            $('#openClusterShutdownButton').removeAttr("disabled");
            $('#forcestartClusterButton').removeAttr("disabled");
        }
        prevState = data
        stateButton = "<button id=\"stateButton\" type=\"button\" class=\"btn btn-success\">Active<\/button>";
    } else if (data == "FROZEN") {
        prevState = data
        stateButton = "<button id=\"stateButton\" type=\"button\" class=\"btn btn-info\">Frozen<\/button>";
    } else if (data == "PASSIVE" || data == "No Cluster Data") {
        prevState = "PASSIVE"
        stateButton = "<button id=\"stateButton\" type=\"button\" class=\"btn btn-danger\">Passive<\/button>";
    } else if (data == "IN_TRANSITION") {
        prevState = data
        stateButton = "<button id=\"stateButton\" type=\"button\" class=\"btn btn-warning\">In Transition<\/button>";
    }

    $("#clusterState").append(stateButton);
    $("#button").prop('disabled', true)
}

function changeClusterState(stateName) {
    $("#changeClusterStatusDialog").dialog('option', 'title', 'Changing Cluster State')
    data = {operation:"changeClusterState", cluster:activeCluster, newState:stateName}
    $("#changeClusterStatusDialog").dialog("open")
    $("#changeClusterStatusDialog").parent().find(".ui-dialog-titlebar-close").hide()
    $(".dropdown").removeClass("open")
    opcall(data)
}

function shutdownCluster() {
    $("#changeClusterStatusDialog").dialog('option', 'title', 'Shutting down the Cluster: ' + activeCluster)
    clusterShutDownByUser = true
    data = {operation:"shutdownCluster", cluster:activeCluster}
    $('#stateChangeButton').attr("disabled", true);
    $('#openClusterShutdownButton').attr("disabled", true);
    $('#forcestartClusterButton').attr("disabled", true);
    $("#changeClusterStatusBar").addClass("bar-danger")
    $("#changeClusterStatusDialog").dialog("open")
    $("#changeClusterStatusDialog").parent().find(".ui-dialog-titlebar-close").hide()
    opcall(data)
}

function openClusterShutdownDialog() {
    $("#clusterShutdownDialog").dialog("open");
}

function clustershutdown(data) {
    $("#changeClusterStatusBar").removeClass("bar-danger")
    $("#changeClusterStatusDialog").dialog("close")
    if (data == "SUCCESS") {
        $.growl.notice({message: "Cluster Shutdown Successful."});
    } else {
        $.growl.error({message: "Cluster Shutdown failed. Reason: " + data});
    }
}

function clusterstatechanged(data) {
    $("#changeClusterStatusDialog").dialog("close")
    if (data == "SUCCESS") {
        $.growl.notice({message: "Cluster State Updated Successfully."});
    } else {
        $.growl.error({message: "Cluster State Update failed. Reason: " + data});
    }
}
