// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function mapInit() {
    refreshpage(0,true);
    var data = {cluster: activeCluster, operation: "loadmapconfig", mapName: activeObject};
    opcall(data);
}

function chartmap1(datalist) {
    drawChart("mapChart1", "map", datalist);
}
function chartmap2(datalist) {
    drawChart("mapChart2", "map", datalist);
}
function chartmap3(datalist) {
    drawChart("mapChart3", "map", datalist);
}
function chartmap4(datalist) {
    drawChart("mapChart4", "map", datalist);
}
function fillMapMemoryTable(data) {
    fillDataTable('#mapmemorydatatable', data)
}
function fillNearCacheTable(data) {
    fillDataTable('#nearcachedatatable', data)
}
function fillMapThroughputTable(data) {
    fillOperationsDataTable('#mapthroughputdatatable', data)
}
function fillCacheThroughputTable(data) {
    fillOperationsDataTable('#cachethroughputdatatable', data)
}
function maplist(data) {
    mapListCache = data
    instanceList("maps",data,"map")
}
function openChartWindow(activeCluster, activeView, activeObject, chartType) {
    window.open("chart.html?activeCluster=" + activeCluster + "&activeView=" + activeView + "&instance=" + activeObject + "&chartType=" + chartType, "_blank", "width=400px,height=350px,menubar=no,location=no,scrollbars=no,");
}
function mapBrowseModal()
{
    $('#mapBrowseDialog').dialog("open")
}
function mapBrowse()
{
    $("#mapBrowseButton").addClass("active")
    var type = $("#mapBrowseKeyType").val()
    var data = {cluster: activeCluster, operation: "browseMap", mapName: activeObject, key: $("#mapBrowseKey").val(), type: type}
    opcall(data)
}
//called by webservice
function browseMap(dataList) {
    $("#mapBrowseInfo").html("")
    if(Object.keys(dataList).length == 0){
        $(".browseValueTd").html("")
        $("#mapBrowseInfo").html("No value found.")
        $("#mapBrowseButton").removeClass("active")
        return;
    }
    for (data in dataList) {
        $("#" + data).html(dataList[data])
    }
    $("#mapBrowseButton").removeClass("active")
}
function mapConfigModal()
{
    $('#mapConfigDialog').dialog("open")
    $("#updateConfigMessageTd").empty()
    mapConfig();

}
//called by map config button
function mapConfig() {
    var data = {cluster: activeCluster, operation: "loadmapconfig", mapName: activeObject}
    opcall(data)
}
//called by web service
function loadmapconfig(dlist) {

    $(".mapconfiginfo").each(function () {
        var t = $(this).attr("title")

        if ($(this).is('input')) {
            $(this).val("" + dlist[t])
        }
        else if ($(this).is('select')) {
            $(this).val("" + dlist[t])
        }
    });

    $("#mapmemorydatatabletitle").text("Map Memory Data Table (In-Memory Format: " + dlist["memoryFormat"] + ")");
    $("#inMemoryStorageFormat").text(dlist["memoryFormat"]);
}

//called by map config update button
function mapConfigUpdate() {
    $("#mapConfigButton").addClass("active")
    $("#updateConfigMessageTd").html("")

    var data = {cluster: activeCluster, operation: "updatemapconfig", mapName: activeObject}
    $('.mapconfiginfo').each(
        function () {
            data[$(this).attr("title")] = $(this).val()
        });
    opcall(data)
}
//called by webservice
function updatemapconfig(dlist) {
    if (dlist == 'success')
        $("#updateConfigMessageTd").html("Configuration has been successfully updated.")
    else
        $("#updateConfigMessageTd").html("There is a problem with updating map configuration.")
    $("#mapConfigButton").removeClass("active")
}

