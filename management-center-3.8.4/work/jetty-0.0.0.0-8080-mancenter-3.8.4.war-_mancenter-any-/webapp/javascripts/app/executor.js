// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function executorInit() {
refreshpage(0,true);
}
//newdesign
function executorlist(data) {
    executorListCache = data
    instanceList("executors",data,"executor")
}
function fillExecutorTable(data) {
    fillOperationsDataTable('#executoropstats', data);
}
function chartexecutor1(datalist) {
    drawChart("executorChart1", "executor", datalist)
}
function chartexecutor2(datalist) {
    drawChart("executorChart2", "executor", datalist)
}
function chartexecutor3(datalist) {
    drawChart("executorChart3", "executor", datalist)
}
function chartexecutor4(datalist) {
    drawChart("executorChart4", "executor", datalist)
}
