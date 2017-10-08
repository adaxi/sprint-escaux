const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Lang = imports.lang;
const Soup = imports.gi.Soup;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Utils = Me.imports.utils;
const MantisUa = Me.imports.mantisUa.MantisUa;
const Tickets = Me.imports.mantisUa.Tickets;

const Gtk = imports.gi.Gtk;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

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

    _init: function (info) {
        this.parent();
        this._info = info;

        this._label = new St.Label({
            text: info.name,
        });

        this.actor.add_child(this._label);
    },

    destroy: function () {
        this.parent();
    },

    activate: function (event) {
        Gtk.show_uri(null, 'https://google.com/', global.get_current_time());
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


        var menu = this.menu;

        this.tickets.request(sprintNumber, 'gbo', Lang.bind(this, function (stories) {
            menu.addMenuItem(new SprintMenuItem({ name : stories.length }));
        }))
        
        menu.addMenuItem(new SprintMenuItem({ name : "10000" }));
        httpSession.queue_message(request, function(httpSession, message) {
            if (message.status_code !== 200) {
                return;
            }
            var storiesJSON = request.response_body.data;
            var stories = JSON.parse(storiesJSON);
            for (let story of stories) {
                menu.addMenuItem(new SprintMenuItem({ name : story.id }));
                menu.addMenuItem(new SprintMenuItem({ name : story.id }));
            }
        });
    },

    destroy: function () {
        this.parent();
    }

});


let sprintMenu;

function init() {
}

function enable() {
    let mantisUa = new MantisUa('http://localhost:8080/mantis/', {
        username: '',
        password: '',
    });
    let tickets = new Tickets(mantisUa);
    let sprintMenu = new SprintMenu(tickets);
    Main.panel.addToStatusArea('sprint-menu', sprintMenu);
}

function disable() {
    sprintMenu.destroy();
}
