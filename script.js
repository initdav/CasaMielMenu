const searchInput = document.querySelector('#menu-search');
const emptyState = document.querySelector('.empty-state');
const backToTop = document.querySelector('.back-to-top');
const menuTools = document.querySelector('.menu-tools');
const menuSections = document.querySelector('.menu-sections');
const categoryPicker = document.querySelector('.category-picker');
const categoryNav = document.querySelector('.category-nav');
const categoryArrowLeft = document.querySelector('.category-arrow--left');
const categoryArrowRight = document.querySelector('.category-arrow--right');
const printMenu = document.querySelector('.print-menu');

const titleConnectors = /\b(y|e|o|u|ni|de|del|al|con|sin|para|por|te)\s+/gi;
const printPageCategoryIds = [
  [
    ['desayunos', 'frias-sin-cafe'],
    ['calientes-cafe', 'frias-cafe'],
  ],
  [
    ['filtrados', 'calientes-sin-cafe'],
    ['dulces', 'sodas'],
  ],
];

const keepConnectorsTogether = (value) =>
  value.replace(titleConnectors, '$1\u00a0');

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function createMenuItem(item) {
  const article = document.createElement('article');
  article.className = 'menu-item';
  article.searchEntries = [
    item.name,
    item.description,
    ...(item.keywords || []),
  ].filter(Boolean).map(normalize);

  const details = document.createElement('div');
  const name = document.createElement('h4');
  name.textContent = keepConnectorsTogether(item.name);
  details.append(name);

  if (item.description) {
    const description = document.createElement('p');
    description.textContent = item.description;
    details.append(description);
  }

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = item.price;
  article.append(details, price);

  return article;
}

function createMenuSection(category, { print = false } = {}) {
  const section = document.createElement('section');
  section.className = print ? 'print-menu-section' : 'menu-section';

  if (print) section.dataset.printCategory = category.id;
  else section.id = category.id;

  const heading = document.createElement('header');
  heading.className = 'section-heading';
  const title = document.createElement('h3');
  title.textContent = keepConnectorsTogether(category.name);
  heading.append(title);

  const items = document.createElement('div');
  items.className = 'items-grid';
  category.items.forEach((item) => items.append(createMenuItem(item)));

  section.append(heading, items);
  return section;
}

function createPrintHeader() {
  const header = document.createElement('header');
  header.className = 'print-page-header';
  const mark = document.createElement('img');
  mark.src = 'assets/house-mark.svg';
  mark.alt = '';
  const wordmark = document.createElement('div');
  wordmark.className = 'print-page-wordmark';
  wordmark.textContent = 'Casa\nMiel';
  header.append(mark, wordmark);
  return header;
}

function createPrintFooter() {
  const footer = document.createElement('footer');
  footer.className = 'print-page-footer';
  const mark = document.createElement('img');
  mark.src = 'assets/house-mark.svg';
  mark.alt = '';
  const message = document.createElement('p');
  message.textContent = 'Qué bueno tenerte en casa';
  footer.append(mark, message);
  return footer;
}

function renderPrintMenu(categories) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const fragment = document.createDocumentFragment();

  printPageCategoryIds.forEach((columnIds, pageIndex) => {
    const page = document.createElement('section');
    page.className = 'print-page';
    page.dataset.printPage = pageIndex + 1;

    const content = document.createElement('div');
    content.className = 'print-page-content';

    columnIds.forEach((categoryIds) => {
      const column = document.createElement('div');
      column.className = 'print-column';
      categoryIds.forEach((categoryId) => {
        const category = categoriesById.get(categoryId);
        if (category) column.append(createMenuSection(category, { print: true }));
      });
      content.append(column);
    });

    page.append(createPrintHeader(), content, createPrintFooter());
    fragment.append(page);
  });

  printMenu.replaceChildren(fragment);
}

