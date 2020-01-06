var dimcloud_ = (() => {
    const css = {
        use_local: () => browser.extension.getURL('dimcloud.css')
        //use_github: () => 'https://raw.githubusercontent.com/mira-ta/dimcloud/master/dist/dimcloud.css'
    };

    return {
        /** @param {'local' | 'github'} type */
        build(type) {
            let link = (() => {
                let link = document.createElement('link');

                link.id = Math.random().toString(16);
                link.rel = 'stylesheet'; 
                link.type = 'text/css';
                link.href = css[`use_${type}`]();
                link.media = 'all';
                link.crossOrigin = 'anonymous';
                
                return link;
            })();

            document.head.append(link);
        }
    };
})();

dimcloud_.build('local');
