
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  
  if (!menu) {
    console.warn('Warning: .menu element not found');
    return;
  }

  menu.addEventListener('click', () => {
    const isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
  });
});