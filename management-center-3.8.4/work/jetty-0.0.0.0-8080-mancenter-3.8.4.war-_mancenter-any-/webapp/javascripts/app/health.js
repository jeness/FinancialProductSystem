
function healthCheckAction() {
    $('#healthCheckTable .has-spinner').empty();
    $('#healthCheckTable .has-spinner').append("<span class='spinner'><i class='icon-spin icon-refresh'></i></span>");

    $('#healthCheckTable .has-spinner').addClass('active')
    var data = {cluster:activeCluster, operation:"healthcheck"}
    opcall(data)
}

function toggleImage(img) {
    if(img.attr("class") == "icon-plus text-success")
        img.attr("class","icon-minus text-error")
    else
        img.attr("class","icon-plus text-success")
}


function addMessages(coll, elem, id) {
    if (coll[0] == "OK") {
        elem.append('<i class="icon-ok text-success"></i>')
    }
    else if (coll[0] == "ERROR") {
        elem.append('<i class="icon-ban-circle text-error"></i>')
    }
    else if (coll[0] == "WARNING") {
        elem.append('<i class="icon-warning-sign text-warning"></i>')
    }


    if (coll.length > 1)
        elem.append('&nbsp;' + coll[1] )

    if (coll.length > 2) {
        elem.append('<div onclick="$(this).next().toggle(); toggleImage($(this).children().first()) " class="healthSeeDetailsDiv" ><i class="icon-plus text-success"></i> See Details</div>')
        var str = '<div style="display: none;">'
        for (var i = 2; i < coll.length; i++) {
            str = str + coll[i] + '<br/>'
        }
        elem.append(str + '</div>')
    }
    elem.removeClass('active')


}

function randNumber(num) {
    return Math.floor((Math.random()*num)+1);
}

function healthcheck(data) {
    var interval = 2000;
    setTimeout(function () {
        addMessages(data.member, $("#hcMemberStatus"))
    }, randNumber(interval))

    setTimeout(function () {
        addMessages(data.connection, $("#hcConnectionStatus"))
    }, randNumber(interval))

    setTimeout(function () {
        addMessages(data.locks, $("#hcLockStatus"))
    }, randNumber(interval))

    setTimeout(function () {
        addMessages(data.migration, $("#hcMigrationStatus"))
    }, randNumber(interval))

    setTimeout(function () {
        addMessages(data.partition, $("#hcPartitionStatus"))
    }, randNumber(interval))

}