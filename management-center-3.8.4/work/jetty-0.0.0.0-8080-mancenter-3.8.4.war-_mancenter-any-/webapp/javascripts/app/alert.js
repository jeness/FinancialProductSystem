// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function alertsInit()
{
    if (writeMode == 0) {
        $("#readOnlyError").dialog("open")
    } else {
        fillAlertList()
        getAlertHistoryAction()
    }
    $('#alertBoxContentTitle').html("Alerts")
    refreshpage(0,true);
}
var activeFilterName;

function getAlertHistoryAction() {
    $('#alertBoxContentTitle').html("Alert History")
    var data = {cluster:activeCluster, operation:"getAlertHistory"}
    opcall(data)
}

function getAlertHistory(olist) {

    var filter_names = olist.filterNames.split(",")

    $("#alertHistoryGrid").empty();
    for(var i = 0 ; i < filter_names.length ; i++){
        if(filter_names[i] != ""){
            if($('#alertHistory_' + filter_names[i]).length == 0 ){
                var filterNameNoWhiteSpace = filter_names[i].replace(/\s/g, '')
                var strHist = "<span id=\""+filterNameNoWhiteSpace+"_wrapper\"> <table class=\"dTable responsive dataTable\" id=\"alertHistory_" +filterNameNoWhiteSpace+"\"><thead><tr><th class=\"sorting\"><div>Date</div></th><th class=\"sorting\"><div>Alert Message&nbsp;&nbsp;</div></th></tr></thead></table></span>" ;
                $("#alertHistoryGrid").append(strHist)
            }
        }
    }

    var hist = olist.alertHistory;

    var data = {}
    for (var i = 0; i < hist.length; i++) {
        var ss = hist[i]
        var entry = [];
        entry = data[ss[1]] //filterName ss[1]
        if(entry == null){
            entry = [];
        }
        entry.push({date: ss[0] , message : ss[2]})
        data[ss[1]] = entry;
    }

     for(var i = 0 ; i < filter_names.length ; i++){
        if(filter_names[i] != ""){
            var filterNameNoWhiteSpace = filter_names[i].replace(/\s/g, '')
            loadHistory(filterNameNoWhiteSpace , data[filter_names[i]]);
        }
    }
}

function loadHistory(filterName , olist){
    $("#"+ filterName+"_wrapper").hide()
    if(olist == null || olist.length == 0){
        return
    }

    var data = [];
    for (var i = 0; i < olist.length; i++) {
        data[i] = [olist[i].date,  olist[i].message]
    }
    var datatable = fillDataTable("#alertHistory_"+filterName,data, true)
    if(activeFilterName!=null)
        $("#"+activeFilterName+"_wrapper").show()
    datatable.fnAdjustColumnSizing();

}
function showPersistedData(filterName){
    var filterNameNoWhiteSpace = filterName.replace(/\s/g, '')
    activeFilterName=filterNameNoWhiteSpace;
    filterCreateOrEdit = "edit";
    if(admin){
        $('#clearFilterHistoryButtonHolder').html('<button onclick="clearFilterHistoryAction(\''+ filterName +'\')" id="clearFilterHistoryButton" class="btn btn-default">Clear</button>');
    }
    $('#filterNameHeader').html("Alert history for "+filterName);
    getAlertHistoryAction();
    closeEverythingBut(["refreshHistoryButton", "filterNameHeader","clearFilterHistoryButton","alertHistoryGridAccordion"])
    $("#alertHistoryGrid > span").hide()
}

function clearFilterHistoryAction(filterName) {
    var data = {operation:"clearFilterHistory" , cluster:activeCluster,  filterName : filterName}
    opcall(data)
}

function clearFilterHistory(olist){
    getAlertHistoryAction()
}

