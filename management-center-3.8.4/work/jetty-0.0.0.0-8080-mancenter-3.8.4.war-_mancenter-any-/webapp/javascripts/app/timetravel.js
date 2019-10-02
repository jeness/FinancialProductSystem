function prepareSlider() {
    $("#slider").slider({
        slide:function (event, ui) {
            if (ui.value > new Date().getTime()) {
                $("#slider").slider("value", new Date().getTime());
                refreshTimeLabel()
                curtime = 0
//                refreshpage(refreshSeconds)
//                alert("ss")
                return false;
            }
            refreshTimeLabel()
        },
        change:function (event, ui) {
            curtime = ui.value
            refreshTimeLabel()
            refreshpage(1)
        },
        max:getEndDate().getTime(),
        min:getStartDate().getTime(),
        step:1000 * refreshSeconds
    });

    $("#slider").slider("value", Math.min($("#slider").slider("option", "max"), new Date().getTime()));
    $('#timeTravelSwitch').on('switch-change', function (e, data) {
        if(data.value == true )
        {
          openTimeTravel();
        }
        else
        {
          disableTimeTravelConfirm();
        }
    });
    refreshTimeLabel()

}

function refreshTimeLabel() {
    var date = new Date($("#slider").slider("value"));
    $("#timeLabel").html(moment(date).format('HH:mm:ss'))
}

function backTime() {
    $("#slider").slider("value", $("#slider").slider("option", "value") - $("#slider").slider("option", "step"))
}

function forwardTime() {
    var newValue =  $("#slider").slider("option", "value") + $("#slider").slider("option", "step");
    $("#slider").slider("value", Math.min(newValue, new Date().getTime()))
}

function getStartDate() {
    var dt = $("#datepicker").datepicker("getDate")
    dt.setHours(0)
    dt.setMinutes(0)
    dt.setSeconds(0)
    return dt
}
function continueOperation()
{
    $("#slider").slider("value", new Date().getTime())
    curtime = 0
    refreshpage(refreshSeconds)
}

function getEndDate() {
    var dt = $("#datepicker").datepicker("getDate")
    var now = new Date()
    dt.setHours(23)
    dt.setMinutes(59)
    dt.setSeconds(59)
    return dt
}
function toggleTimeTravel()
{
    $('.timetravel').slideToggle()
}

function openTimeTravel() {
    if (writeMode == 0) {
//        $("#readOnlyError").dialog("open")
//        $("#timeTravelButton").attr("checked", false)
//        $("#timeTravelButton").button("refresh")
    }
    else if (writeMode == 1) {
        $("#enableTimeTravelDialog").dialog("open")
    }

    else if (writeMode == 2) {
        var options = {};
        $("#timeTravelDiv").toggle("blind", options, "fast", function () {
            if ($("#timeTravelButton")[0].checked) {
                curtime = $("#slider").slider("value")
                refreshpage(0)
            }
            else {
            }
        });
    }

}

function enableTimeTravelAction() {
    opcall({operation:"enabletimetravel"})
}

function enabletimetravel(data) {
    if (data == "SUCCESS") {
        writeMode = 2
        $("#slider").slider("enable")
        $("#datepicker").datepicker("enable")
        $("#continueOperationButton").bind('click',function()
        {
          continueOperation()
        })
        $("#forwardTimeButton").bind('click',function()
        {
          forwardTime()
        })
        $("#backTimeButton").bind('click',function()
        {
          backTime()
        });
        openTimeTravel()
//        fillAlertList()
//        getAlertHistoryAction()
    }
    else {
        reloadPage()
    }
}


function disableTimeTravelConfirm() {
    $("#disableTimeTravelDialog").dialog("open");
}

function disableTimeTravelAction() {
    opcall({operation:"disabletimetravel"})
}

function disabletimetravel(data) {
    if (data == "SUCCESS") {
        $("#slider").slider("disable")
        $("#datepicker").datepicker("disable")
        $("#continueOperationButton").unbind('click')
        $("#forwardTimeButton").unbind('click')
        $("#backTimeButton").unbind('click')
        openTimeTravel()
        writeMode = 1
        fillAlertList()
        getAlertHistoryAction()
        curtime = 0
        refreshpage(refreshSeconds)
    }
    else {
        reloadPage()
    }
}


