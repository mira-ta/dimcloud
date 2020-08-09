/* Licensed under GPL-3.0-only or GPL-3.0-or-later */


export class Builder {
    constructor() {
        this._cross_origin = "anonymous";
        this._type = "text/css";
        this._href = "";
    }

    cross_origin(value) {
        this._cross_origin = value;
        
        return this;
    }

    type(value) {
        if (/css$/.match(value))
            this._type = value;
        else
            throw "Not a CSS mime type. Not supported yet and won't be.";

        return this;
    }

    href(value) {
        if (/\.css$/.match(value))
            this._href = this._get_url(value);
        else
            throw "Not a CSS file. Not supported yet and won't be.";

        return this;
    }

    build() {
        let element = document.createElement("link");

        element.rel = "stylesheet";
        element.media = "all";

        element.crossOrigin = this._cross_origin;
        element.type = this._type;
        element.href = this._href;

        return element;
    }

    _get_browser() {
        if (window.chrome != undefined && (window.chrome.webstore != undefined || window.chrome.runtime != undefined))
            return "chrome";

        return "other";
    }

    _get_url(href) {
        return (this._get_browser == "chrome" ? chrome.extension.getURL : browser.runtime.getURL)(href);
    }
}


export class Injector {
    constructor(element) {
        this._element = element;
    }

    inject(object) {
        if (this._element.parentElement)
            object.appendChild(this._element);
    }
}

