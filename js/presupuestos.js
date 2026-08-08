/* ==========================================================================
   TERMODUC - Direct WhatsApp Consultation & Budget Form Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('whatsapp-budget-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('req-name').value.trim() || 'Cliente Particular';
      const phone = document.getElementById('req-phone').value.trim();
      const service = document.getElementById('req-service').value;
      const location = document.getElementById('req-location').value.trim() || 'No especificada';
      const message = document.getElementById('req-message').value.trim();

      let text = `Hola *TERMODUC Climatización*! 👋 Quisiera solicitar un presupuesto / consulta:\n\n`;
      text += `👤 *Nombre:* ${name}\n`;
      if (phone) text += `📞 *Teléfono:* ${phone}\n`;
      text += `🛠️ *Servicio Requerido:* ${service}\n`;
      text += `📍 *Ubicación / Obra:* ${location}\n`;
      if (message) text += `💬 *Detalle / Consulta:* ${message}\n\n`;
      text += `Quedo a la espera de su respuesta. ¡Muchas gracias!`;

      // Encodes message and redirects to WhatsApp Business
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
});
