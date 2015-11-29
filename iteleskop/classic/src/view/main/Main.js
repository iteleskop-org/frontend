/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('iTeleskop.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'iTeleskop.view.main.MainController',
        'iTeleskop.view.main.MainModel',
        'iTeleskop.view.main.List'
    ],

    controller: 'main',
    viewModel: 'main',

    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}',
                html: "<img src='logo.png' title='iteleskop'/>"
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    defaults: {
        bodyPadding: 20,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },

    items: [{
        title: 'Moje zadania',
        iconCls: 'fa-user',
        // The following grid shares a store with the classic version's grid as well!
        bind: {
            html: 'Work in progress'
        }
    }, {
        title: 'Dodaj zadanie',
        iconCls: 'fa-plus-circle',
        bind: {
            html: '{loremIpsum}'
        }
    }, {
        title: 'Podgląd kolejki',
        iconCls: 'fa-users',
        items: [{
            xtype: 'tasks'
        }]
    }, {
        title: 'Status teleskopu',
        iconCls: 'fa-cog',
        bind: {
            html: 'Status teleskopu: Nie kupiony ;)'
        }
    },
/* Zakomentowane, bo view users z jakiegos powodu nie dziala.
   w app/stoare/Users.js jest wyraznie podane proxy: directFn: 'QueryUsers.getResults',
   a jednak wolane jest QueryDatabase zamiast QueryResults.

    {
        title: 'Użytkownicy',
        iconCls: 'fa-users',
        items: [{
            xtype: 'users'
        }]
    }, */
    {
        title: 'Zdjęcia',
        iconCls: 'fa-camera',
        bind: {
            html: '{loremIpsum}'
        }
    }]
});
