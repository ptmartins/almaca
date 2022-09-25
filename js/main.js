(function() {

    let DOM = {},
        publicationsData = null,
        publications = null,
        career = null,
        isSearching = false,

        /**
         * Cached DOM elements
         */
        cacheDOM = () => {
            DOM.publications = document.querySelector('.publications');
            DOM.career = document.querySelector('.career');
            DOM.scrollTop = document.querySelector('.scrollTop');
            DOM.search = document.getElementById('search');
            DOM.pubTotal = document.querySelector('.total__number');
        },

        /**
         * UI objects
         */
        UI = {
            pub: (item, index) => {
                let pub = document.createElement('DIV'),
                    author = document.createElement('SPAN'),
                    year = document.createElement('SPAN'),
                    title = document.createElement('SPAN'),
                    source = document.createElement('SPAN'),
                    locale = document.createElement('SPAN');

                pub.className = 'publication';
                author.className = 'publication__author';
                source.className = 'publication__source';

                author.textContent = item.author;
                year.textContent = item.year;
                title.textContent = item.title;
                source.textContent = item.pub;
                locale.textContent = item.locale;

                pub.append(author, ', ', year, '. ', title, ' ' ,  source, ', ', locale);

                return pub;
            }
        },

        /**
         * Get Data from JSON
         */
        getData = () => {
            fetch('publications.json').then(response => response.json()).then(data => {
                publicationsData = data;
                renderPublications(publicationsData);
            });

            fetch('career.json').then(response => response.json()).then(data => {
                career = data;
                renderCareer(career);
            });
        },

        /**
         * Render career
         */
        renderCareer = (data) => {
            data.forEach((item, i) => {
                let career = document.createElement('DIV'),
                    years = document.createElement('DIV'),
                    content = document.createElement('DIV'),
                    role =  document.createElement('P'),
                    institution = document.createElement('P');

                career.className = 'career__item';
                years.className = 'career__years';
                content.className = 'career__content';
                role.className = 'career__role';
                institution.className = 'career__institution';

                years.textContent = item.years;
                role.textContent = item.role;
                institution.textContent = item.institution;

                content.append(role, institution);

                career.append(years, content);
                career.setAttribute('data-aos', 'fade-up');
                career.setAttribute('data-aos-duration', '1000');
                career.setAttribute('data-aos-delay', `${i * 100}`);

                DOM.career.append(career);
            });
        },

        /**
         * Count number of publications
         */
        countPublications = () => {

            let total = 0,
                filtered = 0;

            for(let i = 0; i < publications.length; i++) {
                if(publications[i].classList.contains('filtered')) {
                    filtered++;     
                }
                total++;
            }

            filtered > 0 ? total = filtered : isSearching ? total = 0 : total = publications.length;

            DOM.pubTotal.textContent = total;
        },
    
        /**
         * Render publications
         */
        renderPublications = (data) => {
            data.forEach((pub, i) => {
                DOM.publications.append(UI.pub(pub, i));
            });

            publications = document.querySelectorAll('.publication');
            countPublications();
        },

        /**
         * Search publications
         */
        searchPubs = val => {
	        let filterValue = val;

            val !== '' ? isSearching = true : isSearching = false;

            if(filterValue.charAt(0) != '-') {
                for(pub of publications) {
                    let pubText = pub.textContent.toLowerCase();

                    if(pubText.indexOf(filterValue) > -1) {
                        pub.style.display = 'block';
                        pub.style.opacity = '1';
                        pub.classList.add('filtered');
                    } else {
                        pub.style.display = 'none'; 
                        pub.style.opacity = '0'; 
                        pub.classList.remove('filtered');
                    }
                }
            } else if(filterValue.charAt(0) == '-' && filterValue.charAt(1) != '') {
                for(pub of publications) {
                    let pubText = pub.textContent.toUpperCase(),
                        filter = filterValue.substr(1);

                    if(pubText.indexOf(filter) > -1) {
                        pub.style.display = 'none';
                        pub.classList.remove('filtered');
                    } else {
                        pub.style.display = 'block';
                        pub.classList.add('filtered');
                    }
                }
            }

            countPublications();
        },

        /**
         * Bind event listeners
         */
        bindEvents = () => {
            document.addEventListener('scroll', () => {
                if (window.scrollY > 600) {
                    DOM.scrollTop.classList.add('active');
                } else {
                    DOM.scrollTop.classList.remove('active');
                }
            });

            DOM.search.addEventListener('keyup', ev => {
                searchPubs(ev.target.value.toLowerCase());
            });
        },

        /**
         * Kick things off
         */
        init = () => {
            cacheDOM();
            bindEvents();
            getData();
            AOS.init({
                // Global settings:
                disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
                startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
                initClassName: 'aos-init', // class applied after initialization
                animatedClassName: 'aos-animate', // class applied on animation
                useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
                disableMutationObserver: false, // disables automatic mutations' detections (advanced)
                debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
                throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
                              
                // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
                offset: 120, // offset (in px) from the original trigger point
                delay: 0, // values from 0 to 3000, with step 50ms
                duration: 400, // values from 0 to 3000, with step 50ms
                easing: 'ease', // default easing for AOS animations
                once: false, // whether animation should happen only once - while scrolling down
                mirror: false, // whether elements should animate out while scrolling past them
                anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
              });
        };  

    window.addEventListener('DOMContentLoaded', init);

})();