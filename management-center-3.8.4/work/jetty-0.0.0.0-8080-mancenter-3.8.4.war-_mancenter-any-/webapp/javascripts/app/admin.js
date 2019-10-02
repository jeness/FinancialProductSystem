// don't delete, this method is called dynamically by Tabs.prototype.showTab on tab.js
function adminInit()
{
    $.ajax({
        url: "user.do",
        data: {operation:"isUserManagementSupported"},
        cache: false,
        dataType: "json"
    }).done(function (resp) {
        for (key in resp) {
            if (key == "success") {
                if (resp[key] == true) {
                    $("#editUsersDiv").show();
                    if (writeMode == 0) {
                        changeSection('sectionHome')
                        resetBannerButtons()
                        $("#readOnlyError").dialog("open")
                    }
                    else {
                        fillUsersAction()
                        loadNewUserAction()
                    }
                    $('#userRegistration').parsley(
                        {
                            errors: {
                                container: function (element, isRadioOrCheckbox) {
                                    var $container = element.parent().find(".parsley-container");
                                    if ($container.length === 0) {
                                        $container = $("<div class='parsley-container' style='margin-bottom: 0px !important'></div>").insertAfter(element.parent());
                                    }
                                    return $container;
                                }
                            }
                        }
                    )
                } else {
                    $("#editUsersDiv").hide();
                }
            }
        }
    });
}

function updateUserAction() {
    if(!$('#editUser').parsley('validate')) {
        return;
    }

    var username = $("#e_username").val()
    var admin = $("#e_admin")[0].checked ? 1 : 0;
    var roles = $(".editRoleRadio:checked").val();
    var existingUserName = $("input[name='existingUserName']").val();
    var data = {operation:"updateuser", existingusername:existingUserName, username:username, admin:admin, roles:roles}
    opcall(data)
}

function newUserAction() {
    if(!$('#newUserRegistration').parsley('validate')) {
        return;
    }

    var password = $("#n_password").val()
    if (!isPasswordComplexEnough(password)) {
        return;
    }

    var username = $("#n_username").val()
    var admin = $("#n_admin")[0].checked ? 1 : 0;
    var roles = $(".roleRadio:checked").val();
    var data = {operation:"saveuser", username:username, password:password, admin:admin, roles:roles}
    opcall(data)
}

function showDeleteUserConfirm() {
    $('#deleteUserConfirm').dialog('open')
}

function showChangePasswordModal() {
    $("#changePasswordModal").dialog('open')
}

function changePasswordAction() {
    if(!$('#changePasswordModalForm').parsley('validate')) {
        return;
    }

    var password = $("#changePassInput").val()
    if (!isPasswordComplexEnough(password)) {
       return;
    }
    var existingUserName = $("input[name='existingUserName']").val();
    var data = {operation:"changepassword", username:existingUserName, password:password}
    opcall(data)
}

function changePasswordActionResult(data) {
    if (data == 'success') {
        $('#changePasswordModal').dialog('close');
        $.growl.notice({message: "Password Updated Successfully. "});
    }
}

function deleteUserAction() {
    var username = $("#e_username").val()

    var data = {operation:"deleteuser", username:username}
    opcall(data)
}

function fillUsersAction() {
    var data = {operation:"userlist"}
    opcall(data)
}

function saveuser(data) {
    if (data == 'success')
    {
        fillUsersAction()
        $.growl.notice({message: "Users Updated Successfully. "});
    }
}

function deleteuser(data) {
    if (data == 'success') {
        fillUsersAction()
        loadNewUserAction()
        $.growl.notice({message: "User Deleted Successfully."});
    }
}

function editUser(usr) {
    var data = {user:usr, operation:"loaduser"}
    opcall(data)
}

function loadNewUserAction() {
    $("#editUser").hide();
    $("#newUserRegistration").show();

    $("#n_username").val("")
    $("#n_username").attr("readonly", false)
    $("#n_password").val("")
    $("#n_password_retype").val("")
    $("#userAccordionHeader").html("Add New User")
    $(".roleChecked").attr("checked", "checked")
    $("#n_admin").attr("checked", false)

}

function loaduser(data) {
    $("#newUserRegistration").hide();
    $("input[name='existingUserName']").val(data.username)
    $("#editUser").show();
    $("#e_username").val(data.username)
    $("#e_username").attr("readonly", "readonly")

    $("#userAccordionHeader").html("Update User")

    // clear out other roles' checked first
    var editRolesTable = $("#e_roles");
    editRolesTable.find(".editRoleRadio").prop('checked', false)

    // it's always a single role, name is misleading
    // it can be empty string if the user is an admin
    var userRole = data.roles;
    if (userRole.length > 0) {
        editRolesTable.find("input[name=userRole][value='" + userRole + "']").prop('checked', true)
    }

    $("#e_admin")[0].checked = data.admin == 1;
}


function userlist(olist) {
    var userListDiv = $("#userListDiv")
    userListDiv.empty()
    var str = "<ul style='list-style: none;margin:0'>"
    for (var i = 0; i < olist.length; i++) {
        str += "<li><a href='#' class='itemLink' onclick='editUser(\"" + olist[i].label + "\" )'><i class='icon-user'></i> " + olist[i].label + "</a></li>"
    }
    str += "<li><i class='icon-plus'></i><a href='#' class='itemLink' onclick='loadNewUserAction()'> Add New User</a></li>"

    str += "</ul>"
    userListDiv.append(str)
}