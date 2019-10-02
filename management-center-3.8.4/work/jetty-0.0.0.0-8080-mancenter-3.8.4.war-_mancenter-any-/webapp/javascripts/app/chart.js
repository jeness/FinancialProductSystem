var dataCache;
var chartActiveView;
var throughputInterval =
{
    map: 60000,
    cache: 60000,
    queue: 60000,
    topic: 60000,
    reliabletopic: 60000,
    multimap: 60000,
    replicatedmap: 60000,
    executor: 60000
}
var chartOptions = {
    map: {
        mapChart1: "i_Map_OwnedEntryCount",
        mapChart2: "o_Map_total",
        mapChart3: "i_Map_OwnedEntryMemoryCost",
        mapChart4: "i_Map_BackupEntryCount"
    },
    replicatedmap: {
        replicatedmapChart1: "i_ReplicatedMap_OwnedEntryCount",
        replicatedmapChart2: "o_ReplicatedMap_total",
        replicatedmapChart3: "i_ReplicatedMap_OwnedEntryMemoryCost",
        replicatedmapChart4: "i_ReplicatedMap_Hits"
    },
    cache: {
        cacheChart1: "i_Cache_CacheGets",
        cacheChart2: "i_Cache_CachePuts",
        cacheChart3: "i_Cache_CacheRemovals",
        cacheChart4: "i_Cache_CacheEvictions"
    },
    queue: {
        queueChart1: "i_Queue_OwnedItemCount",
        queueChart2: "o_Queue_OfferOperationCount",
        queueChart3: "o_Queue_PollOperationCount"
    },
    topic: {
        topicChart1: "o_Topic_PublishOperationCount",
        topicChart2: "o_Topic_ReceiveOperationCount"
    },
    reliabletopic: {
        reliableTopicChart1: "o_ReliableTopic_PublishOperationCount",
        reliableTopicChart2: "o_ReliableTopic_ReceiveOperationCount"
    },
    multimap: {
        multimapChart1: "i_MultiMap_OwnedEntryCount",
        multimapChart2: "o_MultiMap_total",
        multimapChart3: "i_MultiMap_Hits",
        multimapChart4: "o_MultiMap_PutOperationCount"
    },
    executor: {
        executorChart1: "o_Executor_PendingTaskCount",
        executorChart2: "o_Executor_StartedTaskCount",
        executorChart3: "o_Executor_CompletedTaskCount",
        executorChart4: "o_Executor_TotalExecutionLatency"
    },
    member: {
        memberCPUChart: "memberCpuChart",
        memberMemoryChart: "memberMemoryChart",
        memberNativeMemoryChart: "memberNativeMemoryChart"
    }

}
var chartTypes = {
    "i_Map_OwnedEntryCount": "Size",
    "o_Map_total": "Throughput",
    "i_Map_OwnedEntryMemoryCost": "Memory",
    "i_Map_BackupEntryCount": "Backups",
    "i_Map_BackupEntryMemoryCost": "Backup Memory",
    "i_Map_Hits": "Hits",
    "i_Map_LockedEntryCount": "Locked Entries",
    "o_Map_PutOperationCount": "Puts/s",
    "o_Map_GetOperationCount": "Gets/s",
    "o_Map_RemoveOperationCount": "Removes/s",
    "i_ReplicatedMap_OwnedEntryCount": "Size",
    "o_ReplicatedMap_total": "Throughput",
    "i_ReplicatedMap_OwnedEntryMemoryCost": "Memory",
    "i_ReplicatedMap_BackupEntryCount": "Backups",
    "i_ReplicatedMap_BackupEntryMemoryCost": "Backup Memory",
    "i_ReplicatedMap_Hits": "Hits",
    "i_ReplicatedMap_LockedEntryCount": "Locked Entries",
    "o_ReplicatedMap_PutOperationCount": "Puts/s",
    "o_ReplicatedMap_GetOperationCount": "Gets/s",
    "o_ReplicatedMap_RemoveOperationCount": "Removes/s",
    "i_MultiMap_OwnedEntryCount": "Size",
    "o_MultiMap_total": "Throughput",
    "i_MultiMap_OwnedEntryMemoryCost": "Memory",
    "i_MultiMap_BackupEntryCount": "Backups",
    "i_MultiMap_BackupEntryMemoryCost": "Backup Memory",
    "i_MultiMap_Hits": "Hits",
    "i_MultiMap_LockedEntryCount": "Locked Entries",
    "o_MultiMap_PutOperationCount": "Puts/s",
    "o_MultiMap_GetOperationCount": "Gets/s",
    "o_MultiMap_RemoveOperationCount": "Removes/s",
    "i_Queue_OwnedItemCount": "Size",
    "o_Queue_OfferOperationCount": "Offers",
    "o_Queue_PollOperationCount": "Polls",
    "o_Topic_PublishOperationCount": "Publishes",
    "o_Topic_ReceiveOperationCount": "Receives",
    "o_ReliableTopic_PublishOperationCount": "Publishes",
    "o_ReliableTopic_ReceiveOperationCount": "Receives",
    "o_Executor_PendingTaskCount": "Pending",
    "o_Executor_StartedTaskCount": "Started",
    "o_Executor_TotalStartLatency": "Start Lat.(msec)",
    "o_Executor_CompletedTaskCount": "Completed",
    "o_Executor_CancelledTaskCount": "Cancelled",
    "o_Executor_TotalExecutionLatency": "Compl. Time (msec)",
    "memberCpuChart": "CPU Utilization",
    "memberMemoryChart": "Heap Memory Utilization",
    "memberNativeMemoryChart": "Native Memory Utilization",
    "i_Cache_CacheGets": "Gets",
    "i_Cache_CachePuts": "Puts",
    "i_Cache_CacheRemovals": "Removals",
    "i_Cache_CacheEvictions": "Evictions",
    "i_Cache_CacheHits": "Hits",
    "i_Cache_CacheMisses": "Misses",
    "i_Cache_AverageGetTime": "Avg Get Time",
    "i_Cache_AveragePutTime": "Avg Put Time",
    "i_Cache_AverageRemoveTime": "Avg Remove Time"

};
chartInit = {}
var charts = {};
$.urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

