var colors = ["235,104,65", "237,201,81", "27,103,107", "81,149,72", "204,51,63", "0,160,176", "136,196,37", "78,205,196", "192,41,66", "196,77,88", "105,210,231", "250,105,0", "186,48,48", "77,184,95"]

var pieChartOpts = {
    series: {
        pie: {
            show: true,
            radius: 1,
            label: {
                show: true,
                radius: 5 / 6,
                formatter: function (label, series) {
                    return '<div style="font-size:8pt;text-align:center;padding:2px; font-weight: bold; color: white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                },
                background: {
                    opacity: 0.5,
                    color: '#000'
                }
            }
        }
    },
    legend: {
        show: false
    }

}

var pieChartOptsMany = {
    series: {
        pie: {
            show: true,
            radius: 1,
            label: {
                show: false
            }
        }
    },
    legend: {
        show: false
    },
    grid: {
        hoverable: true,
        clickable: true
    }

}


var chartOpts = {
    series: {
        lines: { show: true },
        points: { show: true }
    },
    xaxis: {
        mode: "time", minTickSize: [15, "second"]
    },
    yaxis: {
        autoscaleMargin: 4
//                ticks: 10,
//                min: 0,
//                max: 1000
    },
    grid: {
        backgroundColor: { colors: ["#fff", "#eee"] }
    }
}


function partitionspiechart(dataList) {
    var placeholder = $("#clusterPartitionPieChart");
    placeholder.unbind();
    if (dataList.length > 15)
        $.plot(placeholder, dataList, pieChartOptsMany);
    else
        $.plot(placeholder, dataList, pieChartOpts);
    var previousPoint = null;

    placeholder.bind('mouseout', function() {
        $("#tooltip").remove();
        $(this).data('previous-post', -1);
    });

    placeholder.bind('plothover', function(event, pos, item) {
        if (item) {
            if ($(this).data('previous-post') != item.seriesIndex) {
                $(this).data('previous-post', item.seriesIndex);
            }
            $("#tooltip").remove();
            var percent = parseFloat(item.series.percent).toFixed(2);
            showTooltip(pos.pageX, pos.pageY, item.series.label + "-> " + percent + " %" );
        } else {
            $("#tooltip").remove();
            previousPost = $(this).data('previous-post', -1);
        }
    });

}


function clusterProps(dataList) {
    if (dataList != null) {
        if (dataList["return.hasOngoingMigration"] == "false") {
            $("#migrationWarningRow").hide()
        }
        else {
            $("#migrationWarningRow").show()
        }
        for (lbl in dataList) {
            if (lbl.split(".")[0] == "return") {
                continue;
            }
            var idm = lbl.split(".")[1]
            $("#" + idm).html(dataList[lbl])
        }
    }
}




function dateFormatter(row, cell, value, columnDef, dataContext) {
    return moment(value).fromNow();
}

function memberCpuLoadAverage(data) {
    $('#CPUUsageTable').empty()
    $('#CPUUsageTable').append("<tr><th>Node</th><th>1min</th><th>5min</th><th>15min</th><th>Utilization(%)</th></tr>")
    var counter = 0;
    for (var member in data) {
        var memberStr = member.split('.').join("").split(':').join("")
        $('#CPUUsageTable').append("<tr><td style='cursor: pointer' id='" + memberStr + "newTab" + "'><strong>" + member + "</strong></td><td>" + data[member]["1min"] + "</td><td>" + data[member]["5min"] + "</td><td>" + data[member]["15min"] + "</td><td><span id='" + memberStr + "'></span></td><tr>")
        addClickListener(memberStr,member)
        $('#' + memberStr).sparkline(data[member]['memberCpuChart'], {width: "150px", height: "35px", lineColor: "rgb(" + colors[counter % colors.length] + ")", fillColor: "rgba(" + colors[counter % colors.length] + ",0.5)", lineWidth: 2, spotRadius: 0, type: 'line',chartRangeMin:0,chartRangeMax:100, tooltipFormatter: function (sparkline, options, point) {

            var d = new Date(point.x);
            return d.toLocaleTimeString('en-GB') + "-> " + point.y + "%"
        }
        });
        counter += 1
    }
    $('#CPUUsageTable td').css({"vertical-align": "middle"})
    $('#CPUUsageTable td').css({"text-align": "center"})
    $('#CPUUsageTable th').css({"text-align": "center"})


}
function memberMemoryAverage(data) {
    $('#memoryUsageTable').empty()
    $('#memoryUsageTable').append("<tr><th>Node</th><th>Used Heap</th><th>Total Heap</th><th>Max. Heap</th><th>Heap Usage Percentage</th><th>Used Heap (MB)</th>" +
    "<th>Native Memory Max</th><th>Native Memory Used</th><th>Native Memory Free</th><th>Used Native (MB)</th>" +
    "<th>GC Major Count</th><th>GC Major Time(ms)</th><th>GC Minor Count</th><th>GC Minor Time(ms)</th></tr>");
    var counter = 0;
    for (var member in data) {
        var memberStr = member.split('.').join("").split(':').join("") + "memory"
        $('#memoryUsageTable').append("<tr><td style='cursor: pointer' id='" + memberStr + "newTab" + "'><strong>" + member + "</strong></td><td>" + data[member]["usedMemory"] + " MB</td><td>" + data[member]["totalMemory"] + " MB</td><td>" + data[member]["maxHeap"] + " MB</td><td>" + data[member]["percent"] + "%</td><td><span id='heap" + memberStr + "'></span></td>" +
        "<td>" + data[member]["nativeMemoryMax"] + "</td><td>" + data[member]["nativeMemoryUsed"] + "</td><td>" + data[member]["nativeMemoryFree"] + "</td>" + "<td><span id='native" + memberStr + "'></span></td>" +
        "<td>" + data[member]["gcMajorCount"] + "</td><td>" + data[member]["gcMajorTime"] + "</td><td>" + data[member]["gcMinorCount"] + "</td><td>" + data[member]["gcMinorTime"] + "</td><tr>")
        addClickListener(memberStr,member)
        $('#heap' + memberStr).sparkline(data[member]['memberMemoryChart'], {width: "100px", height: "35px", lineColor: "rgb(" + colors[counter % colors.length] + ")", fillColor: "rgba(" + colors[counter % colors.length] + ",0.5)", lineWidth: 2, spotRadius: 0, type: 'line',chartRangeMin:0,chartRangeMax:100, tooltipFormatter: function (sparkline, options, point) {

            var d = new Date(point.x);
            return d.toLocaleTimeString('en-GB') + "-> " + point.y + " MB"
        }
        });
        $('#native' + memberStr).sparkline(data[member]['memberNativeMemoryChart'], {width: "100px", height: "35px", lineColor: "rgb(" + colors[counter % colors.length] + ")", fillColor: "rgba(" + colors[counter % colors.length] + ",0.5)", lineWidth: 2, spotRadius: 0, type: 'line',chartRangeMin:0,chartRangeMax:100, tooltipFormatter: function (sparkline, options, point) {

            var d = new Date(point.x);
            return d.toLocaleTimeString('en-GB') + "-> " + point.y + " MB"
        }
        });
        counter += 1
    }
    $('#memoryUsageTable td').css({"vertical-align": "middle"})
    $('#memoryUsageTable td').css({"text-align": "center"})
    $('#memoryUsageTable th').css({"text-align": "center"})


}
function addClickListener(memberStr,member){
    $('#' + memberStr+ "newTab").click(function(){
        tabs.newTab(member,'member',listIcons['member'])
    });
}
// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function homeInit() {
    refreshpage(0,true);
}
function mapMemoryDistribution(data) {
    $('#mapMemoryDistribution').empty()
    var count = 0;
    var total = 0;
    var colorClass = ["", " bar-danger", " bar-warning", " bar-info", " bar-success"]
    for (var key in data) {
        var percent = parseFloat(data[key])
        total+= percent
        if(total>100.0)
            percent=data[key] - (total-100)
        $('#mapMemoryDistribution').append("<div class='bar" + colorClass[count % 5] + "' data-toggle='tooltip' data-title='" + key + " -> " + percent.toFixed(2) + " %' style='width:" + percent + "%'><span>" + key + " -> " + percent.toFixed(2) + "</span></div>");
        count = count + 1;

    }
    $("#mapMemoryDistribution .bar").tooltip();
}
function memoryDistribution(data) {
    $('#memoryDistribution').empty()
    var colorClass = ["", " bar-warning", " bar-success", " bar-info", " bar-danger"]
    var count = 0;
    var total = 0;
    for (var key in data) {
        var percent = parseFloat(data[key])
        total+= percent
        if(total>100.0)
            percent=data[key] - (total-100)
        $('#memoryDistribution').append("<div class='bar" + colorClass[count % 5] + "' data-toggle='tooltip' data-title='" + key + " -> " + percent.toFixed(2) + " %' style='width:" + percent + "%'><span>" + key + " -> " + percent.toFixed(2) + "</span></div>");
        count = count + 1;
    }
    //  $('#memoryDistribution').append("<div class='bar bar-success'  data-toggle='tooltip' data-title='" + totalPercentReal.toFixed(2) + " %' style='width:"+totalPercentForBar+"%;min-width:2%'><span>free space</span></div>");

    $("#memoryDistribution .bar").tooltip();
}
function unsafeMembers(data) {
    $healthCheckTbody = $('#healthCheckTbody')
    $healthCheckTbody.empty();
    if (data.length == 0) {
        $('#unsafeMembersDiv').hide()
    } else {
        $('#unsafeMembersDiv').show()
        for (i = 0; i < data.length; i++) {
                $healthCheckTbody.append('<tr><td>' + data[i] + '&nbsp;<img src="./images/warning.png" style="height:20px;"/></td></tr>')
        }
    }

}
function migrationQueueSize(data) {
    $waitingMigrationQueueSize = $('#waitingMigrationQueueSize')
    $waitingMigrationQueueSize.html(data);
    if (data > 0) {
        $waitingMigrationQueueSize.closest('div').removeClass('alert-info');
    } else {
        $waitingMigrationQueueSize.closest('div').addClass('alert-info');
    }
}

