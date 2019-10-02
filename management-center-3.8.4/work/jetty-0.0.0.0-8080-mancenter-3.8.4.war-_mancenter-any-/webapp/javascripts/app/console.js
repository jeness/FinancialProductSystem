var connectedMember = null;
// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function consoleInit()
{
    $("#commandInput").focus()
}

function popoutConsole() {
    $("#consoleDiv").dialog("open")
    $("#commandInput").focus()
}


function sendCommand() {
    if ( connectedMember == null ){
        if(memberListCache.length > 0){
            connectedMember = memberListCache[0]["label"];
        }
    }

    var command = $("#commandInput").val()
    $("#commandInput").val("")
    $("#commandInput").focus()

    if(command == "") {
        $("#commandOutput").val($("#commandOutput").val() + namespace + "> " + command + "\n")
        $("#commandOutput").scrollTop(99999)
        return
    }

    if(command.substring(0, "connect".length) == "connect"){
        var cmd = command.split(" ");
        var member = cmd[1];
        var found = false;
        for(var i=0; i<memberListCache.length; i++){
            if ( memberListCache[i]["label"] == member ){
                found = true;
                break;
            }
        }
        if(found){
            connectedMember = member;
            $("#commandOutput").val($("#commandOutput").val() + "> Console will send its commands to the "+ member +" .\n")
            var textArea = document.getElementById('commandOutput');
            textArea.scrollTop = textArea.scrollHeight;
            var data = {cluster:activeCluster, operation:"executecommand", namespace:namespace, command:"ns " + namespace, connectedMember:connectedMember }
            opcall(data)
            return;

        } else {
            $("#commandOutput").val($("#commandOutput").val() + "> "+ member +" is not a member.\n")
            var textArea = document.getElementById('commandOutput');
            textArea.scrollTop = textArea.scrollHeight;
            return;
        }


    }


    $("#commandOutput").val($("#commandOutput").val() + namespace + "> " + command + "\n")

    if (command.indexOf("ns") == 0) {
        namespace = command.substring("ns ".length).trim();
        $("#commandOutput").val($("#commandOutput").val() + "> Current Namespace:" + namespace + "\n")
        var textArea = document.getElementById('commandOutput');
        textArea.scrollTop = textArea.scrollHeight;
    }


    var data = {cluster:activeCluster, operation:"executecommand", namespace:namespace, command:command, connectedMember:connectedMember }
    opcall(data)
}


function executecommand(data) {
    $("#commandOutput").val($("#commandOutput").val() + namespace + "> " + data)
    var textArea = document.getElementById('commandOutput');
    textArea.scrollTop = textArea.scrollHeight;
}
