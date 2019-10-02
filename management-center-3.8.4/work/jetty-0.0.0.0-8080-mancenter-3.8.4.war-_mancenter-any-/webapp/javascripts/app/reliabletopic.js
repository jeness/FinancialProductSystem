// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function reliabletopicInit() {
refreshpage(0,true);
}

//newdesign
function chartreliabletopic1(datalist) {
    drawChart("reliableTopicChart1", "reliabletopic", datalist)
}
function chartreliabletopic2(datalist) {
    drawChart("reliableTopicChart2", "reliabletopic", datalist)
}
function fillReliableTopicTable(data) {
    fillOperationsDataTable('#reliabletopicopstats', data);
}
function reliabletopiclist(data) {
    instanceList("reliabletopics",data,"reliabletopic")
}
