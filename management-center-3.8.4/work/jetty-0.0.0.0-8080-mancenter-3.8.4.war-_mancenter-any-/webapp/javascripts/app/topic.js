// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function topicInit() {
refreshpage(0,true);
}

//newdesign
function charttopic1(datalist) {
    drawChart("topicChart1", "topic", datalist)
}
function charttopic2(datalist) {
    drawChart("topicChart2", "topic", datalist)
}
function fillTopicTable(data) {
    fillOperationsDataTable('#topicopstats', data);
}
function topiclist(data) {
    instanceList("topics",data,"topic")
}
