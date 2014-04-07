/**
 * Created by lihe on 2014/4/6.
 */

Ext.define('Ext.ux.desktop.LeftBar',{
    extend : 'Ext.toolbar.Toolbar',

    alias : 'widget.leftbar',
    vertical :true,
    height   : 700,
    margin  : '5 0 0 0',
    items: [
        {
            text: 'Example Button'
        }
    ]
});