function fillAlertList()
{
    var filterListDiv = $("#filterListDiv")
    var smtpDiv = $('#smtpDiv')

    filterListDiv.empty();
    smtpDiv.empty();

    if(admin){
        var str = "<tr><td colspan='3'><button class='btn btn-success' id='createFilterButton' onclick='createFilter()' >Create New Filter</button></td><tr>";
        var smtpStr = "<tr><td colspan='3'><button class='btn btn-success' id='createSmtpButton' onclick='showSmtpConfigScreen()' >Create SMTP Config</button></td><tr>";

        $('#filterListDiv').append($(str));
        $('#smtpDiv').append($(smtpStr));
        if(filterCreateOrEdit == "create"){
            closeEverythingBut(["alertTypes"]);
        }
    }
    var data = {operation : "getAlertFilterNames" , cluster : activeCluster}
    opcall(data);
}
function loadAlertFilterNames(olist){
    if(olist == "")
        $('#filterListDiv').append('There is no saved filter.');
    var filter_names = olist.split(",")
    if(filter_names.length == 0)
    {
        $('#filterListDiv').append('There is no saved filter.');
    }
    for(var i = 0 ; i < filter_names.length ; i++){
        if(filter_names[i] != "")
            addFilter(filter_names[i]);
    }
}
function addFilter(filterName){
    var str = "<tr id = 'filterName_"+filterName+"'>";
    str += "<td><a href='#' onclick='showPersistedData(\""+filterName+"\")'>"+filterName+"</a></td>";
    if(admin){
        str += "<td><button id='"+filterName+"_editFilter' class='btn btn-default btn-mini' onclick='editFilter(\""+filterName+"\")' ><i class='icon-wrench'></i></button></td>";
        str += "<td><button id=\""+filterName+"_deleteFilter\" class='btn btn-default btn-mini' onclick='deleteFilter(\""+filterName+"\")' ><i class='icon-remove'></i></button></td>";
        str += "</tr>";
        $('#filterListDiv').append($(str));
    }else{
        str += "</tr>";
        $('#filterListDiv').append($(str));
    }
}

function saveFilterCheckName(){
    if($('#filterName').val() == "" ){
            $("#saveFilterNoNameDialog").dialog("option", "width", 400);
            $("#saveFilterNoNameDialog").dialog("option", "height", 210);

            $("#saveFilterNoNameDialog").dialog("option", "buttons",
                [
                    {id:"saveFilterNoNameCancel", text:"OK", click:function () {
                        $(this).dialog("close")
                    }}
                ])
            $("#saveFilterNoNameDialog").dialog("open")
            return;

    }
    saveFilterCheckExist();
}

function saveFilterCheckExist(){

    var filterName = $('#filterName').val();
    var filterType = $('input[name=alertTypesRadio]:checked').attr('id');
    if( $("#filterListDiv > tbody > #filterName_"+filterName).length){
        $("#saveFilterDialog").dialog("option", "width", 500);
        $("#saveFilterDialog").dialog("option", "height", 210);

        $("#saveFilterDialog").dialog("option", "buttons",
            [
                {id:"saveFilterOverwrite", text:"Overwrite", click:function () {
                    saveFilterAction(filterType);
                    $(this).dialog("close")

                }},
                {id:"saveFilterCancel", text:"Cancel", click:function () {
                    $(this).dialog("close")
                }}
            ])
        $("#saveFilterDialog").dialog("open")
        return;
    }
    saveFilterAction(filterType);
}

