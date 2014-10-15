var tests = [];
var APP_SPEC_REG_EXP = /^\/base\/app\/scripts\/(.*)\.js$/;

for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/[sS]pec\.js$/.test(file)) {
            var matches = APP_SPEC_REG_EXP.exec(file);
            if (matches && matches.length === 2) {
                tests.push(matches[1]);
            } else {
                tests.push(file);
            }
        }
    }
}
var paths = {superdesk: 'bower_components/superdesk/app/'};
// we have to put here files tested without requirejs
tests.push(paths.superdesk + 'scripts/superdesk/menu/menu');
tests.push(paths.superdesk + 'scripts/superdesk/menu/notifications/notifications');
tests.push(paths.superdesk + 'scripts/superdesk-authoring/widgets/widgets');
tests.push(paths.superdesk + 'scripts/superdesk-authoring/comments/comments');
tests.push(paths.superdesk + 'scripts/superdesk-workspace/content/content');
tests.push('bower_components/ment.io/dist/mentio');

requirejs.config({
    baseUrl: '/base/app/scripts',
    deps: ['angular-mocks', 'gettext'],

    callback: function() {
        'use strict';
        require(tests, window.__karma__.start);
    },

    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        bootstrap: 'bower_components/bootstrap/js',
        angular: 'bower_components/angular/angular',
        moment: 'bower_components/momentjs/moment',
        lodash: 'bower_components/lodash/dist/lodash',
        d3: 'bower_components/d3/d3',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
        'angular-gettext': 'bower_components/angular-gettext/dist/angular-gettext',
        'moment-timezone': 'bower_components/moment-timezone/moment-timezone',

        'superdesk': paths.superdesk + 'app/scripts/superdesk',
        'superdesk-settings': paths.superdesk + 'app/scripts/superdesk-settings',
        'superdesk-dashboard': paths.superdesk + 'scripts/superdesk-dashboard',
        'superdesk-users': paths.superdesk + 'scripts/superdesk-users',
        'superdesk-scratchpad': paths.superdesk + 'scripts/superdesk-scratchpad'
    },

    shim: {
        jquery: {
            exports: 'jQuery'
        },

        angular: {
            exports: 'angular',
            deps: ['jquery']
        },

        'angular-resource': ['angular'],
        'angular-route': ['angular'],
        'angular-mocks': ['angular']
    }
});
