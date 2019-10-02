var schemeCache = ''
var lastTables = {};

function wanrepInit() {
    getPublisherList(activeObject)
}

function wanreptopInit() {
    getWanConfigList()
    getMapListForWanSync()
    getWanSyncState()
}

function getPublisherList(schemeName) {
    schemeCache = schemeName
    data = {cluster: activeCluster, scheme: schemeName, operation: "instancelist_wanPublisherList", curtime:0}
    opcall(data)
}

function getWanConfigList() {
    data = {cluster: activeCluster,operation: "wanConfigList", curtime:0}
    opcall(data)
}

function getMapListForWanSync() {
    data = {cluster: activeCluster,operation: "instancelist_mapListForWanSync", curtime:0}
    opcall(data)
}

function getWanSyncState() {
    data = {cluster: activeCluster,operation: "getWanSyncState"}
    opcall(data)
}

function openWanConfigDialog(){
    $('#wanConfigDialog').dialog("open")
}

function openWanSyncDialog(){
    $('#wanSyncDialog').dialog("open")
}

//called by wanConfigButton button
function addWanConfig() {
    var wanConfigForm = $("#wanConfigForm")
    var data = {cluster: activeCluster, operation: "addWanConfig"}

    $('.wanconfiginfo').each(
        function () {
            var title = $(this).attr("title")
            data[title] = $(this).val()
            //get placeholder values for default configs
            data["ph-" + title ] = $(this).attr("placeholder")
        });

    var configName = wanConfigForm.find('input[title="configName"]');
    var publisherName = wanConfigForm.find('input[title="publisherName"]');
    var endpoints = wanConfigForm.find('input[title="endpoints"]');
    var groupPassword = wanConfigForm.find('input[title="groupPassword"]');
    if ($.trim(configName.val()) === "" || $.trim(publisherName.val()) === ""
            || $.trim(endpoints.val()) === "" || $.trim(groupPassword.val()) === "") {
        $("#formAlert").slideDown(400);
    } else {
        opcall(data)
    }

    $(".alert").find(".close").on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).closest(".alert").slideUp(400);
    });
}

//called by webservice
function addwanconfig(dlist) {
    $("#wanConfigDialog").dialog("close")
    if (dlist == 'success')
        $.growl.notice({message: "Configuration has been successfully added."});
    else {
        $.growl.error({message: "There is a problem with adding wan configuration."});
        $.growl.error({message: dlist});
    }
}

function generateWanTables(data) {
    for (var i = 0; i < data.length; i++) {
        if (!lastTables[data[i]]) {
            lastTables[data[i]] = true
            $('#wanContainer').append(generateWanTable(data[i]))
        }
        fillWanDataTable(data[i])
    }

    for (var key in lastTables) {
        if (data.indexOf(key) == -1) {
            $("div[id='" + key + "WanDiv']").remove()
            delete lastTables[key]
        }
    }
}

function wanlist(data) {
    wanListCache = data
    instanceList("wanreps", data, "wanrep")
}

function fillWanSyncStatus(data) {
    var wan = data["wanconfigName"]
    var publisher = data["publisherName"]

    var status = data["status"]
    if(status == "IN_PROGRESS") {
        $("#startWanSyncButton").prop("disabled",true);
    } else {
        $("#startWanSyncButton").prop("disabled",false);
    }

    var progress = data["progress"]
    var $progressBar = $('<div/>').attr('class', 'progress progress-striped');
    var $div = $('<div class="bar" style="width: '+progress+'%;"></div>').attr('id', 'sync-progress-bar');
    $progressBar.append($div);

    if(wan != null && wan != undefined && publisher != null && publisher != undefined){
        $('#wanTargetTable').find('tbody tr')
            .replaceWith($('<tr>')
                .append($('<td class="span3" id="tdWanConfName' + wan +'">')
                    .text(wan)
                )
                .append($('<td class="span3" id="tdWanPublisherName' + publisher +'">')
                    .text(publisher)
                )
                .append($('<td class="span3" id="tdWanProgress' + wan + publisher + '">')
                    .append($progressBar)
                )
                .append($('<td class="span3" id="tdWanStatus' + wan + publisher + '">')
                    .text(status)
                )
            );
        }
}

var wanConfig = ''
var publisherConfig = ''

function fillWanConfigsDropdown(data) {
    var wanConfigs = $('#wanConfigsDropdown')
    for(wan in data){
        var exists = 0 != $('#wanConfigsDropdown option[value='+wan+']').length;
        if(!exists) {
            wanConfigs.append(
                $('<option></option>').val(wan).html(wan)
            );
        }
    }
    wanConfigs.on("change", function() {
            wanConfig = this.value;
            fillWanPublishersDropdown(data, wanConfig)
    });
}

function fillWanPublishersDropdown(data , wanConfigName) {
    var publisherConfigs = $('#publishersDropdown')
    publisherConfigs.empty()
    publisherConfigs.append($('<option selected disabled></option>').val("").html("Select Publisher"));

    var publishers = data[wanConfigName]
    for (var i in publishers) {
        publisher = publishers[i]
        var exists = 0 != $('#publishersDropdown option[value='+publisher+']').length;
        if(!exists) {
            publisherConfigs.append(
                $('<option></option>').val(publisher).html(publisher)
            );
        }
    }
    publisherConfigs.on("change", function() {
        publisherConfig = this.value;
    });
}

