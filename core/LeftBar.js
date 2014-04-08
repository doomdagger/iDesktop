/**
 * Created by lihe on 2014/4/7.
 */

Ext.define("Ext.ux.desktop.LeftBar", {

    requires:[
        'Ext.XTemplate'
    ],

    app: null,

    /**
     * array, follow the field pattern of shortcut model
     */
    shortcuts: null,

    shortcutTpl: [
        '<tpl for=".">',
            '<div class="appButton" title="{name}" style="display: block;">',
                '<div style="" class="appButton_appIcon">',
                    '<img alt="{name}" src="http://0.web.qstatic.com/webqqpic/style/images/diskexplorer.png?20111011001" class="appButton_appIconImg">',
                '</div>',
            '</div>',
        '</tpl>'
    ],

    createDataView: function(){
        var me = this;

        var startDom = [
            '<div id="dockContainer" class="dock_container dock_pos_left" style="z-index: 10;">',
                '<div class="dock_middle">'
        ];
        var endDom = [
                '</div>',
            '</div>'
        ];

        //compose tpl
        var bodyTpl = Ext.create('Ext.XTemplate',me.shortcutTpl);
        return startDom.join('')+bodyTpl.apply(me.shortcuts)+endDom.join('');
    },

    view: null,

    constructor: function(config){
        var me = this;
        config = config || {};

        if(config.shortcuts) me.shortcuts = config.shortcuts;
        if(config.app) me.app = config.app;

        me.view = new Ext.dom.Layer({
            dh:  {tag: 'div', id:'leftbar', style: 'width: 73px; height: 100%;', cls:'x-layer-toolbar'}
        });

        me.view.createChild(me.createDataView());
    }

});
