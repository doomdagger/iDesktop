/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',

        'Ext.ux.desktop.ShortcutModel',

        'MyDesktop.SystemStatus',
        'MyDesktop.VideoWindow',
        'MyDesktop.GridWindow',
        'MyDesktop.TabWindow',
        'MyDesktop.AccordionWindow',
        'MyDesktop.Notepad',
        'MyDesktop.BogusMenuModule',
        'MyDesktop.BogusModule',

        //my ext
        'MyDesktop.view.SysSettingView',
//      'MyDesktop.Blockalanche',
        'MyDesktop.Settings'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...
    	var me = this;
        me.callParent();
    	
        // now ready...
        setTimeout(function(){
        	//console.log(new Date());
        	myDesktopApp.desktop.initShortcut();
        },250);
    },

    getModules : function(){
        return [
            new MyDesktop.VideoWindow(),
            //new MyDesktop.Blockalanche(),
            new MyDesktop.SystemStatus(),
            new MyDesktop.GridWindow(),
            new MyDesktop.TabWindow(),
            new MyDesktop.AccordionWindow(),
            new MyDesktop.Notepad(),
            new MyDesktop.BogusMenuModule(),
            new MyDesktop.BogusModule(),
            
            //my ext
            new MyDesktop.view.SysSettingView()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: '桌面背景', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: '表格窗口', iconCls: 'grid-shortcut', module: 'grid-win' },
                    { name: '联系人', iconCls: 'accordion-shortcut', module: 'acc-win' },
                    { name: '笔记本', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: '笔记本1', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: '笔记本2', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: '笔记本3', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: '笔记本4', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: '系统状态', iconCls: 'cpu-shortcut', module: 'systemstatus'},
                    { name: '系统管理', iconCls: 'grid-shortcut', module: 'sys-setting'}
                ]
            }),

            wallpaper: 'wallpapers/london.jpg',
            wallpaperStretch: true
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'设置',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'登出',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: '联系人', iconCls: 'accordion', module: 'acc-win' },
                { name: '表格窗口', iconCls: 'icon-grid', module: 'grid-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('退出登录', '您确定要退出系统吗?');
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
