/**
* Template Name: Dewi
* Template URL: https://bootstrapmade.com/dewi-free-multi-purpose-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const mobileNavIcon = mobileNavToggleBtn ? mobileNavToggleBtn.querySelector('i') : null;

  function mobileNavToogle(forceClose = false) {
    if (!mobileNavToggleBtn) return;
    const isOpen = document.body.classList.contains('mobile-nav-active');
    const shouldOpen = forceClose ? false : !isOpen;
    document.body.classList.toggle('mobile-nav-active', shouldOpen);
    if (mobileNavIcon) {
      mobileNavIcon.classList.toggle('bi-list', !shouldOpen);
      mobileNavIcon.classList.toggle('bi-x', shouldOpen);
    }
    mobileNavToggleBtn.setAttribute('aria-expanded', String(shouldOpen));
    mobileNavToggleBtn.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', () => mobileNavToogle());
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) mobileNavToogle(true);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1200 && document.body.classList.contains('mobile-nav-active')) mobileNavToogle(true);
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * About menu shortcuts: activate the matching About tab before navigating to it.
   */
  document.querySelectorAll('#navmenu a[data-about-tab]').forEach(link => {
    link.addEventListener('click', function() {
      const tabButton = document.getElementById(this.dataset.aboutTab);
      if (tabButton && window.bootstrap && bootstrap.Tab) {
        bootstrap.Tab.getOrCreateInstance(tabButton).show();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  window.glightbox = GLightbox({
    selector: '.glightbox',
    loop: true,
    touchNavigation: true,
    keyboardNavigation: true
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
    const projectsPerBatch = 12;
    let visibleProjectCount = projectsPerBatch;
    let initIsotope;
    const grid = isotopeItem.querySelector('.isotope-container');
    const moreButton = isotopeItem.querySelector('#portfolio-more-toggle');
    const filters = Array.from(isotopeItem.querySelectorAll('.isotope-filters li'));

    if (!grid) return;

    const getCategoryProjects = function() {
      const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active')?.getAttribute('data-filter') || '*';
      return Array.from(grid.querySelectorAll('.isotope-item')).filter(function(element) {
        return activeFilter === '*' || element.matches(activeFilter);
      });
    };

    const matchesCurrentView = function(element) {
      const categoryProjects = getCategoryProjects();
      const index = categoryProjects.indexOf(element);
      return index !== -1 && index < visibleProjectCount;
    };

    const updateMoreButton = function() {
      if (!moreButton) return;
      const total = getCategoryProjects().length;
      const remaining = Math.max(0, total - visibleProjectCount);
      moreButton.hidden = remaining === 0;
      moreButton.textContent = remaining > 0
        ? 'Load More Projects (' + remaining + ' remaining)'
        : 'All Projects Shown';
      moreButton.setAttribute('aria-expanded', String(remaining === 0));
    };

    const arrangeProjects = function() {
      if (initIsotope) initIsotope.arrange({ filter: matchesCurrentView });
      updateMoreButton();
      if (typeof aosInit === 'function') aosInit();
    };

    filters.forEach(function(filter) {
      filter.setAttribute('role', 'button');
      filter.setAttribute('tabindex', '0');
      filter.setAttribute('aria-pressed', String(filter.classList.contains('filter-active')));

      const activateFilter = function() {
        filters.forEach(function(item) {
          const active = item === filter;
          item.classList.toggle('filter-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        visibleProjectCount = projectsPerBatch;
        arrangeProjects();
      };

      filter.addEventListener('click', activateFilter, false);
      filter.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activateFilter();
        }
      });
    });

    imagesLoaded(grid, function() {
      initIsotope = new Isotope(grid, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: matchesCurrentView,
        sortBy: sort
      });
      updateMoreButton();
    });

    if (moreButton) {
      moreButton.addEventListener('click', function() {
        visibleProjectCount += projectsPerBatch;
        arrangeProjects();
      });
    }
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();