// Ta klasa definuje nowy panel odpowiedzialny za dodawanie nowych zadan.

/// @todo: Wyciagac te dane po stronie serwera z MySQL, z tabeli telescopes
var AddTaskScopes = Ext.create('Ext.data.Store', {
    fields: [ 'scope_id', 'text'],
    data: [
        { 'scope_id': 1, 'text': '1: CDK 12.5" (Nerpio)' },
        { 'scope_id': 2, 'text': '2: simulator' }
    ]
});

var AddTaskBinning = Ext.create('Ext.data.Store', {
    fields: [ 'binning', 'text'],
    data: [
        { 'binning': 1, 'text': '1x1' },
        { 'binning': 2, 'text': '2x2' },
        { 'binning': 3, 'text': '3x3' },
        { 'binning': 4, 'text': '4x4' }
    ]
});

var Exposures = Ext.create('Ext.data.Store', {
    fields: [ 'time' ],
    data: [
        { 'time': 5 },
        { 'time': 10 },
        { 'time': 20 },
        { 'time': 40 },
        { 'time': 75 },
        { 'time': 150 },
        { 'time': 300 },
        { 'time': 600 },
        { 'time': 1200 },
        { 'time': 1800 }
    ]
});

/// @todo: Wyciagac te dane po stronie serwera z MySQL, z tabeli filters
var AddTaskFilters = Ext.create('Ext.data.Store', {
    fields: ['filter' , 'text'],
    data: [
        { 'filter': 'CV',     'text': 'L (luminance)' },
        { 'filter': 'TR',   'text': 'R (red)' },
        { 'filter': 'TG', 'text': 'G (green)' },
        { 'filter': 'TB',  'text': 'B (blue)' },
        { 'filter': 'HA',    'text': 'H-alpha' },
        { 'filter': 'V',     'text': 'V (fotometric)' },
        { 'filter': 'B',     'text': 'B (fotometric)' },
        { 'filter': 'R',     'text': 'R (fotometric)' },
        { 'filter': 'none',  'text': 'no filter' }
    ]
});

var InitialState = Ext.create('Ext.data.Store', {
    fields: ['state', 'text'],
    data: [
        { 'state': 0, 'text': 'Template (0)' },
        { 'state': 1, 'text': 'New (1)' }
    ]
});

