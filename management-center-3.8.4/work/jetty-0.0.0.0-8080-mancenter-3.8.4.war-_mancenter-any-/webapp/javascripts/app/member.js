var memberTobeKilled = "";
// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function memberInit()
{
    $('#memberInfoTabs li').removeClass('active')
    $('#memberInfoTabs a[href="#runtime"]').tab('show')
    getMemberVersion()
    refreshpage(0,true);
}


function enableMemberButtons() {
    disableWriteModeButtons()
}

function sendGC() {
    $("#runGcButton").addClass("active")
    var data = {cluster: activeCluster, operation: "runGC", member: activeObject }
    opcall(data)
}

function runGC(data) {
    $.growl.notice({title: "Garbage Collection!",message:data})
    $("#runGcButton").removeClass("active")
}

function getThreadDump() {
    $("#threadDumpButton").addClass("active")
    var data = {cluster: activeCluster, operation: "threaddump", member: activeObject }
    opcall(data)
}
function threaddump(data) {
    $('#threadDumpDialog').dialog("open")
    $("#threadDumpModalBody").empty();
    $("#threadDumpModalBody").append(data)
    $("#threadDumpButton").removeClass("active")

}

function memberShutdownAction() {
    $("#shutdownNodeButton").addClass("active")
    $("#nodeShutdownDialog").dialog("open")
}

function memberShutdown(olist) {
    if (olist == "success") {
        $(".writeModeButton").button("option", "disabled", false);
        $.growl.notice({title: "Member Shutdown!",message:"Member shutdown request successfully sent"})
        tabs.closeTab(tabs.getTabByLabel(memberTobeKilled).getId());
        $("#shutdownNodeButton").removeClass("active");
        $("#shutdownNodeButton").removeAttr("disabled");
        memberTobeKilled = "";
    } else {
        $.growl.error({title: "Member Shutdown!",message:"Member shutdown failed. Reason: " + olist})
        $("#shutdownNodeButton").removeClass("active");
        $("#shutdownNodeButton").removeAttr("disabled");
    }
}

var initMemberListForScripting = true
function fillMemberListForScripting(data) {
    if( data == null) return;
    var isSame = true;

    if(data.length != memberListCache.length){
        isSame = false;
    } else {
        for (var i = 0; i < data.length; i++) {
            if(data[i]["id"]!=memberListCache[i]["id"])
            {
                isSame = false;
                break;
            }
        }
    }

    if(!isSame || initMemberListForScripting )
    {
        $('#memberCheckList').empty()
        for (var i = 0; i < data.length; i++) {
            $('#memberCheckList').append("<label for='memberchecklist" + i + "' class='checkbox'><div class='memberCheckDiv' ><input id='memberchecklist" + i + "' checked='checked' type='checkbox' name='memberchecklist' value='" + data[i].label + "'  />" + data[i].label + "</label></div>")
        }
        initMemberListForScripting = false;
    }

}

function fillMemberCheckListForLogs() {
    $('#memberCheckListForLogs').empty()
    for (var i = 0; i < memberListCache.length; i++) {
        $('#memberCheckListForLogs').append("<div class='memberCheckDiv' ><input id='memberchecklistForLogs" + i + "' checked='checked' type='checkbox' name='memberchecklistForLogs' value='" + memberListCache[i].label + "'  /><label for='memberchecklistForLogs" + i + "' class='itemLink'>" + memberListCache[i].label + "</label></div>")
    }
}


function memberpartitions(numberOfPartitions) {
    $("#memberPartitions").html(numberOfPartitions)
}

//when rolling upgrade is in progress.
function getMemberVersion() {
    var data = {
        cluster: activeCluster,
        operation: "getMemberVersion",
        member: activeObject
    }
    opcall(data)
}

function memberversion(version) {
    if(data == "No Cluster Data") {
        return;
    }
    $("#memberCurrVersion").html(version)
}


