// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function multimapInit() {
refreshpage(0,true);
}
//newdesign
function chartmultimap1(datalist) {
    drawChart("multimapChart1", "multimap", datalist)
}
function chartmultimap2(datalist) {
    drawChart("multimapChart2", "multimap", datalist)
}
function chartmultimap3(datalist) {
    drawChart("multimapChart3", "multimap", datalist)
}
function chartmultimap4(datalist) {
    drawChart("multimapChart4", "multimap", datalist)
}
function fillMultiMapMemoryTable(data) {
    fillDataTable('#multimapmemorydatatable', data)
}
function fillMultiMapThroughputTable(data) {
    fillOperationsDataTable('#multimapthroughputdatatable', data)
}
function multimaplist(data) {
    multimapListCache = data
    instanceList("multimaps", data, "multimap")
}

