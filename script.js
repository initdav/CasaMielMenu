const searchInput = document.querySelector('#menu-search');
const sections = [...document.querySelectorAll('.menu-section')];
const pills = [...document.querySelectorAll('.category-pill')];
const emptyState = document.querySelector('.empty-state');
const backToTop = document.querySelector('.back-to-top');
const menuTools = document.querySelector('.menu-tools');
const categoryPicker = document.querySelector('.category-picker');
const categoryNav = document.querySelector('.category-nav');
const categoryArrowLeft = document.querySelector('.category-arrow--left');
const categoryArrowRight = document.querySelector('.category-arrow--right');

const titleConnectors = /\b(y|e|o|u|ni|de|del|al|con|sin|para|por|te)\s+/gi;

document.querySelectorAll('h1, h2, h3, h4').forEach((title) => {
  title.textContent = title.textContent.replace(titleConnectors, '$1\u00a0');
});

const normalize = (value) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

function filterMenu() {
  const term = normalize(searchInput.value);
  let matches = 0;

  sections.forEach((section) => {
    const items = [...section.querySelectorAll('.menu-item')];
    let sectionMatches = 0;

    items.forEach((item) => {
      const isMatch = !term || normalize(item.textContent).includes(term);
      item.hidden = !isMatch;
      if (isMatch) sectionMatches += 1;
    });

    section.hidden = sectionMatches === 0;
    matches += sectionMatches;
  });

  emptyState.hidden = matches > 0;
  if (!term) updateActiveCategory();
}

searchInput.addEventListener('input', filterMenu);

categoryNav.addEventListener('click', (event) => {
  const pill = event.target.closest('.category-pill');
  if (!pill) return;

  if (searchInput.value) {
    searchInput.value = '';
    filterMenu();
  }

  setActiveCategory(pill);
});

function updateCategoryArrows() {
  const hasOverflow = categoryNav.scrollWidth > categoryNav.clientWidth + 1;
  const maxScrollLeft = categoryNav.scrollWidth - categoryNav.clientWidth;
  const canScrollLeft = hasOverflow && categoryNav.scrollLeft > 1;
  const canScrollRight = hasOverflow && categoryNav.scrollLeft < maxScrollLeft - 1;

  categoryPicker.classList.toggle('can-scroll-left', canScrollLeft);
  categoryPicker.classList.toggle('can-scroll-right', canScrollRight);
  categoryArrowLeft.hidden = !canScrollLeft;
  categoryArrowRight.hidden = !canScrollRight;
}

function scrollCategories(direction) {
  categoryNav.scrollBy({
    left: direction * categoryNav.clientWidth * .72,
  });
}

categoryArrowLeft.addEventListener('click', () => scrollCategories(-1));
categoryArrowRight.addEventListener('click', () => scrollCategories(1));
categoryNav.addEventListener('scroll', updateCategoryArrows, { passive: true });

const categoryResizeObserver = new ResizeObserver(updateCategoryArrows);
categoryResizeObserver.observe(categoryNav);
pills.forEach((pill) => categoryResizeObserver.observe(pill));

function setActiveCategory(activePill) {
  pills.forEach((pill) => {
    const isActive = pill === activePill;
    pill.classList.toggle('active', isActive);
    if (isActive) pill.setAttribute('aria-current', 'location');
    else pill.removeAttribute('aria-current');
  });
}

function updateActiveCategory() {
  if (normalize(searchInput.value)) return;

  const marker = window.scrollY + menuTools.offsetHeight + 24;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  setActiveCategory(pills.find((pill) => pill.hash === `#${activeSection.id}`));
}

let scrollUpdateQueued = false;

window.addEventListener('scroll', () => {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;

  requestAnimationFrame(() => {
    updateActiveCategory();
    backToTop.hidden = window.scrollY <= window.innerHeight;
    scrollUpdateQueued = false;
  });
}, { passive: true });

window.addEventListener('pageshow', (event) => {
  filterMenu();
  updateCategoryArrows();
  backToTop.hidden = window.scrollY <= window.innerHeight;

  if (!event.persisted) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        document.querySelector(':target')?.scrollIntoView({ behavior: 'instant' });
      });
    });
  }
});
