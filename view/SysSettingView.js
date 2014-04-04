/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.view.SysSettingView', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
         'Ext.grid.*',
         'Ext.data.*',
         'Ext.util.*',
         'Ext.state.*',
         'Ext.form.*',
		 'MyDesktop.model.SysSettingModel',
         'MyDesktop.store.SysSettingStore'
    ],

    id:'sys-setting',

    init : function(){
        this.launcher = {
            text: '系统管理',
            iconCls:'icon-grid'
        };
    },

    createWindow : function(){		
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('sys-setting');
        if(!win){
        				
			var store = Ext.create('MyDesktop.store.SysSettingStore');
			
        	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        		clicksToEdit: 2,
                clicksToMoveEditor: 1,
                autoCancel: false
            });

            // create the grid and specify what field you want
            // to use for the editor at each column.
            var grid = Ext.create('Ext.grid.Panel', {
            	border: false,
                store: store,
                columns: [{
                    header: 'ID',
                    dataIndex: 'propId',
                    flex: 1
                }, {
                    header: '系统参数关键字',
                    dataIndex: 'propKey',
                    flex: 1,
                    editor: {
                        // defaults to textfield if no xtype is supplied
                        allowBlank: false
                    }
                }, {
                    header: '系统参数值',
                    dataIndex: 'propValue',
                    flex: 1,
                    editor: {
                        // defaults to textfield if no xtype is supplied
                        allowBlank: false
                    }
                }, {
                    header: '描述',
                    dataIndex: 'remark',
                    flex: 1,
                    editor: {
                        // defaults to textfield if no xtype is supplied
                        allowBlank: false
                    }
                }, {
                	xtype: 'numbercolumn',
                    header: '创建人',
					format: '0',
                    dataIndex: 'createperson',
                    flex: 1,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,
                        maxValue: 150000
                    }
                }, {
                	xtype: 'datecolumn',
                    header: '创建时间',
                    dataIndex: 'createtime',
                    flex: 1,
                    format: 'Y-m-d',
                    editor: {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'y-m-d',
                        maxValue: Ext.Date.format(new Date(), 'y-m-d')
                    }
                }, {
                    xtype: 'numbercolumn',
                    header: '修改人',
					format: '0',
                    dataIndex: 'editperson',
                    flex: 1,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0,
                        maxValue: 150000
                    }
                }, {
                    xtype: 'datecolumn',
                    header: '修改时间',
                    dataIndex: 'edittime',
                    flex: 1,
                    format: 'Y-m-d',
                    editor: {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'y-m-d',
                        maxValue: Ext.Date.format(new Date(), 'y-m-d')
                    }
                }],
                tbar: [{
                    text: '添加参数',
                    iconCls: 'add',
                    handler : function() {
                        rowEditing.cancelEdit();

                        var id = store.last().get('propId')+1;
                        
                        // Create a model instance
                        var data = Ext.create('MyDesktop.model.SysSettingModel', {
                            propId : id,
							propKey : '输入关键字',
							propValue : '输入参数值',
							remark : '输入描述',
							createperson : 0,
							createtime : Ext.Date.clearTime(new Date()),
							editperson : 0,
							edittime : Ext.Date.clearTime(new Date())
                        });
                        Ext.Ajax.request({
                    	    url: '/ecommerce/webservice/sys_setting/add',
                    	    params: {
                    	    	propId:data.get('propId'),
                    	        propKey:data.get('propKey'),
                    	        propValue:data.get('propValue'),
                    	        remark:data.get('remark'),
                    	        createperson:data.get('createperson'),
                    	        createtime:Ext.Date.format(data.get('createtime'), 'Y-m-d H:i:s'),
                    	        editperson:data.get('editperson'),
                    	        edittime:Ext.Date.format(data.get('createtime'), 'Y-m-d H:i:s')
                    	    },
                    	    success: function(response){
                    	    	store.insert(store.count(),data);
                                rowEditing.startEdit(store.count()-1, 0);
                    	    }
                    	});
                    }
                }, {
                    itemId: 'removeSysSetting',
                    text: '删除参数',
                    iconCls: 'remove',
                    handler: function() {
                        var sm = grid.getSelectionModel();
                        var data = sm.getSelection()[0].data;
                        rowEditing.cancelEdit();
                        Ext.Ajax.request({
                    	    url: '/ecommerce/webservice/sys_setting/remove',
                    	    params: {
                    	        propId:data.propId
                    	    },
                    	    success: function(response){
                    	        var text = response.responseText;
                    	        console.log(text);
                    	        store.remove(sm.getSelection());
                                if (store.getCount() > 0) {
                                    sm.select(0);
                                }
                    	    }
                    	});
                        
                    },
                    disabled: true
                }],
                plugins: [rowEditing],
                listeners: {
                    'selectionchange': function(view, records) {
                        grid.down('#removeSysSetting').setDisabled(!records.length);
                    },
                    'edit': function(editor, context) {
                    	context.record.commit();
                    	var data = context.record.data;
                    	Ext.Ajax.request({
                    	    url: '/ecommerce/webservice/sys_setting/update',
                    	    params: {
                    	        propId:data.propId,
                    	        propKey:data.propKey,
                    	        propValue:data.propValue,
                    	        remark:data.remark,
                    	        createperson:data.createperson,
                    	        createtime:Ext.Date.format(data.createtime, 'Y-m-d H:i:s'),
                    	        editperson:data.editperson,
                    	        edittime:Ext.Date.format(data.createtime, 'Y-m-d H:i:s')
                    	    },
                    	    success: function(response){
                    	        var text = response.responseText;
                    	        console.log(text);
                    	    }
                    	});
                    },
                    'canceledit': function(editor, context, eOpts){
                		console.log("cancel edit!");
                	}
                }
            });
        				
            win = desktop.createWindow({
                id: 'sys-setting',
                title:'系统管理',
                width:1020,
                height:520,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [grid]
            });
        }
        return win;
    }

    
});

