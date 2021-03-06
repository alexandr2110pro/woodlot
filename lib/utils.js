// Woodlot utility library

'use strict';

var constants           =   require('./constants');
var stdoutFormatting    =   require('./stdoutFormatting');

module.exports = {
    // Function to get log format based on woodlot config
    getLogFormat: function(config) {
        if (config.format && config.format.type) {
            return config.format.type.toLowerCase();
        }
        return 'json';
    },
    // Function to get JSON format spacing value 
    getFormatSpacing: function(config) {
        var format = this.getLogFormat(config);

        // Get format spacing only for JSON type
        if (format === 'json') {
            if (config.format && config.format.options && ('spacing' in config.format.options)) {
                var spacing = parseInt(config.format.options.spacing, 10);

                if (isNaN(spacing)) {
                    return config.format.options.spacing;
                }

                return spacing;
            }
            return constants.DEFAULT_JSON_SPACING;
        }
        return null;
    },
    // Function that stringifies a log based on its format
    stringifyLog: function(log, format, spacing) {
        spacing = spacing || constants.DEFAULT_JSON_SPACING;

        switch (format.toLowerCase()) {
            case 'combined':
            case 'common':

                return log;

            case 'json':
            default:

                return JSON.stringify(log, null, spacing);
        }
    },
    // Function to pad single digits with preceding 0
    padSingleDigit: function(num) {
        var str = String(num)

        return (str.length === 1 ? '0' : '') + str;
    },
    // Function to generate apache CLF timestamp
    generateCLFTimestamp: function(timeStamp) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            date = new Date(timeStamp);

        return this.padSingleDigit(date.getUTCDate()) + '/' + months[date.getUTCMonth()] + '/' + date.getUTCFullYear() + ':' + this.padSingleDigit(date.getUTCHours()) + ':' + this.padSingleDigit(date.getUTCMinutes()) + ':' + this.padSingleDigit(date.getUTCSeconds()) + ' +0000';
    },
    // Function to get format separator value
    getFormatSeparator: function(config) {
        return (config.format && config.format.options && 'separator' in config.format.options) ? config.format.options.separator : constants.DEFAULT_SEPARATOR;
    },
    // Function to check request/response params 
    checkParam: function(param) {
        return param ? param : null;
    },
    // Function to log config warning to stdout
    logConfigWarning: function() {
        var logHead = stdoutFormatting.foregroundYellow('woodlot[warning]: '),
            url = stdoutFormatting.underlineText('https://github.com/adpushup/woodlot');

        process.stdout.write(logHead + 'Please provide at least one valid file stream to start logging. More info here - ' + url + '\n');
        return;
    }
};