function saveFilterAction(filterType){

   var filterName = $('#filterName').val()
   var filterNameNoWhiteSpace = filterName.replace(/\s/g, '')
   var isPersisted = $('#persist:checked').length ? true : false
   var emailConfig = $('#email:checked').length ? true : false
   var emailAddresses = $('#alertEmailAddresses').val()
   var intervalSec = $('#intervalSec').val()

   var strHist = "<span id=\""+filterNameNoWhiteSpace+"_wrapper\"> <table class=\"dTable responsive dataTable\" id=\"alertHistory_" + filterNameNoWhiteSpace +"\"><thead><tr><th class=\"sorting\"><div>Date</div></th><th class=\"sorting\"><div>Alert Message&nbsp;&nbsp;</div></th></tr></thead></table></span>" ;
   $("#alertHistoryGrid").append(strHist)
   $("#"+ filterNameNoWhiteSpace+"_wrapper").hide();
    if(filterType == "memberFilterButton"){
        var memberFilter = $('input[name=memberFilter]:checked')

        var memberList;
        if($('#mall').is(':checked') ){
            memberList = "all";
        }else{
            var member_list = new Array();

            for(var i = 0; i < memberFilter.length ; i++){
                member_list[i] = $(memberFilter[i]).attr('id').substring(1)//1 because starts with m
            }
            memberList = member_list.toString();
        }


        var memberDetails = $('input[name=memberDetails]:checked');
        var checkList = "";
        for(var i= 0; i < memberDetails.length ; i++){
            var prop = $(memberDetails[i]).attr('id').substring(9)
            var value = $('#member_'+prop).val()
            checkList += "##" +prop +":"+value
        }
        checkList = checkList.substring(2)


        var data = {
            operation:"saveMemberAlertFilter",
            filterName: filterName,
            clusterName:activeCluster,
            isPersisted : isPersisted,
            emailConfig: emailConfig,
            memberList : memberList,
            checkList: checkList,
            intervalSec: intervalSec,
            emailAddresses: emailAddresses
        }
        opcall(data)
   }else if(filterType == "dataTypeFilterButton"){
        var dataType = $('input[name=dataTypeFilterRadio]:checked').attr('id').substring('9')
        var dataFilter = $('input[name=nameFilterList]:checked')

        var data_list = new Array();
        var count = 0;
        for(var i = 0; i < dataFilter.length ; i++){
            var name = $(dataFilter[i]).attr('id').substring(20);
            if(name != "all"){
                data_list[count++] =  $(dataFilter[i]).attr('id').substring(20)
            }
        }
        var dataList = data_list.toString();

        var memberFilter = $('input[name=memberFilterForDataType]:checked')
        var memberList;
        if($('#mdall').is(':checked') ){
            memberList = "all";
        }else{
            var member_list = new Array();

            for(var i = 0; i < memberFilter.length ; i++){
                member_list[i] = $(memberFilter[i]).attr('id').substring(2)//1 because starts with md
            }
            memberList = member_list.toString();
        }

        var dataTypeDetails = $('tr[name=' + dataType + 'Details]');

        var checkList = "";
        for(var i= 0; i < dataTypeDetails.length ; i++){
            var currentId = $(dataTypeDetails[i]).attr('id')
            var key =  currentId.split("_")[0]
            var op = currentId.split("_")[1]
            var value = currentId.split("_")[2]

            checkList += "##" +key +":"+op + ":" + value
        }
        checkList = checkList.substring(2)

        var data = {
            operation: "saveDataTypeAlertFilter",
            filterName: filterName,
            clusterName: activeCluster,
            isPersisted: isPersisted,
            emailConfig: emailConfig,
            dataType: dataType,
            dataList: dataList,
            memberList: memberList,
            checkList: checkList,
            intervalSec: intervalSec,
            emailAddresses: emailAddresses
        }
        opcall(data)
   }

}

function saveAlertFilter(olist){
    fillAlertList()
    createFilter()
}

function editFilter(filterName){
    $('#alertBoxContentTitle').html("Edit Filter -> " + filterName)
    $('#filterName').val(filterName);
    filterCreateOrEdit = "edit";
    var data = {operation : "getAlertFilter" , filterName : filterName , cluster : activeCluster}
    opcall(data)

}

function loadMemberAlertFilter(olist){
    $('#memberFilterButton').prop("checked",true);

    $('input[name=memberFilter]').prop("checked",false)
    $('input[name=memberDetails]').prop("checked",false)
    $('#member_freeMemory').val("")
    $('#member_usedMemory').val("")
    $('#member_activeThreads').val("")
    $('#member_daemonThreads').val("")

    fillAlertFiltersAction('memberFilter')
    if(olist.memberList == "all"){
            $('input[name=memberFilter]').prop("checked",true)
    }else{
        var member_list = olist.memberList.split(",");
        for(var i = 0; i < member_list.length ; i++){
            if(member_list[i] != ""){
                $("#m" + member_list[i].replace(/([\.:])/g, '\\$1') ).prop("checked",true)
            }
        }
    }
    var check_list = olist.checkList.split("##");
    for(var i = 0; i < check_list.length ; i++){
        if(check_list[i] != ""){
            var pair = check_list[i].split(":")
            var prop = pair[0]
            var value = pair[1]
            $('#checkbox_' + prop).prop("checked",true)
            $('#member_'+prop).val(value)
            $('#member_'+prop).attr("disabled",false)
        }
    }

    closeEverythingBut(['alertFilters','memberFilterAccordion','memberSpecificAccordion','alertActions'])
    loadAlertActions(olist)
    fillAlertList()
}

