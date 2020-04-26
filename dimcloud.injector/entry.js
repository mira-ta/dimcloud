/* Licensed under GPL-3.0-only or GPL-3.0-or-later */


import {
    inject
} from "./injector";


window.addEventListener("load", (ev) => inject(document.head));
