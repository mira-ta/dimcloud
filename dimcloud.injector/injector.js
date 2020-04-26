/* Licensed under GPL-3.0-only or GPL-3.0-or-later */


/**
 * Try to get current dimcloud id.
 *
 * @param {HTMLHeadElement} base - Base document to search on.
 * 
 * @returns {id: string, found: bool} - dimcloud link id and is it found in current document or not.
 */
export function getCurrentId(base) {
    if (!window.dimcloud_CURRENT_ID)
        return {
            id: null,
            found: false
        }

    return {
        id: window.dimcloud_CURRENT_ID,
        found: !!base.querySelector(`#dimcloud_${window.dimcloud_CURRENT_ID}`)
    };
}


/**
 * 
 * @param {string} id - Current running id.
 */
export function setCurrentId(id) {
    window.dimcloud_CURRENT_ID = id;
}


/**
 * Check what browser is it running at the moment.
 * 
 * @todo Put more conditions and browser types.
 * 
 * @returns {"chrome" | "other"} - Type of browser.
 */
export function checkBrowser() {
    if (window.chrome != undefined && (window.chrome.webstore != undefined || window.chrome.runtime != undefined))
        return "chrome";

    return "other";
}


/**
 * Create `link` node with specified attributes conveying about css file.
 * Appending this link to `head` element will add css file to current DOM.
 *
 * @param {HTMLHeadElement} onto - Document base.
 * 
 * @returns {link: Node, id: string} - CSS Link with generated id.
 */
export function createLink() {
    let link = document.createElement("link");

    let id = Math.random().toString(16); 

    link.id = `dimcloud_${id}`;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = getLink();
    link.media = "all";
    link.crossOrigin = "anonymous";

    return {
        link,
        id
    };
}


/**
 * Get current href to css file despite it being on server or locally in extension folder.
 * 
 * @returns {string} - Href to CSS file.
 */
export function getLink() {
    // TODO: Allow loading from server?
    // Why? I don't give a f*ck.
    //if (window.dimcloud_USE_SERVER === true && window.dimcloud_SERVER_HREF != undefined) // server href must not be zero length string
    //    // or anything which is false by js terms
    //    return window.dimcloud_SERVER_HREF;

    let acquirer = undefined;

    switch (checkBrowser()) {
        case "chrome":
            acquirer = chrome.extension.getURL;
            break;

        case "other":
        default:
            acquirer = browser.runtime.getURL;
            break;
    }

    return acquirer("main.css");
}


/**
 * Validates whether given link corresponds current path.
 * @param {string} link - Link to CSS file.
 * 
 * @returns {bool} - Is link the same as current?
 */
export function validateLink(link) {
    return link === getLink();
}


/**
 * Inject CSS file to given document.
 * @param {HTMLHeadElement} onto - Head element where to put link to css file.
 */
export function inject(onto) {
    if (onto === undefined ||
        onto === null)
        throw new Error("No head element is given thus unavailable to put any CSS link to.");
    
    if (getCurrentId(onto).found)
        return;

    for (let child of onto.children) {
        if (child.tagName == "link")
            if (validateLink(child.getAttribute("href")))
                return;
    }

    let {link, id} = createLink();

    onto.appendChild(link);

    setCurrentId(id);

    // return the link to make callee has the link item.
    return link;
}