function fillMapDropdownForWanSync(data) {
    var mapsDropdown = $('#mapsDropdown')
    for(var i = 0; i < data.length; i++){
        var map = data[i]
        var exists = 0 != $('#mapsDropdown option[value='+map+']').length;
        if(!exists) {
            mapsDropdown.append(
                $('<option></option>').val(map).html(map)
            );
        }
    }
    var allMapsExists = 0 != $('#mapsDropdown option[value=allmaps]').length;
    if(!allMapsExists){
        mapsDropdown.append($('<option></option>').val("allmaps").html("All Maps"));
    }

    mapsDropdown.on("change", function() {
        syncMap = this.value;
    });
}

//called by syncButton
function wanSyncMap() {
    if(syncMap == "allmaps") {
        data = {
            cluster: activeCluster,
            curtime: 0,
            wanRep : wanConfig,
            publisher: publisherConfig,
            operation: "wanSyncAllMaps"
        }
    } else {
        data = {
            cluster: activeCluster,
            curtime: 0,
            wanRep : wanConfig,
            publisher: publisherConfig,
            syncMap : syncMap,
            operation: "wanSyncMap"
        }
    }
    opcall(data)
}

//called by webservice
function wansyncmap(dlist) {
    $('#wanSyncDialog').dialog("close")
    if (dlist == 'success')
        $.growl.notice({message: "Sync initiated"});
    else {
        $.growl.error({message: "Can not be initiated"});
        $.growl.error({message: dlist});
    }
}

function wansyncallmaps(dlist) {
    $('#wanSyncDialog').dialog("close")
    if (dlist == 'success')
        $.growl.notice({message: "All Map Sync initiated"});
    else {
        $.growl.error({message: "Can not be initiated"});
        $.growl.error({message: dlist});
    }
}


function fillWanDataTable(publisherName) {
    data = {
        cluster: activeCluster,
        curtime: 0,
        scheme: schemeCache,
        publisher: publisherName,
        operation: "wanPublisherDataTable"
    }
    opcall(data)
}

function fillwandatatable(data) {
    var name = data[data.length - 1][0]
    data.splice(data.length - 1)
    fillDataTable("table[id='" + name + "WanTable']", data)
}

function stopMember(member, scheme, publisher) {
    var data = {
        operation: 'stopWanMember',
        cluster: activeCluster,
        member: member,
        scheme: scheme,
        publisher: publisher
    }
    opcall(data)
}

function startMember(member, scheme, publisher) {
    var data = {
        operation: 'startWanMember',
        cluster: activeCluster,
        member: member,
        scheme: scheme,
        publisher: publisher
    }
    opcall(data)
}

function clearWanQueues(member, scheme, publisher) {
    var data = {
        operation: 'clearWanQueues',
        cluster: activeCluster,
        member: member,
        scheme: scheme,
        publisher: publisher
    }
    opcall(data)
}

function startwanmember(data) {
    $.growl.warning({message: "Starting WAN Replication request is sent to member."});
}

function stopwanmember(data) {
    $.growl.warning({message: "Stopping WAN Replication request is sent to member."});
}

function clearWanQueuesResult(data) {
    $.growl.warning({message: "Request is sent to member"});
}

function generateWanTable(name) {
    var wanTableHtml = "";
    wanTableHtml += "<div class=\"row-fluid\" id=\"" + name + "WanDiv\">";
    wanTableHtml += "    <div class=\"span12\">";
    wanTableHtml += "        <div class=\"box\">";
    wanTableHtml += "            <div class=\"box-header\">";
    wanTableHtml += "                <span class=\"title\">" + name + "<\/span>";
    wanTableHtml += "            <\/div>";
    wanTableHtml += "            <div class=\"box-content\">";
    wanTableHtml += "                <table class=\"dTable responsive dataTable\" id=\"" + name + "WanTable\">";
    wanTableHtml += "                    <thead>";
    wanTableHtml += "                    <tr>";
    wanTableHtml += "                        <th class=\"sorting\">";
    wanTableHtml += "                            <div><span>#&nbsp;&nbsp;<\/span><\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                        <th class=\"sorting\">";
    wanTableHtml += "                            <div>Members<\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                        <th class=\"sorting\">";
    wanTableHtml += "                            <div>Connected<\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                        <th class=\"sorting\">";
    wanTableHtml += "                            <div>Outbound Recs (Sec)<\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                        <th class=\"sorting\">";
    wanTableHtml += "                            <div>Outbound Lat (ms)<\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                        <th class=\"sorting\">";
    wanTableHtml += "                            <div>Outbound Queue<\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                        <th>";
    wanTableHtml += "                            <div>Action<\/div>";
    wanTableHtml += "                        <\/th>";
    wanTableHtml += "                    <\/tr>";
    wanTableHtml += "                    <\/thead>";
    wanTableHtml += "                <\/table>";
    wanTableHtml += "            <\/div>";
    wanTableHtml += "        <\/div>";
    wanTableHtml += "    <\/div>";
    wanTableHtml += "<\/div>";

    return wanTableHtml
}
