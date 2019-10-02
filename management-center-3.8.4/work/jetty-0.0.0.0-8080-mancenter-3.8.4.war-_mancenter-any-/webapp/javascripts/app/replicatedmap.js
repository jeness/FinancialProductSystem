// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function replicatedmapInit() {
    //enableMapButtons()
    //refreshpage(0,true);
}

function replicatedmaplist(data) {
    replicatedMapListCache = data
    instanceList("replicatedmaps",data,"replicatedmap")
}


function openChartOpts(e, did) {
    $(did).dialog("open").dialog("option", "position", [e.pageX, e.pageY]);
}



function memberFormatter(row, cell, value, columnDef, dataContext) {
    if (value == "TOTAL") {
        return "<a>" + value + "</a>";
    }
    return "<a href='#' onclick='addViewShort(\"" + value + "\", \"member\")'>" + value + "</a>";
}





/// newdesign

function chartreplicatedmap1(datalist) {
    drawChart("replicatedmapChart1", "replicatedmap", datalist);
}
function chartreplicatedmap2(datalist) {
    drawChart("replicatedmapChart2", "replicatedmap", datalist);
}
function chartreplicatedmap3(datalist) {
    drawChart("replicatedmapChart3", "replicatedmap", datalist);
}
function chartreplicatedmap4(datalist) {
    drawChart("replicatedmapChart4", "replicatedmap", datalist);
}
function fillReplicatedMapMemoryTable(data) {
    fillDataTable('#replicatedmapmemorydatatable', data)
}

function fillReplicatedMapThroughputTable(data) {
    fillOperationsDataTable('#replicatedmapthroughputdatatable', data)
}

function openChartWindow(activeCluster, activeView, activeObject, chartType) {
    window.open("chart.html?activeCluster=" + activeCluster + "&activeView=" + activeView + "&instance=" + activeObject + "&chartType=" + chartType, "_blank", "width=400px,height=350px,menubar=no,location=no,scrollbars=no,");
}