function loadDataTypeAlertFilter(olist){
    $('#dataTypeFilterButton').prop("checked",true)
    $('#dataType_'+olist.dataType).prop("checked",true)

    $('input[name=memberFilterForDataType]').prop("checked",false)
    $('input[name=nameFilterList]').prop("checked",false)

    $('tr[name=MultiMapDetails]').remove()
    $('tr[name=MapDetails]').remove()
    $('tr[name=QueueDetails]').remove()
    $('tr[name=ExecutorDetails]').remove()

    fillDataTypeAction(olist.dataType)
    var data_list = olist.dataList.split(",")
    for(var i = 0; i < data_list.length ; i++){
        if(data_list[i] != ""){
            $("#checkbox_nameFilter_" + data_list[i].replace(/([\.:])/g, '\\$1') ).prop("checked",true)
        }
    }

    dataNameIsChosen()
    if(olist.memberList == "all"){
        $('input[name=memberFilterForDataType]').prop("checked",true)
    }else{
        var member_list = olist.memberList.split(",");
        for(var i = 0; i < member_list.length ; i++){
            if(member_list[i] != ""){
                $("#md" + member_list[i].replace(/([\.:])/g, '\\$1') ).prop("checked",true)
            }
        }

    }
    var check_list = olist.checkList.split("##");
    for(var i = 0; i < check_list.length ; i++){
        if(check_list[i] != ""){
            var key = check_list[i].split(":")[0]
            var op = check_list[i].split(":")[1]
            var value = check_list[i].split(":")[2]
            insertDataTypeFilterToTable(key,op,value,olist.dataType);
        }
    }

    closeEverythingBut(['alertFilters', 'nameFilterAccordion','memberFilterForDataTypeAccordion', 'dataTypeSpecific', 'alertActions'])

    $("#"+ olist.dataType +"AlertFilterAccordion").show();

    loadAlertActions(olist)
    fillAlertList()
}

function loadAlertActions(olist){

    if(olist.period != null) {
        $('#periodMin').val(olist.period%60)
        $('#periodHour').val((olist.period - olist.period%60)/60)
    }
    $('#intervalSec').val("")

    if(olist.sendEmail == "true") {
        $("#intervalSec").attr('disabled', false);
    } else {
        $("#intervalSec").attr('disabled', true);
    }

    $('#email').prop("checked", olist.sendEmail == "true" ? true : false)
    $('#persist').prop("checked", olist.isPersisted == "true" ? true : false)
    $('#intervalSec').val(olist.intervalSec)
    $('#alertEmailAddresses').val(olist.emailAddresses)
}


function deleteFilter(filterName){
    $("#deleteFilterDialog").dialog(
        {autoOpen:false}
    );
    $("#deleteFilterDialog").dialog("option", "width", 500);
    $("#deleteFilterDialog").dialog("option", "height", 180);
    $("#deleteFilterDialog").dialog("open")

    $("#deleteFilterDialog").dialog("option", "buttons",
    [
        {id:"deleteFilterDialog", text:"Delete", click:function () {
            $('#filterName_'+filterName).remove()
            $('#alertHistory_'+filterName).remove()
            var data = {operation : "deleteAlertFilter" , filterName : filterName , cluster: activeCluster}
            opcall(data)
            $(this).dialog("close")
        }},
        {id:"deleteFilterDialog", text:"Cancel", click:function () {
            $(this).dialog("close")
        }}
    ])
}

function deleteAlertFilter(olist){
    fillAlertList()
    createFilter()
}

function fillAlertActionsAction(){
    $('#alertFilters').hide()
    $('#memberFilterAccordion').hide()
    $('#dataTypeFilterAccordion').hide()

    $('#alertActions').show()

}

function nextAction(){
    $('#nextButton').hide();
    $('#cancelFilterButtonC').hide();
    $('#dataTypeSpecific').hide()
    $('#memberSpecificAccordion').hide()

    var dataType = $('#dataType').html();
    $("#"+dataType+"AlertFilterAccordion").hide();

    fillAlertActionsAction()
}