Ext.define('iTeleskop.view.main.AddTask', {
    extend: 'Ext.form.Panel',
    title: 'Add new task',
    xtype: 'addtask',

    // Eskperyment z przewijaniem (autoScroll + height w pixelach wlacza scroll
    // pionowy)
    autoScroll: true,
    height: 900,

    url: 'php/classes/AddTask.php',

    layout: {
        type: 'vbox',
        align: 'left',
        padding: 10,
        autoScroll: true,
        overflowX: 'scroll',
        overflowY: 'scroll'
    },

    defaultType: 'textfield',
    items: [
        {
            // To pole jest ustawianie w metodzie beforerender
            name: 'user_id',
            xtype: 'textfield',
            fieldLabel:'User ID',
            readOnly: true,
            labelWidth: 300
        },
        {
            // Wybor obiektu, jedno wielkie @todo trzeba te dane wyciagac z jakiejs bazy
            // danych, moze z simbada? Na razie wpisywane z reki
            fieldLabel: 'Target Name',
            name: 'object',
            labelWidth: 300,
            width: 900,
            allowBlank: false,
            validator: function(val) {
                if (val === "") {
                    return "Can't be empty";
                }

                if (val.length > 68) {
                    return "Too long (".concat(val.length,", max allowed length is 68)");
                }
                return true;
            }
        },

        // Right ascension starts here
        {
            xtype: 'container',
            layout: 'hbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            padding: "0 0 10 0", // top right bottom left
            items: [
                {
                    // Right ascension in floating point format.
                    xtype: 'textfield',
                    fieldLabel: 'Right ascension (0... 23.99999)',
                    name: 'ra',
                    value: '0.0',
                    labelWidth: 300,
                    allowBlank: false,
                    validator: function(val) {
                        if (val === "") {
                            return "Can't be empty";
                        }
                        if (isNaN(val)) {
                            return "Must be a number.";
                        }
                        if (val < 0) {
                            return "Must be equal or greater than 0";
                        }

                        if (val >= 24) {
                            return "Must be lesser than 24.";
                        }
                        return true;
                    }
                },
                {
                    xtype: 'button',
                    text: 'a.b => h:m:s',
                    scope: this,
                    handler: function(x) {
                        var ra_field = x.up().up().getForm().findField('ra');
                        var h_field = x.up().up().getForm().findField('ra_h');
                        var m_field = x.up().up().getForm().findField('ra_m');
                        var s_field = x.up().up().getForm().findField('ra_s');

                        var ra = ra_field.getValue();
                        var h = Math.floor(ra); // hours
                        var tmp = ra - (h);
                        var m = Math.floor(tmp*60);
                        tmp = tmp - (m/60);
                        var s = Math.floor(tmp * 3600);
                        h_field.setValue(h);
                        m_field.setValue(m);
                        s_field.setValue(s);
                    }
                },
                {
                    xtype: 'button',
                    text: 'a.b <= h:m:s',
                    handler: function(x) {
                        var ra_field = x.up().up().getForm().findField('ra');
                        var h_field = x.up().up().getForm().findField('ra_h');
                        var m_field = x.up().up().getForm().findField('ra_m');
                        var s_field = x.up().up().getForm().findField('ra_s');

                        var ra = RAhmsToFloat(h_field.getValue(), m_field.getValue(),
                                              s_field.getValue());
                        ra_field.setValue(ra);
                    }
                },
                {
                    // Right ascension (hour value: 0...23.999999)
                    xtype: 'textfield',
                    fieldLabel: 'h',
                    labelAlign: 'right',
                    value: '0',
                    name: 'ra_h',
                    labelWidth: 30,
                    width: 100,
                    allowBlank: false
                },
                {
                    // Right ascension (minute value: 0...59)
                    xtype: 'textfield',
                    fieldLabel: 'm',
                    labelAlign: 'right',
                    value: '0',
                    name: 'ra_m',
                    labelWidth: 30,
                    width: 100,
                    allowBlank: false
                },
                {
                    // Right ascension (seconds value: 0.0...59.99)
                    xtype: 'textfield',
                    fieldLabel: 's',
                    labelAlign: 'right',
                    value: '0.0',
                    name: 'ra_s',
                    labelWidth: 30,
                    width: 100,
                    allowBlank: false
                }
            ]
        },
        // End of right ascension declaration

        // Declination starts here
        {
            xtype: 'container',
            layout: 'hbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            padding: "0 0 10 0", // top right bottom left
            items: [
                {
                    // Wybor deklinacji, @todo wyciagac max. limity z tabeli telescopes,
                    // na razie na sztywno od -20 do +90 dla CDK12.5" w Nerpio.
                    xtype: 'textfield',
                    fieldLabel: 'Declination (-17.0 to 90.0)',
                    name: 'decl',
                    value: '0.0',
                    labelWidth: 300,
                    allowBlank: false,
                    validator: function(val) {
                        if (val === "") {
                            return "Can't be empty";
                        }
                        if (isNaN(val)) {
                            return "Must be a number.";
                        }
                        if (val < -17) {
                            return "Must be equal or greater than -17";
                        }

                        if (val > 90) {
                            return "Must be lesser than or equal 90.";
                        }
                        return true;
                    }
                },
                {
                    xtype: 'button',
                    text: 'a.b => deg:m:s',
                    scope: this,
                    handler: function(x) {
                        var dec_field = x.up().up().getForm().findField('decl');
                        var d_field = x.up().up().getForm().findField('decl_deg');
                        var m_field = x.up().up().getForm().findField('decl_m');
                        var s_field = x.up().up().getForm().findField('decl_s');

                        var dec = dec_field.getValue();
                        var negative = false;
                        if (dec < 0) {
                            negative = true;
                            dec = -dec;
                        }

                        var deg = Math.floor(dec);
                        var tmp = (dec - deg)*60;
                        var m = Math.floor(tmp);
                        tmp = (tmp - m)*600;
                        var s = Math.round(tmp)/10;

                        if (negative) {
                            deg = -deg;
                        }

                        d_field.setValue(deg);
                        m_field.setValue(m);
                        s_field.setValue(s);
                    }
                },
                {
                    xtype: 'button',
                    text: 'a.b <= deg:m:s',
                    handler: function(x) {
                        var decl_field = x.up().up().getForm().findField('decl');
                        var d_field = x.up().up().getForm().findField('decl_deg');
                        var m_field = x.up().up().getForm().findField('decl_m');
                        var s_field = x.up().up().getForm().findField('decl_s');

                        var decl = DeclinationDMSToFloat(d_field.getValue(),
                                                         m_field.getValue(),
                                                         s_field.getValue());
                        decl_field.setValue(decl);
                    }
                },
                {
                    // Right ascension (hour value: 0...23)
                    xtype: 'textfield',
                    fieldLabel: 'deg',
                    labelAlign: 'right',
                    value: '0',
                    name: 'decl_deg',
                    labelWidth: 30,
                    width: 100,
                    allowBlank: false
                },
                {
                    // Right ascension (minute value: 0...59)
                    xtype: 'textfield',
                    fieldLabel: 'm',
                    labelAlign: 'right',
                    value: '0',
                    name: 'decl_m',
                    labelWidth: 30,
                    width: 100,
                    allowBlank: false
                },
                {
                    // Right ascension (seconds value: 0.0...59.99)
                    xtype: 'textfield',
                    fieldLabel: 's',
                    labelAlign: 'right',
                    value: '0.0',
                    name: 'decl_s',
                    labelWidth: 30,
                    width: 100,
                    allowBlank: false
                }
            ]
        },
        // Declination ends here

        {
            fieldLabel: 'Exposure [s]',
            name: 'exposure',
            value: '10',
            labelWidth: 300,
            allowNegative: false,
            allowBlank: false,
            xtype: 'combobox',
            queryMode: 'local',
            displayField: 'time',
            valueField: 'time',
            store: Exposures,
            editable: true,

            // Ta walidacja jakos nie chce dzialac
            validator: function(val) {
                if (val === "") {
                    return "Can't be empty.";
                }
                if (isNaN(val)) {
                    return "Is not a number.";
                }

                if (val < 0) {
                    return "Can't be negative.";
                }

                return true;
            }
        },

        {
            fieldLabel: 'Initial state',
            name: 'state',
            value: '1',
            xtype: 'combobox',
            valueField: 'state',
            displayField: 'text',
            queryMode: 'local',
            store: InitialState,
            labelWidth: 300
        },
        {
            // Wybor teleskopu: @todo: wyciagac te dane z tabeli telescopes
            fieldLabel: 'Teleskop',
            name: 'scope_id',
            value: "1",
            xtype: 'combobox',
            valueField: 'scope_id',
            displayField: 'text',
            queryMode: 'local',
            store: AddTaskScopes,
            labelWidth: 300
        },
        {
            fieldLabel: 'Description',
            labelWidth: 300,
            name: 'descr',
            width: 900,
            validator: function(val) {
                if (val.length > 68) {
                    return "Too long (".concat(val.length,", max allowed length is 68)");
                }
                return true;
            }
        },
        {
            fieldLabel: 'Comment',
            name: 'comment',
            labelWidth: 300,
            value: 'n/a',
            width: 900,
            validator: function(val) {
                if (val.length > 68) {
                    return "Too long (".concat(val.length,", max allowed length is 68)");
                }
                return true;
            }
        },
        {
            fieldLabel: 'Filter',
            name: 'filter',
            editable: false,
            value: 'none',
            xtype: 'combobox',
            valueField: 'filter',
            displayField: 'text',
            queryMode: 'local',
            store: AddTaskFilters,
            labelWidth: 300
        },
        {
            fieldLabel: 'Binning',
            xtype: 'combobox',
            name: 'binning',
            store: AddTaskBinning,
            queryMode: 'local',
            valueField: 'binning',
            displayField: 'text',
            labelWidth: 300,
            value: '1'
        },
        {
            fieldLabel: 'Guiding',
            xtype: 'checkbox',
            name: 'guiding',
            labelWidth: 300,
            checked: true
        },
        {
            fieldLabel: 'Auto Center',
            xtype: 'checkbox',
            name: 'auto_center',
            labelWidth: 300,
            checked: false
        },
        {
            fieldLabel: 'Dither',
            xtype: 'checkbox',
            name: 'dither',
            labelWidth: 300,
            checked: false
        },
        {
            fieldLabel: 'Defocus',
            xtype: 'checkbox',
            name: 'defocus',
            labelWidth: 300,
            checked: false
        },
        {
            fieldLabel: 'Automatic image calibration',
            xtype: 'checkbox',
            checked: true,
            labelWidth: 300,
            name: 'calibrate'
        },
        {
            fieldLabel: 'Plate Solve with PinPoint',
            xtype: 'checkbox',
            checked: true,
            labelWidth: 300,
            name: 'solve'
        },
        {
            fieldLabel: 'Send image to AAVSO',
            xtype: 'checkbox',
            checked: false,
            labelWidth: 300,
            name: 'vphot'
        },
        {
            fieldLabel: 'Extra commands',
            labelWidth: 300,
            name: 'other_cmd'
        },
        {
            xtype: 'displayfield',
            fieldLabel: "Don't observe if...",
            labelWidth: 300

        },
        {
            fieldLabel: '... target altitude is lesser than [] degrees above horizon (0...90)',
            name: 'min_alt',
            value: '5',
            labelWidth: 300,
            value: 0,
            validator: function(val) {
                if (val === "") {
                    return "Can't be empty";
                }
                if (isNaN(val)) {
                    return "Must be a number.";
                }
                if (val < 0) {
                    return "Must be equal or greater than 0";
                }

                if (val > 90) {
                    return "Must be lesser than or equal 90.";
                }
                return true;
            }
        },
        {
            fieldLabel: '... Sun altitude is greater than [ ] degrees below horizon',
            labelWidth: 300,
            name: 'max_sun_alt',
            value: '-18'
        },
        {
            fieldLabel: '... target to Moon distance is lesser than [ ] degrees',
            labelWidth: 300,
            name: 'moon_distance',
            value: '0'
        },
        {
            fieldLabel: '... Moon phase is greater than [ ] per cent',
            labelWidth: 300,
            name: 'max_moon_phase',
            value: '100'
        },
        {
            fieldLabel: '... time passed from previous exposure of this target is less than [] seconds',
            labelWidth: 300,
            name: 'min_interval',
            value: '0'
        },

        {
            fieldLabel: 'Do not observe before (y-m-d):',
            labelWidth: 300,
            //xtype: 'datetimefield',
            //format: 'Y-m-d H:i',
            xtype: 'datefield',
            format: 'Y-m-d',
            name: 'skip_before',
            value: new Date()
        },
        {
            fieldLabel: 'Do not observe after (y-m-d)',
            labelWidth: 300,
            xtype: 'datefield',
            format: 'Y-m-d',
            name: 'skip_after'
        }
    ], // koniec items, czyli obiektow znadujacych sie w tej formie
    buttons: [
        {
            text: 'Add task',
            handler: function() {
                var form = this.up('form'); // get the form panel
                if (form.isValid()) { // make sure the form contains valid data before submitting
                    form.submit({
                        success: function(form, action) {
                            Ext.Msg.alert('Success', action.result.msg);
                            Ext.getStore('tasks').load();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('Failure', action.result.msg);
                        }
                    });
                } else { // display error alert if the data is invalid
                    Ext.Msg.alert('Data incorrect',
                                  'Please check correctness of the fields marked in red.')
                }
            }
        },
        {
            text: "Check correctness",
            handler: function() {
                var form = this.up('form'); // get the form panel
                if (form.isValid()) { // make sure the form contains valid data before submitting
                    Ext.Msg.alert('Success', "Data seems valid, but validation is still simple.");
                } else { // display error alert if the data is invalid
                    Ext.Msg.alert('Failure', 'Fix the fields marked with red rectangles.');
                }
            }
        },
        {
            text: "Reset to defaults",
            handler: function() {
                this.up('form').reset();
                this.up().up().setDefaultFields();
            }
        }
    ],

    // This function sets the default values.
    setDefaultFields: function() {

        var user_id = Ext.getStore('user').getAt(0).data.user_id;
        this.getForm().findField('user_id').setValue(user_id);

        // Get the current date
        var d = new Date();
        this.getForm().findField('skip_before').setValue(d);
        d.setDate(d.getDate() + 14); // Move it by 14 days
        this.getForm().findField('skip_after').setValue(d);

        this.getForm().isValid();
    },

    listeners: {

        // Ta funkcja jest zawolana zaraz przed wyrenderowaniem formularza.
        // Wyciagamy dane z magazynu 'user' i ustawiamy pole formularza
        // user_id.
        beforerender: function(component, eOpts) {
            component.setDefaultFields();
        }
    }
});
