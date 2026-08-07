/* ==========================================================================
   TERMODUC - Main Interactive UI Logic & Instagram Branding Assistant
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileNavBtn = document.getElementById('mobile-nav-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileNavBtn && navLinks) {
    mobileNavBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileNavBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Filter Work Gallery
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Copy Bio Text for Instagram Strategy
  const btnCopyBio = document.getElementById('btn-copy-bio');
  if (btnCopyBio) {
    btnCopyBio.addEventListener('click', () => {
      const bioText = `❄️ TERMODUC | Climatización & Electricidad⚡
🛠️ Fab. de Conductos para Aire Acondicionado Central
❄️ Instalación & Reparación de Split / Multi-split
🔌 Tableros Eléctricos, Mantenimiento & Certificación
📄 Presupuestos Digitales sin cargo
👇 Cotizá tu proyecto en nuestra web:`;

      navigator.clipboard.writeText(bioText).then(() => {
        const origText = btnCopyBio.innerHTML;
        btnCopyBio.innerHTML = '<i class="fas fa-check"></i> ¡Copiado al Portapapeles!';
        btnCopyBio.style.background = '#10B981';
        setTimeout(() => {
          btnCopyBio.innerHTML = origText;
          btnCopyBio.style.background = '';
        }, 2500);
      });
    });
  }
});