function fillAlertFiltersAction(filterName){

    if(filterName == "dataTypeFilter"){
      $('#alertBoxContentTitle').html("Data Type Filter")
    }
    if(filterName == "memberFilter"){
        $('#' + filterName).empty()
        var str = "<table ><tbody>"
        str += "<tr><td style='vertical-align: middle;'><label class='checkbox'><input type='checkbox' name='memberFilter' id = 'mall' onclick=' $(\"input[name=memberFilter]\").attr(\"checked\", $(this).is(\":checked\") ) ' > All </label></td></tr>"

        for (var i = 0; i < memberListCache.length; i++) {
            str += "<tr><td style='vertical-align: middle;'><label class='checkbox'><input type='checkbox'  class='checkbox' name='memberFilter' id='m"+memberListCache[i].label+"' onclick='if( !$(this).is(\":checked\") ){ $(\"#mall\").attr(\"checked\", false ) } '>" + memberListCache[i].label + "</label></td></tr>"
        }
        str += "</td></tr>";
        str += "</tbody></table>"


        if(filterCreateOrEdit == "edit"){
           str += "<button id='chooseMemberListButton' onclick='memberListIsChosen()' class='btn btn-info' >Next</button>";
           str += "<button id='cancelFilterButtonA' onclick='createFilter()' class='btn btn-default'>Cancel</button>";

        }else{
           str += "<button id='cancelFilterButtonA' onclick='createFilter()' class='btn btn-default'  >Cancel</button>";
           str += "<button id='chooseMemberListButton' onclick='memberListIsChosen()' class='btn btn-info' >Next</button>";
        }


        $('#' + filterName).append(str)
    }


    $('#alertTypes').hide()
    $('#alertFilters').show()
    $('#' + filterName + 'Accordion').show()
}

function memberListIsChosen(){
    $('#memberFilterAccordion').hide();

    $('#memberSpecificAccordion').show();
    $('#nextButton').show();
    $('#cancelFilterButtonC').show();

}

function fillDataTypeAction(dataType){
     $('#dataTypeFilterAccordion').hide();

     $('#dataType').html(dataType);
     $('#dataTypeSpecific').show();

     var olist;
     if(dataType == "Map"){
        olist = mapListCache;
     }else if(dataType == "Queue"){
        olist = queueListCache;
     }else if(dataType == "MultiMap"){
        olist = multimapListCache;
     }else if(dataType == "Topic"){
        olist = topicListCache;
     }else if(dataType == "Executor"){
        olist = executorListCache;
     }
     $('#nameFilterList').empty();
     var str = "<table><tbody>"
     str += "<tr><td><label class='checkbox'><input type='checkbox' name='nameFilterList' id='checkbox_nameFilter_all' onclick='$(\"input[name=nameFilterList]\").attr(\"checked\", $(this).is(\":checked\") ) ' ></td><td>All</label></td></tr>"

     for (var i = 0; i < olist.length; i++) {
        str += "<tr><td><label class='checkbox'><input type='checkbox' name='nameFilterList' id='checkbox_nameFilter_"+ olist[i].label +"' onclick='if( !$(this).is(\":checked\") ){ $(\"#checkbox_nameFilter_all\").attr(\"checked\", false ) } ' ></td><td>" + olist[i].label + "</label></td></tr>"
     }
     str += "</tbody></table></br>"
     $('#nameFilterList').append($(str))

     $('#nameFilterAccordion').show();
     $('#dataNameChooseButton').show();
     $('#cancelFilterButton').show();
}

function dataNameIsChosen(){
    if(filterCreateOrEdit == "create")
        $('#nameFilterAccordion').hide();

    $('#dataNameChooseButton').hide()
    $('#cancelFilterButton').hide()

    var dataName = $('#dataName').val();
    var dataType = $('#dataType').html();
    if(dataName == ""){
        dataName = "all";
    }

    var  str = "<h5>Running on which members ?</h5>"
    str += "<table><tbody>"

    str += "<tr><td style='vertical-align: middle;'><label class='checkbox'><input type='checkbox' id='mdall' name='memberFilterForDataType' onclick=' $(\"input[name=memberFilterForDataType]\").attr(\"checked\", $(this).is(\":checked\") ) ' >All</label></td></tr>"

    for (var i = 0; i < memberListCache.length; i++) {
        str += "<tr><td style='vertical-align: middle;'><label class='checkbox'><input type='checkbox' name='memberFilterForDataType' id='md"+memberListCache[i].label+"' onclick='if( !$(this).is(\":checked\") ){ $(\"#mdall\").attr(\"checked\", false ) } ' >" + memberListCache[i].label + "</label></td></tr>"
    }
    str += "</td></tr>";
    str += "</tbody></table></br>"

    if(filterCreateOrEdit == "edit"){
       str += "<button id='cancelFilterButtonB' onclick='createFilter()' class='btn btn-default' >Cancel</button>";
       str += "<button id='chooseMemberListForDataTypeButton'  class='btn btn-info' onclick='memberFilterForDataTypeIsChosen(\""+ dataName +"\",\""+ dataType +"\")'";
       str += ">Next</button>";

    }else{
       str += "<button id='cancelFilterButtonB' onclick='createFilter()' class='btn btn-default'  >Cancel</button>";
       str += "<button id='chooseMemberListForDataTypeButton'  class='btn btn-info' onclick='memberFilterForDataTypeIsChosen(\""+ dataName +"\",\""+ dataType +"\")'";
       str += ">Next</button>";
    }

    $("#memberFilterForDataType").html(str);


    if(filterCreateOrEdit == "create"){
        $('#chooseMemberListForDataTypeButton').show()
        $("#memberFilterForDataTypeAccordion").show();
    }



}

