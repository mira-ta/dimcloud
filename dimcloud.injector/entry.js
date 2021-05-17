/* Licensed under GPL-3.0-only or GPL-3.0-or-later */
import { Builder, Injector } from "./injector";

window.addEventListener("load", () => {
    new Injector(
        new Builder().href("./main.css").build()
    ).inject(document.head);
});