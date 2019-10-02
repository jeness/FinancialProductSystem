var currentScriptName;
var keyPressInit=false;
// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function scriptingInit(){
    if(codeMirror == null)
    {
        codeMirror = CodeMirror($('#scriptarea').get(0),{
            value : "function echo() {\n"+
                "var name = hazelcast.getName();\n"+
                "var node = hazelcast.getCluster().getLocalMember();\n"+
                "return name + ' => ' + node;\n"+
                "}\n"+
                "echo();\n" ,
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            mode:  "javascript",
            theme: "solarized solarized-light"
        });
    }
    if(keyPressInit==false)
    {
        var isCtrl = false;
        $(document).keyup(function (e) {
         if(e.which == 17) isCtrl=false;
        }).keydown(function (e) {
            if(e.which == 17) isCtrl=true;
            if(e.which == 83 && isCtrl == true) {
                saveScriptCheck();
                return false;
         }
        });
        keyPressInit=true;
    }
    onScriptingSectionLoad();

};
function onScriptingSectionLoad(){
    initMemberListForScripting = true;
    fillMemberListForScripting()
    codeMirror.refresh()
    if(writeMode == 0){
        $('#saveScriptButton').hide();
        $('#deleteScriptButton').hide();
        $('#savedScriptsAccordion').hide();
    }else{
        loadScriptNamesAction();
        $('#saveScriptButton').show();
        $('#deleteScriptButton').show();
        $('#savedScriptsAccordion').show();
   }
}

function sendScript() {
    $('#executeScriptButton').addClass('active')
    var script = codeMirror.getValue()
    var targetList = $("[name='memberchecklist']:checked")
    var targets = ""
    targetList.each(function () {
        if (targets.length > 0)
            targets += "," + $(this).val()
        else
            targets = $(this).val()
    })

    if (targets.length == 0) {
        alert("Please select at least one member to execute the script...")
        return
    }
    var lang = $('#radioscriptlanguage option:selected').val()
    var data = {cluster:activeCluster, operation:"executescript", script:script, targets:targets, lang: lang}
    opcall(data)
}



function executescript(olist) {
    if( olist == "error")
    {
        olist = "Error occured while executing the script. Please double-check you have a correct syntax or the selected nodes are up and running."
    }
    $("#scriptResult").html(olist)
    $('#executeScriptButton').removeClass('active')
}

function saveScriptCheck(){
    var name = $('#scriptName').val();
    if(name == "" ){
        $("#saveScriptNoNameDialog").dialog("open")
    }else if($('#savedScripts [name='+name+']').length){
        $("#saveScriptDialog").dialog("open")
    }else{
        saveScriptAction();
    }
}

function saveScriptAction(){
    var name = $('#scriptName').val();
    var code = codeMirror.getValue();
    var lang = $('#radioscriptlanguage option:selected').val()
    var data = {userName:username, operation:"saveScript", name:name, code:code, lang: lang}
    scriptNameCache = name;
    opcall(data)

}

function saveScript(olist){
    loadScriptNamesAction();
}

function loadScriptNamesAction(){
    var data = {userName:username, operation:"loadScriptNames"}
    opcall(data)
}

function loadScriptNames(olist){
    var scriptNames = "<ul style='list-style: none;margin:0'>";
    for(var i = 0 ; i < olist.length; i++){
        scriptNames += " <li><i class='icon-file'></i>"+
                            "<a  href='#' name='"+olist[i]+"' onclick='loadScriptAction(\""+  olist[i] +"\")' >" + olist[i] +"</a>"
                       +"</li>";
    }
    scriptNames += "</ul>"
    $('#savedScripts').html(scriptNames);
    if(olist.length != 0)
        loadScriptAction(scriptNameCache);
}

function loadScriptAction(name){
    var data = {userName:username, name:name,operation:"loadScript"}
    opcall(data)
}

function loadScript(olist){
    var name = olist[0];
    var lang = olist[1];
    var code = olist[2];
    $('#scriptName').val(name);
    var radioLanguage = $('div#scriptRadioList>input[value='+lang+']');
    if(radioLanguage.length == 1){
        radioLanguage.attr('checked', true);
        $('#textOtherLanguage').val("");
    }else{
        $('div#scriptRadioList>input[value=other]').attr('checked', true);
        $('#textOtherLanguage').val(lang);
    }
    codeMirror.setValue(code);
    codeMirror.setOption("mode", lang);
    codeMirror.refresh()
}

function deleteScriptAction(){
    $("#deleteScriptDialog").dialog("open")
}

function deleteScript(olist){
    loadScriptNamesAction()
    $('#scriptName').val("");
    codeMirror.setValue("");
    codeMirror.refresh()
}