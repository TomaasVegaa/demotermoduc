/* ==========================================================================
   TERMODUC - Presupuestos & Cotizaciones System Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const itemsContainer = document.getElementById('budget-items-container');
  const btnAddItem = document.getElementById('btn-add-item');
  const clientNameInput = document.getElementById('client-name');
  const clientPhoneInput = document.getElementById('client-phone');
  const clientAddressInput = document.getElementById('client-address');
  const budgetNotesInput = document.getElementById('budget-notes');
  const taxSelect = document.getElementById('tax-select');
  
  // Live Preview Elements
  const previewClientName = document.getElementById('preview-client-name');
  const previewClientPhone = document.getElementById('preview-client-phone');
  const previewClientAddress = document.getElementById('preview-client-address');
  const previewDate = document.getElementById('preview-date');
  const previewNumber = document.getElementById('preview-number');
  const previewTableBody = document.getElementById('preview-table-body');
  const previewSubtotal = document.getElementById('preview-subtotal');
  const previewTax = document.getElementById('preview-tax');
  const previewTotal = document.getElementById('preview-total');
  const previewNotes = document.getElementById('preview-notes');
  
  const btnExportPdf = document.getElementById('btn-export-pdf');
  const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

  // Predefined service presets
  const presets = [
    { name: "Fabricación e Instalación de Conducto (Mts)", price: 45000 },
    { name: "Instalación Aire Acondicionado Split (hasta 3500 Frig)", price: 85000 },
    { name: "Mantenimiento & Service de Climatización Central", price: 120000 },
    { name: "Armado y Cableado de Tablero Trifásico", price: 150000 },
    { name: "Instalación de Térmicas, Disyuntor y Protección", price: 65000 },
    { name: "Recarga de Refrigerante R410a / R22", price: 40000 },
    { name: "Diagnóstico & Balanceo de Cargas Eléctricas", price: 55000 }
  ];

  // Set today's date & random budget #
  const today = new Date();
  if (previewDate) previewDate.textContent = today.toLocaleDateString('es-AR');
  if (previewNumber) previewNumber.textContent = 'PRE-' + Math.floor(1000 + Math.random() * 9000);

  function createItemRow(presetIndex = 0) {
    const row = document.createElement('div');
    row.className = 'item-row';
    
    let presetOptions = presets.map((p, idx) => 
      `<option value="${p.name}" data-price="${p.price}" ${idx === presetIndex ? 'selected' : ''}>${p.name}</option>`
    ).join('');

    row.innerHTML = `
      <select class="form-control item-desc">
        ${presetOptions}
        <option value="custom">+ Personalizado...</option>
      </select>
      <input type="number" class="form-control item-qty" value="1" min="1" placeholder="Cant">
      <input type="number" class="form-control item-price" value="${presets[presetIndex] ? presets[presetIndex].price : 0}" placeholder="Precio Unit. ($)">
      <button type="button" class="btn-remove" title="Eliminar fila"><i class="fas fa-trash-alt"></i></button>
    `;

    // Event listeners for recalculations
    const select = row.querySelector('.item-desc');
    const qtyInput = row.querySelector('.item-qty');
    const priceInput = row.querySelector('.item-price');
    const btnRemove = row.querySelector('.btn-remove');

    select.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        const customText = prompt('Ingrese la descripción personalizada del servicio/material:');
        if (customText) {
          const opt = document.createElement('option');
          opt.value = customText;
          opt.textContent = customText;
          opt.selected = true;
          select.prepend(opt);
        } else {
          select.selectedIndex = 0;
        }
      } else {
        const selectedOpt = select.options[select.selectedIndex];
        const price = selectedOpt.getAttribute('data-price');
        if (price) priceInput.value = price;
      }
      updateBudgetPreview();
    });

    qtyInput.addEventListener('input', updateBudgetPreview);
    priceInput.addEventListener('input', updateBudgetPreview);
    
    btnRemove.addEventListener('click', () => {
      if (itemsContainer.querySelectorAll('.item-row').length > 1) {
        row.remove();
        updateBudgetPreview();
      } else {
        alert('Debe haber al menos 1 ítem en el presupuesto.');
      }
    });

    return row;
  }

  // Add initial rows
  if (itemsContainer) {
    itemsContainer.appendChild(createItemRow(0));
    itemsContainer.appendChild(createItemRow(3));
  }

  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      itemsContainer.appendChild(createItemRow(1));
      updateBudgetPreview();
    });
  }

  // Update preview live
  function updateBudgetPreview() {
    if (clientNameInput && previewClientName) {
      previewClientName.textContent = clientNameInput.value.trim() || 'Cliente Particular / Empresa';
    }
    if (clientPhoneInput && previewClientPhone) {
      previewClientPhone.textContent = clientPhoneInput.value.trim() ? `Tel: ${clientPhoneInput.value.trim()}` : '';
    }
    if (clientAddressInput && previewClientAddress) {
      previewClientAddress.textContent = clientAddressInput.value.trim() ? `Ubicación: ${clientAddressInput.value.trim()}` : '';
    }
    if (budgetNotesInput && previewNotes) {
      previewNotes.textContent = budgetNotesInput.value.trim() || 'Garantía oficial Termoduc. Validez del presupuesto: 15 días hábiles.';
    }

    if (!previewTableBody) return;

    previewTableBody.innerHTML = '';
    let subtotal = 0;

    const rows = itemsContainer.querySelectorAll('.item-row');
    rows.forEach(row => {
      const descSelect = row.querySelector('.item-desc');
      const desc = descSelect.options[descSelect.selectedIndex].value;
      const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      const totalItem = qty * price;
      subtotal += totalItem;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500;">${desc}</td>
        <td style="text-align: center;">${qty}</td>
        <td style="text-align: right;">$ ${price.toLocaleString('es-AR')}</td>
        <td style="text-align: right; font-weight: 600; color: #0B132B;">$ ${totalItem.toLocaleString('es-AR')}</td>
      `;
      previewTableBody.appendChild(tr);
    });

    const taxRate = taxSelect ? parseFloat(taxSelect.value) : 0;
    const taxAmount = subtotal * taxRate;
    const finalTotal = subtotal + taxAmount;

    if (previewSubtotal) previewSubtotal.textContent = `$ ${subtotal.toLocaleString('es-AR')}`;
    if (previewTax) previewTax.textContent = `$ ${taxAmount.toLocaleString('es-AR')}`;
    if (previewTotal) previewTotal.textContent = `$ ${finalTotal.toLocaleString('es-AR')}`;
  }

  // Bind live listeners for client fields
  [clientNameInput, clientPhoneInput, clientAddressInput, budgetNotesInput, taxSelect].forEach(input => {
    if (input) input.addEventListener('input', updateBudgetPreview);
  });

  // Initialize calculation
  updateBudgetPreview();

  // Export PDF functionality using html2pdf / print canvas
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      const element = document.getElementById('budget-pdf-content');
      if (!element) return;

      const opt = {
        margin:       0.4,
        filename:     `Presupuesto_Termoduc_${previewNumber ? previewNumber.textContent : 'OFICIAL'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    });
  }

  // Send WhatsApp Direct Link
  if (btnSendWhatsapp) {
    btnSendWhatsapp.addEventListener('click', () => {
      const clientName = clientNameInput ? clientNameInput.value.trim() : 'Cliente';
      const budgetNum = previewNumber ? previewNumber.textContent : 'Cotización';
      const totalVal = previewTotal ? previewTotal.textContent : '$0';
      
      const message = `Hola ${clientName}! 👋 Adjunto la cotización oficial de *TERMODUC Climatización & Electricidad* (${budgetNum}).\n\n💰 *Monto Total:* ${totalVal}\n📍 Incluye garantía técnica y materiales según especificación.\n\nQuedamos a su disposición para coordinar la fecha de inicio del trabajo. ¡Saludos!`;
      
      const phone = clientPhoneInput ? clientPhoneInput.value.replace(/\D/g, '') : '';
      const whatsappUrl = phone 
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');
    });
  }
});