function renderMenu(categories) {
  const navFragment = document.createDocumentFragment();
  const sectionsFragment = document.createDocumentFragment();

  categories.forEach((category, index) => {
    const pill = document.createElement('a');
    pill.className = `category-pill${index === 0 ? ' active' : ''}`;
    pill.href = `#${category.id}`;
    pill.textContent = category.name;
    if (index === 0) pill.setAttribute('aria-current', 'location');
    navFragment.append(pill);

    sectionsFragment.append(createMenuSection(category));
  });

  categoryNav.replaceChildren(navFragment);
  menuSections.replaceChildren(sectionsFragment);
  renderPrintMenu(categories);

  document.querySelectorAll('h1, h2').forEach((title) => {
    title.textContent = keepConnectorsTogether(title.textContent);
  });
}

function initializeMenuInteractions() {
  const sections = [...document.querySelectorAll('.menu-section')];
  const pills = [...document.querySelectorAll('.category-pill')];

  function focusActiveCategory(activePill) {
    const maxScrollLeft = categoryNav.scrollWidth - categoryNav.clientWidth;
    const centeredScrollLeft = activePill.offsetLeft -
      (categoryNav.clientWidth - activePill.offsetWidth) / 2;

    categoryNav.scrollTo({
      left: Math.max(0, Math.min(centeredScrollLeft, maxScrollLeft)),
    });
  }

  function setActiveCategory(activePill) {
    if (!activePill) return;

    const categoryChanged = !activePill.classList.contains('active');

    pills.forEach((pill) => {
      const isActive = pill === activePill;
      pill.classList.toggle('active', isActive);
      if (isActive) pill.setAttribute('aria-current', 'location');
      else pill.removeAttribute('aria-current');
    });

    if (categoryChanged) focusActiveCategory(activePill);
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

  function filterMenu() {
    const query = normalize(searchInput.value);
    const terms = query.split(' ').filter(Boolean);
    const allItems = sections.flatMap((section) =>
      [...section.querySelectorAll('.menu-item')]
    );
    const matchesPhrase = (item) =>
      item.searchEntries.some((entry) => ` ${entry} `.includes(` ${query} `));
    const preferPhraseMatches = terms.length > 1 && allItems.some(matchesPhrase);
    let matches = 0;

    sections.forEach((section) => {
      const items = [...section.querySelectorAll('.menu-item')];
      let sectionMatches = 0;

      items.forEach((item) => {
        const searchableWords = item.searchEntries.flatMap((entry) => entry.split(' '));
        const matchesEveryTerm = terms.every((term) =>
          searchableWords.some((word) => word === term ||
            (term.length >= 3 && word.startsWith(term)))
        );
        const isMatch = terms.length === 0 ||
          (preferPhraseMatches ? matchesPhrase(item) : matchesEveryTerm);
        item.hidden = !isMatch;
        if (isMatch) sectionMatches += 1;
      });

      section.hidden = sectionMatches === 0;
      matches += sectionMatches;
    });

    emptyState.hidden = matches > 0;
    if (terms.length === 0) updateActiveCategory();
  }

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

  categoryArrowLeft.addEventListener('click', () => scrollCategories(-1));
  categoryArrowRight.addEventListener('click', () => scrollCategories(1));
  categoryNav.addEventListener('scroll', updateCategoryArrows, { passive: true });

  const categoryResizeObserver = new ResizeObserver(updateCategoryArrows);
  categoryResizeObserver.observe(categoryNav);
  pills.forEach((pill) => categoryResizeObserver.observe(pill));

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

  window.addEventListener('pageshow', filterMenu);
  filterMenu();
  updateCategoryArrows();
  backToTop.hidden = window.scrollY <= window.innerHeight;

  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      document.querySelector(':target')?.scrollIntoView({ behavior: 'instant' });
    });
  });
}

function ensureMenuData() {
  if (window.menuData) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const dataScript = document.createElement('script');
    dataScript.src = 'menu-data.js?v=20260719-2';
    dataScript.addEventListener('load', resolve, { once: true });
    dataScript.addEventListener('error', reject, { once: true });
    document.head.append(dataScript);
  });
}

async function startMenu() {
  try {
    await ensureMenuData();
    renderMenu(window.menuData.categories);
    initializeMenuInteractions();
  } catch (error) {
    console.error('Could not load the menu data.', error);
    emptyState.textContent = 'No pudimos cargar el menú. Intenta actualizar la página.';
    emptyState.hidden = false;
  }
}

startMenu();