$(window).resize(function () {
    var bodyheight = $(window).height();
    $("#chart").height(bodyheight - 20);
    if ($.urlParam('chartType') == "memberMemoryChart")
        drawChart("chart", chartActiveView, dataCache, true);
    else
        drawChart("chart", chartActiveView, dataCache);

});


function changeThrougputInterval(type, interval) {
    throughputInterval[type] = interval;
    if (interval == 0) {
        $("#" + type + "SelectedThrougputInterval").html("Since Beginning");
    } else if (interval == 60000) {
        $("#" + type + "SelectedThrougputInterval").html("Last Minute");
    } else if (interval == 600000) {
        $("#" + type + "SelectedThrougputInterval").html("Last 10 Minute");
    } else {
        $("#" + type + "SelectedThrougputInterval").html("Last 1 Hour");
    }
    refreshpage(0, true);
}

function initChart() {
    requestData();
}
function requestData() {
    var data = {
        cluster: $.urlParam('activeCluster'),
        operation: "getChartData",
        instance: $.urlParam('instance'),
        chartType: $.urlParam('chartType'),
        curtime: 0
    }
    $("#chartTitle").text($.urlParam('activeView').charAt(0).toUpperCase() + $.urlParam('activeView').slice(1) + " " + chartTypes[data["chartType"]] + " -> " + $.urlParam('instance'))
    chartActiveView = $.urlParam('activeView');
    chartOptions[chartActiveView]["chart"] = $.urlParam('chartType');
    opcall(data)
    setTimeout(requestData, 5000)
}
function processData(datalist) {
    dataCache = datalist;
    if ($.urlParam('chartType') == "memberMemoryChart")
        drawChart("chart", chartActiveView, datalist, true);
    else
        drawChart("chart", chartActiveView, datalist);
}

function drawChart(container, type, datalist, multiple) {
    if (datalist == null)return;
    var options = {
        series: {
            lines: {show: true, fill: true},
            points: {show: false, fill: true, radius: 2}
        },
        xaxis: {
            minTickSize: [15, "second"],
            mode: "time",
            timezone: "browser",
            timeformat: "%H:%M:%S"
        },
        yaxis: {
            tickFormatter: function (value) {
                value = Math.ceil(value * 1000) / 1000;
                if (chartOptions[type][container] == "i_Map_OwnedEntryMemoryCost" ||
                    chartOptions[type][container] == "i_Map_BackupEntryMemoryCost" ||
                    chartOptions[type][container] == "i_MultiMap_OwnedEntryMemoryCost" ||
                    chartOptions[type][container] == "i_MultiMap_BackupEntryMemoryCost") {
                    if (parseInt(value) > 2000) {
                        value /= 1000;
                        return value + "MB"
                    }
                    return value + "KB";
                }
                else if (chartOptions[type][container] == "memberCpuChart")
                    return "% " + value;
                else if (chartOptions[type][container] == "memberMemoryChart"
                    || chartOptions[type][container] == "memberNativeMemoryChart")
                    return value + "MB";
                else
                    return value
            }
        },
        grid: {
            borderWidth: 0,
            hoverable: true,
            mouseActiveRadius: 20,
            color: "#ccc"
        },
        legend: {
            color: "black"
        },
        colors: ["#145167", "red", "orange"],
        shadowSize: 0
    };

    var chartData = [
        {
            label: "",
            data: []
        },
        {
            label: "",
            data: []
        },
        {
            label: "",
            data: []
        }
    ]


    if (multiple != null && multiple == true) {
        if (chartOptions[type][container] == "memberMemoryChart") {
            chartData[0]["data"] = datalist["heap"];
            chartData[0]["label"] = "Max"
            chartData[1]["data"] = datalist["heapMemory"];
            chartData[1]["label"] = "Used"
            chartData[2]["data"] = datalist["totalMemory"];
            chartData[2]["label"] = "Total"
        } else if (chartOptions[type][container] == "memberNativeMemoryChart") {
            chartData[0]["data"] = datalist["native"];
            chartData[0]["label"] = "Max"
            chartData[1]["data"] = datalist["usedNative"];
            chartData[1]["label"] = "Used"
            chartData[2]["data"] = datalist["totalNative"];
            chartData[2]["label"] = "Total"
        }
    }
    else {
        chartData[0]["data"] = datalist;
    }
    if (chartOptions[type][container].charAt(0) == "i") {
        chartData[0]["label"] = "x1000"
    }
    $.plot($('#' + container), chartData, options)


    //tooltip
    if (chartInit[container] == null) {
        var previousPoint = null;
        var myChart = $('#' + container).bind("plothover", function (event, pos, item) {

            if (item) {
                if (previousPoint != item.dataIndex) {

                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0],
                        y = Math.ceil(item.datapoint[1] * 1000) / 1000;
                    showTooltip(item.pageX, item.pageY,
                        ( moment(new Date(x))).format('HH:mm:ss') + " -> " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;

            }
        });
        chartInit[container] = true;
    }


}
function showTooltip(x, y, contents) {
    $("<div id='tooltip'>" + contents + "</div>").css({
        position: "absolute",
        display: "none",
        top: y + 5,
        left: x + 5,
        border: "1px solid #0b2a35",
        padding: "2px",
        "background-color": "#ffe",
        opacity: 0.90
    }).appendTo("body").fadeIn(0);
}