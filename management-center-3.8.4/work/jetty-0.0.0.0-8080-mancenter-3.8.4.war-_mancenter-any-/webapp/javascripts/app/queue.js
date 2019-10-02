// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function queueInit() {
refreshpage(0,true);
}
//newdesign
function chartqueue1(datalist) {
    drawChart("queueChart1", "queue", datalist)
}
function chartqueue2(datalist) {
    drawChart("queueChart2", "queue", datalist)
}
function chartqueue3(datalist) {
    drawChart("queueChart3", "queue", datalist)
}
function queuelist(data) {
    queueListCache = data
    instanceList("queues",data,"queue")
}
function fillQueueTable(data) {
    fillDataTable('#queuestats', data)
}
function fillQueueOperationsTable(data) {
    fillOperationsDataTable('#queueopstats', data)
}


