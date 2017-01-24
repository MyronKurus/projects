/*
 * DT core UI scripts
*/

var UI = function () {

    //

    this.init();

};

UI.prototype = {};

UI.prototype.init = function () {

	this.settingsMenu = new UI.SettingsMenu();
    this.leftMenu = new UI.LeftMenu();
    this.viewer = new UI.Viewer();

};
