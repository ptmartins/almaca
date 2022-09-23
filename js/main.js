(function() {

    let DOM = {},

        cacheDOM = () => {
            DOM.publications = document.querySelector('.publications');
        },

        UI = {
            pub: (item) => {
                let pub = document.createElement('DIV'),
                    author = document.createElement('SPAN'),
                    year = document.createElement('SPAN'),
                    title = document.createElement('SPAN'),
                    source = document.createElement('SPAN'),
                    locale = document.createElement('SPAN');

                author.textContent = item.author;
                year.textContent = item.year;
                title.textContent = item.title;
                source.textContent = item.pub;
                locale.textContent = item.locale;

                pub.append(author, ', ', year, '. ', title, source, ', ', locale);

                return pub;
            }
        },
    
        renderPublications = () => {

            let _data = null;
            fetch('data.json').then(response => response.json()).then(data => {
                _data = data;

                console.log(_data);
                _data.forEach(pub => {
                    DOM.publications.append(UI.pub(pub));
                });
            });
        },

        init = () => {
            cacheDOM();
            renderPublications();
        };  

    window.addEventListener('DOMContentLoaded', init);

})();