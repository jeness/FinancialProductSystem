function Tab(id, label, type, icon) {
    this._id = id;
    this._label = label;
    this._type = type;
    this._icon = icon;
};

Tab.prototype.getId = function(){
    return this._id;
}
Tab.prototype.getLabel = function(){
    return this._label;
}
Tab.prototype.getType = function(){
    return this._type;
}
Tab.prototype.getIcon = function(){
    return this._icon;
}

function Tabs(){
    this._tabs = [];
    this._currentTab = null;
}

Tabs.prototype.newTab = function(label,type,icon)
{
    var id = 1;
    if(this._tabs.length > 0)
        id = this._tabs[this._tabs.length-1].getId() + 1
    var oldTab = this.getTabByLabelAndType(label,type)
    if(oldTab != null)
    {
        this.showTab(oldTab.getId())
        return;
    }
    var tab = new Tab(id,label,type,icon)
    this._tabs.push(tab)
    $('#contentTabs li.active').removeClass("active")
    if(type == "home")
        $('#contentTabs').append('<li class="active"><a href="#"><i class="' + tab.getIcon() + '"></i><span>' + tab.getLabel() + ' &nbsp;</span></a>  </li>');
    else
        $('#contentTabs').append('<li class="active"><a href="#"><i class="' + tab.getIcon() + '"></i><button class="close" data-dismiss="alert" onclick="tabs.closeTab(\'' + tab.getId() + '\')">&times;</button> <span>' + tab.getLabel() + ' &nbsp;</span></a>  </li>');
    $('#contentTabs li.active > a').click(function () {
        tabs.showTab(tab.getId())
    })
    this.showTab(tab.getId())

}
Tabs.prototype.showTab = function(id)
{
    var tab = this.getTabById(id)
    this._currentTab = tab
    console.log(tab);
    $('.tab-pane.active').removeClass("active")

    $('#contentTabs li:eq(' + this.getIndex(id) + ') a').tab("show");
    activeView = tab.getType();
    activeObject = tab.getLabel();


    $('#' + tab.getType()).addClass('active');
    eval(tab.getType()+"Init()")
    console.log(tabs)



}
Tabs.prototype.closeTab = function(id)
{
    var tab = this.getTabById(id)
//    if(tab === this._currentTab)
//    {
//        this.nextTab();
//    }
    $('#contentTabs li:eq(' + this.getIndex(id) + ')').remove();
    var nextId = this.nextTab(tab)
    if( nextId != tab.getType())
    {
        $('#' + tab.getType()).removeClass('active');
    }


}
Tabs.prototype.nextTab = function(tab)
{
    if(tab == this._currentTab)
    {
        var index = this.getIndex(tab.getId())
        if(index == this._tabs.length -1)
        {
            this.showTab(this._tabs[index-1].getId())
            this._tabs.splice(index,1);
            return this._tabs[index-1].getType()
        }
        else
        {
            this._tabs.splice(index,1);
            this.showTab(this._tabs[index].getId())
            return this._tabs[index].getType()

        }

    }
    else
    {
        return this._tabs.splice(this.getIndex(tab.getId()),1)[0].getType();
    }

//    for (var i = 0; i < this._tabs.length; i++) {
//        if (this._tabs[i].getId() == id) {
//            var next = i + 1;
//            if (next === this._tabs.length)
//                next = next -2;
//            this.showTab(this._tabs[next].getId());
//            return;
//        }
//    }

}

Tabs.prototype.getTabById = function(id) {
    for (var i = 0; i < this._tabs.length; i++) {
        if (this._tabs[i].getId() == parseInt(id))
            return this._tabs[i];
    }
    return null;
};
Tabs.prototype.closeAll = function()
{
    this._tabs = [];
    this._currentTab = null;
    $('#contentTabs li').remove();
}


Tabs.prototype.getTabByLabel = function(label) {
    for (var i = 0; i < this._tabs.length; i++) {
        if (this._tabs[i].getLabel() == label)
            return this._tabs[i];
    }
    return null;
};
Tabs.prototype.getTabByLabelAndType = function(label,type) {
    for (var i = 0; i < this._tabs.length; i++) {
        if (this._tabs[i].getLabel() == label && this._tabs[i].getType() == type)
            return this._tabs[i];
    }
    return null;
};
Tabs.prototype.getIndex = function(id) {
    for (var i = 0; i < this._tabs.length; i++) {
        if (this._tabs[i].getId() == parseInt(id))
            return i;
    }
    return null;
};
Tabs.prototype.getCurrentTab = function() {
    return this._currentTab;
};

