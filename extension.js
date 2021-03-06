const Clutter = imports.gi.Clutter;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Soup = imports.gi.Soup;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Utils = Me.imports.utils;
const MantisUa = Me.imports.mantisUa.MantisUa;
const Tickets = Me.imports.mantisUa.Tickets;
const Settings = Me.imports.utils;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

const MANTIS_URL_KEY = 'url';
const MANTIS_USERNAME_KEY = 'username';
const MANTIS_PASSWORD_KEY = 'password';
const HANDLER_KEY = 'handler';

function sprintNumber(initialDate, date, length) {
    let initialTimestamp = initialDate.getTime() / 1000;
    let dateTimestamp = date.getTime() / 1000;
    return Math.ceil((dateTimestamp - initialTimestamp) / 60 / 60 / 24 / length );
}

/**
 * Calculates the current sprint number
 * 
 * @param {Date} date initial sprint date
 * @param {number} length number of days of a sprint
 */
function currentSprint(date, length) {
    return sprintNumber(date, new Date(), length);
}

const SprintMenuItem = new Lang.Class({
    Name: 'SprintMenuItem.SprintMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function (story) {
        this.parent();
        this.story = story;

        this._label = new St.Label({
            text: 'M' + story.id + ' ' + story.summary + (story.handler ? ' (' + story.handler  + ')' : ''),
        });

        this.actor.add_child(this._label);
    },

    destroy: function () {
        this.parent();
    },

    activate: function (event) {
        Clipboard.set_text(CLIPBOARD_TYPE, 'git clone -m "M' + this.story.id + ' ' + this.story.summary + '"');
        this.parent(event);
    },
});

const SprintMenu = new Lang.Class({
    Name: 'SprintMenu.SprintMenu',
    Extends: PanelMenu.Button,

    _init: function (tickets) {
        this.tickets = tickets;

        let sprintNumber = currentSprint(new Date("2009-04-20"), 14);
        this.parent(0.0, sprintNumber + "");

        let hbox = new St.BoxLayout({ style_class: 'panel-status-sprint-box' });
        let label = new St.Label({ text: sprintNumber + "",
                                   y_expand: true,
                                   y_align: Clutter.ActorAlign.CENTER });

        hbox.add_child(label);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_actor(hbox);

        this._refresh();
    },

    _loadData: function () {
        let settings = Settings.getSettings();
        // let handler = settings.get_string(HANDLER_KEY);
        let handler = 'gbo'
        let sprintNumber = currentSprint(new Date("2009-04-20"), 14);
        this.tickets.list(sprintNumber, handler, Lang.bind(this, function (stories) {
            stories.map(Lang.bind(this, function (story) {
                this.menu.removeAll();
                this.menu.addMenuItem(new SprintMenuItem(story));
            }))
        }))
    },

    _refresh: function () {
        this._loadData();
        this._removeTimeout();
        this._timeout = Mainloop.timeout_add_seconds(10, Lang.bind(this, this._refresh));
        return true;
    },

    _removeTimeout: function () {
        if (this._timeout) {
          Mainloop.source_remove(this._timeout);
          this._timeout = null;
        }
    },

    destroy: function () {
        this._removeTimeout();
        this.menu.removeAll();
        this.parent();
    }

});


let sprintMenu;

function init() {
}

function enable() {
    let settings = Settings.getSettings();
    let mantisUrl = settings.get_string(MANTIS_URL_KEY) || 'http://localhost:8080/mantis/';
    let username = settings.get_string(MANTIS_USERNAME_KEY) || 'administrator';
    let password = settings.get_string(MANTIS_PASSWORD_KEY) || '0Rx5Co01hz55f01SeAKRDrqlS3QJjvU5';
    let mantisUa = new MantisUa(mantisUrl, {
        username: username,
        password: password,
    });
    let tickets = new Tickets(mantisUa);
    let sprintMenu = new SprintMenu(tickets);
    Main.panel.addToStatusArea('sprint-menu', sprintMenu);
}

function disable() {
    sprintMenu.destroy();
}
