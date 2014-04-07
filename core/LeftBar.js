/**
 * Created by lihe on 2014/4/7.
 */

Ext.define("Ext.ux.desktop.LeftBar", {
    extend: 'Ext.dom.Layer',

    app: null,

    shortcuts: null,

    shortcutTpl: [
        '<div class="appButton" title="{name}" style="display: block;">',
            '<div style="" class="appButton_appIcon {iconCls}">',
                '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
            '</div>',
        '</div>'
    ],

    createDataView: function(){
        var me = this;

        var startDom = [
            '<div id="leftBar" style="width: 73px; height: 100%;">',
                '<div id="dockContainer" class="dock_container dock_pos_left" style="z-index: 10;">',
                    '<div class="dock_middle">'
        ];
        var endDom = [
                    '</div>',
                '</div>',
            '</div>'
        ];

        var ret = '';

        //compose tpl
        Ext.each(me.shortcuts, function(shortcut, index){

        });
    },

    constructor: function(config, existingEl){
        var me = this;
        config = config || {};
        if(config.app) me.app = config.app;
        if(config.shortcuts) me.shortcuts = config.shortcuts;

        me.callParent(config,me.createDataView());
    }

});
