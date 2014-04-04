Ext.define('MyDesktop.store.SysSettingStore', {
	extend : 'Ext.data.Store',
	autoDestroy: true,
	model : 'MyDesktop.model.SysSettingModel',
	proxy : {
		type : 'ajax',
		url : '/ecommerce/webservice/sys_setting/fetch',
		reader : {
			type : 'json',
			root : 'data'
		}
	},
	sorters: [{
        property: 'propId',
        direction: 'ASC'
    }],
	autoLoad : true
});