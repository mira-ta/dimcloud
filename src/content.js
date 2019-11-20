(() => {
    const link = {
        id: 'dimcloud--extension__css-link',
        selector: `link#dimcloud--extension__css-link`,

        create() {
            let link = document.createElement('link');

            link.id = this.id;
            link.rel = 'stylesheet'; 
            link.type = 'text/css';
            link.href = (chrome != undefined ? chrome : browser).extension.getURL('dimcloud.css');
            link.media = 'all';

            return link;
        },

        put() {
            return document.head.appendChild(this.create());
        },

        not_exists() {
            return document.querySelector(this.selector) == null;
        }
    };


    window.addEventListener('load', () => {
        if (link.not_exists())
            link.put();
    });
})();