function memberFilterForDataTypeIsChosen(dataName,dataType){
    $("#memberFilterForDataTypeAccordion").hide();

    $("#"+dataType+"AlertFilterAccordion").show();

    $('#nextButton').show();
    $('#cancelFilterButtonC').show();
}

function addDataTypeFilter(type){
    var value = $('#'+type+'Value').val();
    var key = $('#'+type+'Key option:selected').val();
    var op = $('#'+type+'Operation option:selected').val();
    insertDataTypeFilterToTable(key,op,value,type);

}
function insertDataTypeFilterToTable(key,op,value,type){

    var keyText = $('#'+type+'Key option[value="'+key+'"]').html()
    var opText = $('#'+type+'Operation option[value="'+op+'"]').html()
    if(value == "" )
        value = "0";

    id = key+'_'+op+'_'+value;
    if($('#' + id).length != 0){
        $('#' + id).remove()
    }
    var str = "<tr id='"+ id +"' name='"+type+"Details' >";
    str += "<td style='text-align: center;'>"+keyText+"</td>";
    str += "<td style='text-align: center;'>"+opText+"</td>";
    str += "<td style='text-align: center;'>"+value+"</td>";
    str += "<td style='text-align: center;'><button class='btn btn-default btn-mini' id='"+id+"Button' onclick='$(\"#"+ id +"\").remove()' ><i class='icon-remove'></i></button></td>";
    str += "</tr>";
    $('#'+type+'FilterTable').append(str);
//    $('#' + id + 'Button').button({ icons:{ primary:"ui-icon-closethick" } });
}

function alertPopup(data){
    if(data == null || data == "")
        return;
     $.growl.warning({message:data})
}
function closeEverythingBut(ids){
    $('#alertActions').hide();
    $('#alertTypes').hide();
    $('#alertFilters').hide();
    $('#alertHistoryGridAccordion').hide();
    $('#cancelFilterButton').hide();
    $('#cancelFilterButtonA').hide();
    $('#cancelFilterButtonB').hide();
    $('#cancelFilterButtonC').hide();
    $('#chooseMemberListButton').hide();
    $('#chooseMemberListForDataTypeButton').hide();
    $('#clearFilterHistoryButton').hide();
    $('#dataNameChooseButton').hide();
    $('#dataTypeFilterAccordion').hide();
    $('#dataTypeSpecific').hide();
    $('div[name=histGrid]').hide();
    $('.AlertFilterAccordion').hide();
    $('#filterNameHeader').hide();
    $('#memberFilterAccordion').hide();
    $('#memberFilterForDataTypeAccordion').hide();
    $('#memberSpecificAccordion').hide();
    $('#nameFilterAccordion').hide();
    $('#nextButton').hide();
    $('#refreshHistoryButton').hide();
    $('#alertPeriodAccordion').hide();

    for(var i = 0; i < ids.length ; i++){
        $('#'+ids[i]).show();
    }

}

function createFilter(){

   $('#alertBoxContentTitle').html("Create New Filter")
    filterCreateOrEdit = "create";
    $('input:radio.dataTypeFilterRadio').removeAttr("checked");
    $('input[name=alertTypesRadio]').removeAttr("checked");
    $('tr[name=dataTypeDetails]').remove()
    $('tr[name=executorDetails]').remove()
    $('#filterName').val("")
    closeEverythingBut(["alertTypes"])
}

function toggleEmailFields() {
    $('#intervalSec').attr('disabled', !$("#email").is(':checked'));
    $('#alertEmailAddresses').attr('disabled', !$("#email").is(':checked'));
}