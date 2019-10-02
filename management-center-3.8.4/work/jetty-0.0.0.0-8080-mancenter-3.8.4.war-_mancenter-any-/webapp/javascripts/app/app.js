var memberListCache;
var tabs = new Tabs();
var listIcons = {
    map : "icon-list-ol",
    queue : "icon-exchange",
    topic : "icon-comments",
    reliabletopic : "icon-comments",
    multimap : "icon-certificate",
    executor : "icon-tasks",
    member : "icon-user",
    cache : "icon-list-ul",
    wanrep : "icon-eject"
}

function refreshpage(repeatSeconds,oneTime) {
    oneTime = oneTime || false;
    default_op = "memberlist_instancelist_alertPopup_detectVersionMismatch_getLicenseInfo"
    data = {cluster: activeCluster, operation: default_op}
    if (activeView == 'map') {
        data = prepareMapDataRequest();
    }
    else if (activeView == 'queue') {
        data = prepareQueueDataRequest();
    }
    else if (activeView == 'multimap') {
        data = prepareMultimapDataRequest();
    }
    else if (activeView == 'replicatedmap') {
        data = prepareReplicatedMapDataRequest();
    }
    else if (activeView == 'topic') {
        data = prepareTopicDataRequest();
    }
    else if (activeView == 'reliabletopic') {
        data = prepareReliableTopicDataRequest();
    }
    else if (activeView == 'executor') {
        data = prepareExecutorDataRequest();
    }
    else if (activeView == 'member') {
        data = prepareMemberDataRequest();
    }
    else if (activeView == 'cluster') {
        data = prepareClusterDataRequest();
    }
    else if (activeView == 'home') {
        data = prepareHomeDataRequest();
    }
    else if (activeView == 'cache') {
        data = prepareCacheDataRequest();
    }
    else if (activeView == 'wanrep') {
        wanrepInit();
    }
    else if (activeView == 'wanreptop'){
        wanreptopInit();
    }
    else if (activeView == 'hotrestart') {
        getClusterHotRestartStatus();
        getMembersHotRestartStatus();
        getClusterHRBackupStatus();
    }
    else if (activeView == 'clusterstate') {
        data = prepareGetClusterStateRequest();
    }

    data.curtime = curtime;
    var request = $.ajax({
        url: "main.do",
        type: "post",
        data: data,
        cache: false,
        dataType: "json"
    });

    request.done(function (resp) {
        if (resp.error == "node_limit_error") {
            $("#licenseErrorDialog").dialog("open");
            return;
        }

        for (var oper in resp) {
            try {
                eval(oper + "(resp[oper]);")
            }
            catch (err) {
                console.log(err.message)
            }
        }

        if(oneTime != true) {
            if (repeatSeconds > 0 && curtime == 0) {
                setTimeout("refreshpage(" + repeatSeconds + ")", repeatSeconds * 1000);
            }
        }
        $('#connectionError').hide();
        if (typeof resp.instanceConnectionError == 'undefined') {
            $('#instanceConnectionError').hide();
        }

    }).fail(function(xhr, err) {
        $('#connectionErrorText').html(formatErrorMessage(xhr, err));
        $('#connectionError').show();
    });
}
function formatErrorMessage(jqXHR, exception) {

    if (jqXHR.status === 0) {
        return ('Not connected.\nPlease verify your network connection.');
    } else if (jqXHR.status == 404) {
        return ('The requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        return ('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        return ('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        return ('Time out error.');
    } else if (exception === 'abort') {
        return ('Ajax request aborted.');
    } else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}
function disableWriteModeButtons() {
    if (activeRole != "2") {
        $(".writeModeButton").button("disable")
    }
}

function opcall(data) {
    var request = $.ajax({
        url: "main.do",
        type: "post",
        data: data,
        cache: false,
        dataType: "json"
    });

    request.done(function (resp) {
        for (var oper in resp) {
            try {
                eval(oper + "(resp[oper])")
            }
            catch (err) {
                console.log(err + "|" + oper + "|" + resp)
            }
        }
    });
}

function fillDataTable(container, data, infoEnabled) {
    var scroll = $(window).scrollTop();
    if(data == null ) return;
    infoEnabled = infoEnabled || false
    var totals = undefined
    var dataLength = data.length;
    try {
        if(dataLength > 0 && data[dataLength-1][1] == 'TOTAL') {
            totals = data[data.length-1];
            data.splice(data.length-1)
        }
    } catch (err) {
        console.log(err)
    }
    var datatable = $(container).dataTable( {
        "bDestroy": true  ,
        "bFilter": false ,
        "bLengthChange": false,
        "bPaginate": true,
        "sPaginationType" : "full_numbers",
        sDom: "t<\"table-footer\"ip>",
        "bInfo": infoEnabled,
        "bAutoWidth": true,
        "sScrollX": "100%",
        "sScrollXInner": "100%",
        "bStateSave": true,
        "fnStateSave": function (oSettings, oData) {
            localStorage.setItem( 'DataTables_'+ container, JSON.stringify(oData) );
        },
        "fnStateLoad": function (oSettings) {
            return JSON.parse( localStorage.getItem('DataTables_'+ container) );
        },
        "aaData": data
        }
    );

     if(totals) {
        var $footer_container = $(container + '_wrapper').find('.dataTables_scrollFootInner tfoot tr th')
        $footer_container.each(function( index ) {
        $( this ).html('<div>' + totals[index] + '</div>');
     });

    }

    $(window).scrollTop(scroll);
    return datatable;
}

function fillOperationsDataTable(container, data, infoEnabled){
    var scroll = $(window).scrollTop();
    if(data == null ) return;
    for (var i = 0; i < data.length; i++)
       data[i] = [i+1].concat( data[i])
    infoEnabled = infoEnabled || false
    $(container).dataTable( {
        "bDestroy": true  ,
        "bFilter": false ,
        "bLengthChange": false,
        "bPaginate": true,
        "sPaginationType" : "full_numbers",
        sDom: "t<\"table-footer\"ip>",
        "bInfo": infoEnabled,
        "bAutoWidth": true,
        "sScrollX": "100%",
        "sScrollXInner": "100%",
        "bStateSave": true,
        "fnStateSave": function (oSettings, oData) {
            localStorage.setItem( 'DataTables_'+ container, JSON.stringify(oData) );
        },
        "fnStateLoad": function (oSettings) {
            return JSON.parse( localStorage.getItem('DataTables_'+ container) );
        },
        "aaData": data
      }
    );
    $(window).scrollTop(scroll);
}

function fillSlowOperationsDataTable(container, data){
    var scroll = $(window).scrollTop();
    if (data == null ) {
        return;
    }
    var slowOperationTable = $(container).dataTable( {
            "fnDrawCallback": function() {
                $("#slowOperationsTable tr").css('cursor', 'pointer');
            },
            "bDestroy": true,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": true,
            "sPaginationType": "full_numbers",
            "sDom": "t<\"table-footer\"ip>",
            "bInfo": true,
            "bAutoWidth": true,
            "sScrollX": "100%",
            "sScrollXInner": "100%",
            "bStateSave": true,
            "fnStateSave": function(oSettings, oData) {
                localStorage.setItem('DataTables_' + container, JSON.stringify(oData));
            },
            "fnStateLoad": function(oSettings) {
                return JSON.parse(localStorage.getItem('DataTables_' + container));
            },
            "aaData": data
        }
    );
    $(window).scrollTop(scroll);
    $(document).off("click", "#slowOperationsTable tbody tr");
    $(document).on("click", "#slowOperationsTable tbody tr", function(event) {
        event.preventDefault();
        var aData = slowOperationTable.fnGetData(this);
        showSlowOperationDetail(aData);
    });
}

function setChartOption(chart,type,chartOption){
     chartOptions[type][chart] = chartOption;
     refreshpage(0, true);
}
function instanceList(container,data,instanceType)
{
    $('#' + container).empty()
    if (data == null || data.length == 0) {
        $('#' + container).append("<div style='height: 1px'></div>");
        return;
    }
    var str = ""
    for (var i = 0; i < data.length; i++) {
        str += "<li class=\"\"><a href='#' title=\"" + data[i].label + "\" onclick='tabs.newTab(\"" + data[i].label + "\", \""+ instanceType +"\", \""+ listIcons[instanceType]  +"\" )'><i class='icon-angle-right'></i> " + data[i].label + "</a></li>"
    }
    $('#' + container).append(str)

}
function nodeLimitError(data)
{
    $('#nodeLimitExceeded').show();
}
function instanceConnectionError(data)
{
    $('#instanceConnectionError').show();
}
function prepareGetClusterStateRequest() {
    return {
        cluster:activeCluster,
        operation:"getClusterState"
    }
}
function prepareMapDataRequest() {
    $("#mapChart1Title").text(chartTypes[chartOptions["map"]["mapChart1"]])
    $("#mapChart2Title").text(chartTypes[chartOptions["map"]["mapChart2"]])
    $("#mapChart3Title").text(chartTypes[chartOptions["map"]["mapChart3"]])
    $("#mapChart4Title").text(chartTypes[chartOptions["map"]["mapChart4"]])
    return {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesMap",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["map"]["mapChart1"],
        chart2type: chartOptions["map"]["mapChart2"],
        chart3type: chartOptions["map"]["mapChart3"],
        chart4type: chartOptions["map"]["mapChart4"],
        throughputInterval: throughputInterval['map']
    }
}
function prepareReplicatedMapDataRequest() {
    $("#replicatedmapChart1Title").text(chartTypes[chartOptions["replicatedmap"]["replicatedmapChart1"]])
    $("#replicatedmapChart2Title").text(chartTypes[chartOptions["replicatedmap"]["replicatedmapChart2"]])
    $("#replicatedmapChart3Title").text(chartTypes[chartOptions["replicatedmap"]["replicatedmapChart3"]])
    $("#replicatedmapChart4Title").text(chartTypes[chartOptions["replicatedmap"]["replicatedmapChart4"]])
    return {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesReplicatedMap",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["replicatedmap"]["replicatedmapChart1"],
        chart2type: chartOptions["replicatedmap"]["replicatedmapChart2"],
        chart3type: chartOptions["replicatedmap"]["replicatedmapChart3"],
        chart4type: chartOptions["replicatedmap"]["replicatedmapChart4"],
        throughputInterval: throughputInterval['replicatedmap']
    }
}
function prepareCacheDataRequest() {
    $("#cacheChart1Title").text(chartTypes[chartOptions["cache"]["cacheChart1"]]);
    $("#cacheChart2Title").text(chartTypes[chartOptions["cache"]["cacheChart2"]]);
    $("#cacheChart3Title").text(chartTypes[chartOptions["cache"]["cacheChart3"]]);
    $("#cacheChart4Title").text(chartTypes[chartOptions["cache"]["cacheChart4"]]);
    return {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesCache",
        type: activeView,
        //Add /hz/ prefix to cache name as it's kept like that in TimedMemberState
        instance: '/hz/' + activeObject,
        chart1type: chartOptions["cache"]["cacheChart1"],
        chart2type: chartOptions["cache"]["cacheChart2"],
        chart3type: chartOptions["cache"]["cacheChart3"],
        chart4type: chartOptions["cache"]["cacheChart4"],
        throughputInterval: throughputInterval['cache']
    }
}
function prepareQueueDataRequest() {
    $("#queueChart1Title").text(chartTypes[chartOptions["queue"]["queueChart1"]])
    $("#queueChart2Title").text(chartTypes[chartOptions["queue"]["queueChart2"]])
    $("#queueChart3Title").text(chartTypes[chartOptions["queue"]["queueChart3"]])
    return  {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesQueue",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["queue"]["queueChart1"],
        chart2type: chartOptions["queue"]["queueChart2"],
        chart3type: chartOptions["queue"]["queueChart3"],
        throughputInterval: throughputInterval['queue']
    }
}
function prepareMultimapDataRequest() {
    $("#multimapChart1Title").text(chartTypes[chartOptions["multimap"]["multimapChart1"]])
    $("#multimapChart2Title").text(chartTypes[chartOptions["multimap"]["multimapChart2"]])
    $("#multimapChart3Title").text(chartTypes[chartOptions["multimap"]["multimapChart3"]])
    $("#multimapChart4Title").text(chartTypes[chartOptions["multimap"]["multimapChart4"]])
    return  {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesMultiMap",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["multimap"]["multimapChart1"],
        chart2type: chartOptions["multimap"]["multimapChart2"],
        chart3type: chartOptions["multimap"]["multimapChart3"],
        chart4type: chartOptions["multimap"]["multimapChart4"],
        throughputInterval: throughputInterval['multimap']
    }
}
function prepareTopicDataRequest() {
    $("#topicChart1Title").text(chartTypes[chartOptions["topic"]["topicChart1"]]);
    $("#topicChart2Title").text(chartTypes[chartOptions["topic"]["topicChart2"]]);

    return  {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesTopic",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["topic"]["topicChart1"],
        chart2type: chartOptions["topic"]["topicChart2"],
        throughputInterval: throughputInterval['topic']
    }
}
function prepareReliableTopicDataRequest() {
    $("#reliableTopicChart1Title").text(chartTypes[chartOptions["reliabletopic"]["reliableTopicChart1"]]);
    $("#reliableTopicChart2Title").text(chartTypes[chartOptions["reliabletopic"]["reliableTopicChart2"]]);

    return  {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesReliableTopic",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["reliabletopic"]["reliableTopicChart1"],
        chart2type: chartOptions["reliabletopic"]["reliableTopicChart2"],
        throughputInterval: throughputInterval['reliabletopic']
    }
}
function prepareExecutorDataRequest() {
    $("#executorChart1Title").text(chartTypes[chartOptions["executor"]["executorChart1"]]);
    $("#executorChart2Title").text(chartTypes[chartOptions["executor"]["executorChart2"]]);
    $("#executorChart3Title").text(chartTypes[chartOptions["executor"]["executorChart3"]]);
    $("#executorChart4Title").text(chartTypes[chartOptions["executor"]["executorChart4"]]);
    return  {
        cluster: activeCluster,
        operation: default_op + "_charts_dataTablesExecutor",
        type: activeView,
        instance: activeObject,
        chart1type: chartOptions["executor"]["executorChart1"],
        chart2type: chartOptions["executor"]["executorChart2"],
        chart3type: chartOptions["executor"]["executorChart3"],
        chart4type: chartOptions["executor"]["executorChart4"],
        throughputInterval: throughputInterval['executor']
    }
}
function prepareMemberDataRequest() {
    $("#memberCPUChartTitle").text(chartTypes[chartOptions["member"]["memberCPUChart"]]);
    $("#memberMemoryChartTitle").text(chartTypes[chartOptions["member"]["memberMemoryChart"]]);
    $("#memberNativeMemoryChartTitle").text(chartTypes[chartOptions["member"]["memberNativeMemoryChart"]]);
    return  {
        cluster: activeCluster,
        operation: default_op + "_memberruntime_memberProps_memberConfig_memberpartitions_getMemberCPUChart_getMemberMemoryChart_getMemberNativeMemoryChart_getMemberSlowOperationsList",
        member: activeObject
    }
}
function prepareClusterDataRequest() {
    return  {
        cluster: activeCluster,
        operation: default_op + "_partitionspiechart_clusterProps"
    }
}
function prepareHomeDataRequest() {
    return {
        cluster: activeCluster,
        // todo: clusterProps removed   , add and fix NPE on Cache
        operation: default_op + "_partitionspiechart_getAllMemberCPULoadAverage_getAllMemberMemoryAverage_getMapMemoryDistribution_getMemoryDistribution_getUnsafeMembers_getMigrationQueueSize"
    }
}