function memberProps(dataList) {
    $("#memberProps").empty()
    if (dataList != null)
        for (lbl in dataList) {
            $("#memberProps").append("<tr><td><strong>" + lbl + ":</strong></td><td class='valueTd valueTdSmall'>" + dataList[lbl] + "</td></tr>")
        }
}

function memberConfig(dataList) {
    $("#memberConfig").empty()
    if (dataList != null) {
        dataList = dataList.replace(/</gi, "&lt;").replace(/>/gi, "&gt;")
        $("#memberConfig").append("<pre id='memberConfigCode'><code class='xml'  style='font-size: 9pt;'>" + dataList + "</code></pre>")

        $('#memberConfigCode').each(function (i, e) {
            hljs.highlightBlock(e, '  ')
        });
    }
}


function memberruntime(dataList) {
    if (dataList != null)
        for (lbl in dataList) {
            var idm = lbl.split(".")[1]
            $("#" + idm).html(dataList[lbl])
        }
}


function memberlist(olist) {
    $('#members').empty()
    $("#memberSidebar").html(olist.length)
    if (olist == null || olist.length == 0) {
        $('#members').append("<div style='height: 1px'></div>");
        return;
    }
    $('#members').append("<div style='height: 1px'></div>");
    var str = ""
    for (var i = 0; i < olist.length; i++) {
        var latencyPic = ""
        var info = "Latest Data: " + olist[i].latency + " seconds ago"
        if (olist[i].latency == -1) {
            latencyPic = "icon-circle"
        }
        else if (olist[i].latency < 60) {
            latencyPic = "icon-circle-arrow-up"
        }
        else if (olist[i].latency < 300)
            latencyPic = "icon-circle-arrow-right"
        else
            latencyPic = "icon-circle-arrow-down text-error"

        str += "<li class=\"\"><a href='#' onclick='tabs.newTab(\"" + olist[i].label + "\", \"member\", \""+ listIcons['member'] +"\" )'><i class=" + latencyPic + "></i> " + olist[i].label + "</a></li>"

    }
    $('#members').append(str)
    if( tabs.getCurrentTab() != null)
    {
      if(tabs._currentTab.getLabel() == "Scripting")
              fillMemberListForScripting(olist);
    }
    memberListCache = olist;

}

function memberRestart(olist) {
    if (olist == "successful") {
        $(".writeModeButton").button("option", "disabled", false);
        $("#restartMemberDialog").dialog("open");
    } else {

    }
}
function memberCpuChart(data) {
    drawChart("memberCPUChart", "member", data)
}
function memberMemoryChart(data) {
    drawChart("memberMemoryChart", "member", data, true)
}
function memberNativeMemoryChart(data) {
    drawChart("memberNativeMemoryChart", "member", data, true)
}

function memberSlowOperationsList(data) {
    if (!data || data.length === 0) {
        $("#slowOperationList").hide();
        $("#slowOperationPlaceholder").show();
        return;
    }
    var transformedData = new Array();
    for (var i = 0; i < data.length; i++) {
        var arrData = new Array();
        arrData.push(data[i].operation  || ""  );
        if (data[i].stackTrace) {
            var shortStackTrace = data[i].stackTrace.substring(0, data[i].stackTrace.indexOf('\n', 100)) + ", (...)";
            arrData.push(shortStackTrace.replace(/\n\t/g, ', at '));
        } else {
            arrData.push("No stacktrace available...");
        }
        arrData.push(data[i].totalInvocations || "");
        arrData.push(data[i].invocations || "");
        // we are also keeping long version of stack trace
        arrData.push(data[i].stackTrace.replace(/\n\t/g, '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	at ') || "");

        transformedData.push(arrData);
    }
    fillSlowOperationsDataTable('#slowOperationsTable', transformedData)
    $("#slowOperationPlaceholder").hide();
    $("#slowOperationList").show();
}
