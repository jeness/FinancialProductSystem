// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function cacheInit() {
}

function cachelist(data) {
    instanceList("caches",data,"cache");
}

function fillCacheTable(data) {
    fillDataTable('#cachedatatable', data)
}

function chartcache1(datalist) {
    drawChart("cacheChart1", "cache", datalist);
}
function chartcache2(datalist) {
    drawChart("cacheChart2", "cache", datalist);
}
function chartcache3(datalist) {
    drawChart("cacheChart3", "cache", datalist);
}
function chartcache4(datalist) {
    drawChart("cacheChart4", "cache", datalist);
}

function cacheBrowseModal()
{
    $('#cacheBrowseDialog').dialog("open")
}
function cacheBrowse()
{
    $("#cacheBrowseButton").addClass("active")
    var type = $("#cacheBrowseKeyType").val()
    var data = {
                cluster: activeCluster,
                operation: "browseCache",
                cacheName: activeObject,
                key: $("#cacheBrowseKey").val(),
                type: type
                }
    opcall(data)
}

//called by webservice
function browseCache(data) {
    $("#cacheBrowseInfo").html("")
    if(Object.keys(data).length == 0){
        $(".browseValueTd").html("")
        $("#cacheBrowseInfo").html("No value found.")
        $("#cacheBrowseButton").removeClass("active")
        return;
    }
    console.log(data)
    for (info in data) {
        console.log(data[info])
        console.log(typeof(data[info]))
        $("#" + info).html(data[info])
    }
    $("#cacheBrowseButton").removeClass("active")
}