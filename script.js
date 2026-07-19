const searchInput = document.querySelector('#menu-search');
const searchWrap = document.querySelector('.search-wrap');
const clearSearch = document.querySelector('.clear-search');
const sections = [...document.querySelectorAll('.menu-section')];
const pills = [...document.querySelectorAll('.category-pill')];
const emptyState = document.querySelector('.empty-state');
const backToTop = document.querySelector('.back-to-top');
const menuTools = document.querySelector('.menu-tools');
const categoryPicker = document.querySelector('.category-picker');
const categoryNav = document.querySelector('.category-nav');
const categoryArrowLeft = document.querySelector('.category-arrow--left');
const categoryArrowRight = document.querySelector('.category-arrow--right');

if ('scrollRestoration' in history) {
  history.scrollRestoration = window.location.hash ? 'manual' : 'auto';
}

function alignHashTarget() {
  if (!window.location.hash) return;

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(targetId);
  if (!target) return;

  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  target.scrollIntoView();

  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
}

const normalize = (value) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function filterMenu() {
  const term = normalize(searchInput.value);
  let matches = 0;

  sections.forEach((section) => {
    const items = [...section.querySelectorAll('.menu-item')];
    let sectionMatches = 0;

    items.forEach((item) => {
      const isMatch = !term || normalize(item.textContent).includes(term);
      item.classList.toggle('hidden', !isMatch);
      if (isMatch) sectionMatches += 1;
    });

    section.classList.toggle('hidden', sectionMatches === 0);
    matches += sectionMatches;
  });

  searchWrap.classList.toggle('has-value', searchInput.value.length > 0);
  emptyState.classList.toggle('visible', matches === 0);
}

searchInput.addEventListener('input', filterMenu);
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  filterMenu();
  updateActiveCategory();
  searchInput.focus();
});

pills.forEach((pill) => {
  pill.addEventListener('click', () => {
    pills.forEach((item) => item.classList.remove('active'));
    pill.classList.add('active');
  });
});

function updateCategoryArrows() {
  const gap = parseFloat(getComputedStyle(categoryNav).columnGap) || 0;
  const contentWidth = pills.reduce((width, pill) => width + pill.offsetWidth, 0) + gap * (pills.length - 1);
  const hasOverflow = contentWidth > categoryNav.clientWidth + 1;

  categoryPicker.classList.toggle('has-overflow', hasOverflow);

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
    behavior: 'smooth',
  });
}

categoryArrowLeft.addEventListener('click', () => scrollCategories(-1));
categoryArrowRight.addEventListener('click', () => scrollCategories(1));
categoryNav.addEventListener('scroll', updateCategoryArrows, { passive: true });
window.addEventListener('resize', updateCategoryArrows);

function updateActiveCategory() {
  if (searchInput.value) return;

  const marker = window.scrollY + menuTools.offsetHeight + 24;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  pills.forEach((pill) => {
    pill.classList.toggle('active', pill.hash === `#${activeSection.id}`);
  });
}

let scrollUpdateQueued = false;

window.addEventListener('scroll', () => {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;

  requestAnimationFrame(() => {
    updateActiveCategory();
    backToTop.classList.toggle('visible', window.scrollY > window.innerHeight);
    scrollUpdateQueued = false;
  });
}, { passive: true });

window.addEventListener('pageshow', () => {
  alignHashTarget();
  updateActiveCategory();
  updateCategoryArrows();
});
