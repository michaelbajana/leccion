(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const backButton = document.querySelector('.back-button');
  const validPages = new Set(pages.map(page => page.id));
  const historyStack = ['inicio'];

  function showPage(pageId, remember = true) {
    const targetId = validPages.has(pageId) ? pageId : 'inicio';
    const current = pages.find(page => page.classList.contains('active'))?.id;
    if (current === targetId) return;

    if (remember && current) historyStack.push(current);
    pages.forEach(page => {
      const isActive = page.id === targetId;
      page.hidden = !isActive;
      page.classList.toggle('active', isActive);
    });
    navLinks.forEach(link => {
      const isActive = link.dataset.page === targetId;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (window.location.hash !== `#${targetId}`) history.replaceState(null, '', `#${targetId}`);
  }

  navLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.dataset.page;
    const current = pages.find(page => page.classList.contains('active'))?.id;
    if (current && current !== targetId) historyStack.push(current);
    showPage(targetId, false);
  }));

  document.querySelector('.brand').addEventListener('click', event => {
    event.preventDefault();
    const current = pages.find(page => page.classList.contains('active'))?.id;
    if (current && current !== 'inicio') historyStack.push(current);
    showPage('inicio', false);
  });

  backButton.addEventListener('click', () => {
    const previous = historyStack.pop();
    showPage(previous || 'inicio', false);
  });

  const initialPage = window.location.hash.slice(1);
  if (validPages.has(initialPage) && initialPage !== 'inicio') {
    showPage(initialPage, false);
    historyStack.length = 0;
    historyStack.push('inicio');
  }
})();
