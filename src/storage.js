define(['domReady','json'], function(domReady, JSON){
    var w             = window,
    DB_NAME           = 'xlkk_storage_lite',
    DB_DISPLAYNAME    = 'XLKK StorageLite data',
    DB_MAXSIZE        = 1048576,
    DB_VERSION        = '1.0',

    MODE_NOOP         = 0,
    MODE_HTML5        = 1,
    MODE_GECKO        = 2,
    MODE_DB           = 3,
    MODE_USERDATA     = 4,

    USERDATA_PATH     = 'xlkk_storage_lite',
    USERDATA_NAME     = 'data',

    // -- Private Variables --------------------------------------------------------
    data = {},
    storageDriver,
    storageMode,

    isIE = navigator.appName.indexOf("Microsoft") !== -1;

    Object.extend = function(destination, source) {
        for (var property in source) {
            destination[property] = source[property]; 
        }
        return destination; 
    }

    // Determine the best available storage mode.
    try {
        if (w.localStorage) {
            storageMode = MODE_HTML5;
        } else if (w.globalStorage) {
            storageMode = MODE_GECKO;
        } else if (w.openDatabase && navigator.userAgent.indexOf('Chrome') === -1) {
            storageMode = MODE_DB;
        } else if (isIE) {
            storageMode = MODE_USERDATA;
        } else {
            storageMode = MODE_NOOP;
        }
    } catch (ex) {
        storageMode = MODE_NOOP;
    }   
    
    var StorageLite = {        
        clear: function () {},
        
        getItem: function (key, json) { return null; },
        
        length: function () { return 0; },
        
        removeItem: function (key) {},
        
        setItem: function (key, value) {}
    }

    if (storageMode === MODE_HTML5 || storageMode === MODE_GECKO) {

        // Common methods shared by the HTML5 and Gecko implementations.
        Object.extend(StorageLite, {
            length: function () {
                return storageDriver.length;
            },

            removeItem: function (key) {
                storageDriver.removeItem(key);
            },

            setItem: function (key, value, json) {
                storageDriver.setItem(key, json ? JSON.stringify(value) : value);
            }
        });

        if (storageMode === MODE_HTML5) {

            // HTML5 localStorage methods. Currently supported by IE8, Firefox 3.5+,
            // Safari 4+, Chrome 4+, and Opera 10.5+.
            storageDriver = w.localStorage;

            // Mobile Safari in iOS 5 loses track of storageDriver when page is
            // restored from the bfcache. This fixes the reference.
            /*
            Y.Node.DOM_EVENTS.pageshow = 1;

            Y.on('pageshow', function () {
                storageDriver = w.localStorage;
            });
            */
            Object.extend(StorageLite, {
                clear: function () {
                    storageDriver.clear();
                },

                getItem: function (key, json) {
                    try {
                        return json ? JSON.parse(storageDriver.getItem(key)) :
                                storageDriver.getItem(key);
                    } catch (ex) {
                        return null;
                    }
                }
            });

        } else if (storageMode === MODE_GECKO) {
            // Gecko globalStorage methods. Supported by Firefox 2 and 3.0.
            storageDriver = w.globalStorage[w.location.hostname];
            Object.extend(StorageLite, {
                clear: function () {
                    for (var key in storageDriver) {
                        if (storageDriver.hasOwnProperty(key)) {
                            storageDriver.removeItem(key);
                            delete storageDriver[key];
                        }
                    }
                },
                getItem: function (key, json) {
                    try {
                        return json ? JSON.parse(storageDriver[key].value) :
                                storageDriver[key].value;
                    } catch (ex) {
                        return null;
                    }
                }
            });
        }
    } else if (storageMode === MODE_DB || storageMode === MODE_USERDATA) {
        // Common methods shared by the database and userdata implementations.
        Object.extend(StorageLite, {
            clear: function () {
                data = {};
                StorageLite._save();
            },

            getItem: function (key, json) {
                return data.hasOwnProperty(key) ? data[key] : null;
            },

            length: function () {
                var count = 0, key;

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        count += 1;
                    }
                }

                return count;
            },

            removeItem: function (key) {
                delete data[key];
                StorageLite._save();
            },

            setItem: function (key, value, json) {
                data[key] = value;
                StorageLite._save();
            }

        });

        if (storageMode === MODE_DB) {

            // Database storage methods. Supported by Safari 3.1 and 3.2.
            storageDriver = w.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAYNAME, DB_MAXSIZE);

            Object.extend(StorageLite, {
                _save: function () {
                    storageDriver.transaction(function (t) {
                        t.executeSql("REPLACE INTO " + DB_NAME + " (name, value) VALUES ('data', ?)", [JSON.stringify(data)]);
                    });
                }
            });

            storageDriver.transaction(function (t) {
                t.executeSql("CREATE TABLE IF NOT EXISTS " + DB_NAME + "(name TEXT PRIMARY KEY, value TEXT NOT NULL)");
                t.executeSql("SELECT value FROM " + DB_NAME + " WHERE name = 'data'", [], function (t, results) {
                    if (results.rows.length) {
                        try {
                            data = JSON.parse(results.rows.item(0).value);
                        } catch (ex) {
                            data = {};
                        }
                    }
                });
            });

        } else if (storageMode === MODE_USERDATA) {

            // userData storage methods. Supported by IE5, 6, and 7.
            storageDriver = document.createElement('span');
            storageDriver.addBehavior('#default#userData');

            Object.extend(StorageLite, {
                _save: function () {
                    var _data = JSON.stringify(data);

                    try {
                        storageDriver.setAttribute(USERDATA_NAME, _data);
                        storageDriver.save(USERDATA_PATH);
                    } catch (ex) {
                        throw new Y.StorageFullError();
                    }
                }
            });

            domReady(function () {
                document.body.appendChild(storageDriver);
                storageDriver.load(USERDATA_PATH);

                try {
                    data = JSON.parse(storageDriver.getAttribute(USERDATA_NAME) || '{}');
                } catch (ex) {
                    data = {};
                }
            });

        }

    } 
    return StorageLite;
});

