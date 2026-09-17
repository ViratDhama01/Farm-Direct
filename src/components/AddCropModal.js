// 🌱 FarmDirect Add & Edit Crop Modal (For Farmers)
import { Icons } from '../lib/icons.js';
import { FarmDirectApi } from '../lib/supabase.js';
import { LanguageManager } from '../lib/translations.js';
import { resolveCropImages, getCropPreviewImage, getCropSvgFallback } from '../lib/cropImages.js';

export function renderAddCropModal(container, { farmerUser, editCrop = null, onClose, onCropAdded, onCropUpdated }) {
  const { t } = LanguageManager;
  const isEditing = Boolean(editCrop);

  const initialTitle = editCrop?.title || 'Green Moong Dal';
  const initialCategory = editCrop?.category || 'Pulses';
  const initialQty = editCrop?.quantity_available ?? 500;
  const initialPrice = editCrop?.price_per_unit ?? 18;
  const initialGrade = editCrop?.quality_grade || 'Grade A';
  const initialHarvest = editCrop?.harvest_date || 'Harvested 2 days ago';
  const initialLoc = editCrop?.location || farmerUser?.location || 'Meerut, Uttar Pradesh';
  const initialPin = editCrop?.pincode || '250001';
  const initialDesc = editCrop?.description || 'Fresh, chemical-free produce directly from my farm. Graded and washed, high shelf life.';

  const initialPreview = getCropPreviewImage(initialTitle, initialCategory);
  const initialFallback = getCropSvgFallback(initialTitle, initialCategory);

  container.innerHTML = `
    <div class="modal-overlay" id="add-crop-backdrop">
      <div class="modal-container" style="max-width: 620px; padding: 1.5rem 2rem; max-height: 90vh; overflow-y: auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
          <h3 style="font-size:1.35rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.5rem;">
            <span style="color:#15803d; width:22px; height:22px; display:inline-block;">${isEditing ? '✏️' : Icons.leaf}</span>
            ${isEditing ? (t('editCropTitle') || 'Edit Produce Listing') : t('addCropTitle')}
          </h3>
          <button id="btn-close-add-modal" class="btn-close-modal">
            <span style="width:18px; height:18px; display:inline-block;">${Icons.x}</span>
          </button>
        </div>

        <form id="add-crop-form" style="display:flex; flex-direction:column; gap:1rem;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div>
              <label class="filter-label">${t('addCropNameLabel')}</label>
              <input type="text" id="crop-input-title" class="input-styled" placeholder="e.g. Green Moong Dal, Chana, Basmati Rice, गेहूं" value="${initialTitle}" required style="padding-left:0.85rem;" />
            </div>

            <div>
              <label class="filter-label">${t('addCropCategoryLabel')}</label>
              <select id="crop-input-category" class="filter-select" style="height:46px;">
                <option value="Pulses" ${initialCategory.toLowerCase() === 'pulses' ? 'selected' : ''}>🫘 Pulses / दालें</option>
                <option value="Grains" ${initialCategory.toLowerCase() === 'grains' ? 'selected' : ''}>🌾 Grains / अनाज</option>
                <option value="Spices" ${initialCategory.toLowerCase() === 'spices' ? 'selected' : ''}>🌶️ Spices / मसाले</option>
                <option value="Oilseeds" ${initialCategory.toLowerCase() === 'oilseeds' ? 'selected' : ''}>🌻 Oilseeds / तिलहन</option>
                <option value="Organic" ${initialCategory.toLowerCase() === 'organic' ? 'selected' : ''}>🌿 Organic / जैविक</option>
              </select>
            </div>
          </div>

          <!-- Live Automatic Unsplash Image Preview Banner -->
          <div id="crop-image-preview-card" style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:12px; padding:0.85rem; display:flex; gap:1rem; align-items:center;">
            <div style="width:80px; height:80px; border-radius:8px; overflow:hidden; flex-shrink:0; background:#e2e8f0; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
              <img id="auto-crop-img-preview" src="${initialPreview}" alt="Crop Preview" onerror="this.onerror=null; this.src='${initialFallback}'" style="width:100%; height:100%; object-fit:cover; display:block;" />
            </div>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.25rem;">
                <span style="background:#dcfce7; color:#15803d; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:999px; display:inline-flex; align-items:center; gap:3px;">
                  ✨ Auto-fetched from Unsplash
                </span>
              </div>
              <p style="font-size:0.8rem; color:#475569; margin:0; line-height:1.35;">
                Matched automatically by crop name (<strong id="preview-crop-keyword">${initialTitle}</strong>). Will be displayed to buyers if no custom photo is uploaded.
              </p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div>
              <label class="filter-label">${t('addCropQtyLabel')}</label>
              <input type="number" id="crop-input-qty" class="input-styled" placeholder="e.g. 500" value="${initialQty}" required style="padding-left:0.85rem;" min="1" />
            </div>

            <div>
              <label class="filter-label">${t('addCropPriceLabel')}</label>
              <input type="number" id="crop-input-price" class="input-styled" placeholder="e.g. 18" value="${initialPrice}" required style="padding-left:0.85rem;" min="1" />
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div>
              <label class="filter-label">${t('addCropGradeLabel')}</label>
              <select id="crop-input-grade" class="filter-select" style="height:46px;">
                <option value="Grade A" ${initialGrade === 'Grade A' ? 'selected' : ''}>Grade A (Premium / निर्यात गुणवत्ता)</option>
                <option value="Grade B" ${initialGrade === 'Grade B' ? 'selected' : ''}>Grade B (Standard / मानक)</option>
                <option value="Organic" ${initialGrade === 'Organic' ? 'selected' : ''}>Organic Certified (प्रमाणित जैविक)</option>
              </select>
            </div>

            <div>
              <label class="filter-label">${t('addCropHarvestLabel')}</label>
              <select id="crop-input-harvest" class="filter-select" style="height:46px;">
                <option value="Harvested Today" ${initialHarvest.includes('Today') ? 'selected' : ''}>Harvested Today (आज ही तोड़ा गया)</option>
                <option value="Harvested 1 day ago" ${initialHarvest.includes('1 day') ? 'selected' : ''}>Harvested 1 day ago (1 दिन पूर्व)</option>
                <option value="Harvested 2 days ago" ${initialHarvest.includes('2 day') ? 'selected' : ''}>Harvested 2 days ago (2 दिन पूर्व)</option>
                <option value="Harvesting in 2 days" ${initialHarvest.includes('Harvesting') ? 'selected' : ''}>Harvesting in 2 days (2 दिन में कटाई)</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
            <div style="position:relative;">
              <label class="filter-label">${t('addCropLocLabel')}</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" id="crop-input-loc" class="input-styled" value="${initialLoc}" style="padding-left:0.85rem;" required />
                <button type="button" id="btn-detect-loc" class="btn-auth-primary" style="padding:0 12px; font-size:0.75rem; white-space:nowrap;">
                  ${Icons.mapPin} Detect
                </button>
              </div>
            </div>
            <div>
              <label class="filter-label">Pin Code *</label>
              <input type="text" id="crop-input-pin" class="input-styled" placeholder="e.g. 250001" value="${initialPin}" style="padding-left:0.85rem;" required />
            </div>
          </div>

          <div>
            <label class="filter-label">${t('addCropDescLabel')}</label>
            <textarea id="crop-input-desc" class="input-styled" style="height:70px; padding:0.6rem 0.85rem; resize:none;" placeholder="Fresh, chemical-free produce directly from farm gate...">${initialDesc}</textarea>
          </div>

          <div>
            <label class="filter-label">${t('addCropImgLabel')}</label>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              <input type="file" id="crop-input-files" class="input-styled" multiple accept="image/*,video/*" style="padding-left:0.85rem;" />
              <div id="file-upload-status" style="font-size:0.75rem; color:#64748b;">
                Optional: Upload photos/videos of your produce or leave blank to use auto-matched Unsplash photos.
              </div>
            </div>
          </div>

          <button type="submit" class="btn-auth-full btn-auth-primary" style="margin-top:0.5rem;">
            ${isEditing ? (t('btnSaveListing') || 'Save Changes') : t('btnPublish')}
          </button>
        </form>
      </div>
    </div>
  `;

  const titleInput = container.querySelector('#crop-input-title');
  const catInput = container.querySelector('#crop-input-category');
  const previewImg = container.querySelector('#auto-crop-img-preview');
  const previewKeyword = container.querySelector('#preview-crop-keyword');
  const fileInput = container.querySelector('#crop-input-files');
  const fileStatus = container.querySelector('#file-upload-status');

  // Live Auto Unsplash Image Preview as Farmer Types or Changes Category
  function updateImagePreview() {
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      previewImg.src = URL.createObjectURL(file);
      previewKeyword.innerText = `${fileInput.files.length} custom file(s) selected`;
      fileStatus.innerText = `Selected ${fileInput.files.length} custom file(s). These will override the auto Unsplash photo.`;
      fileStatus.style.color = '#15803d';
    } else {
      const title = titleInput.value.trim();
      const cat = catInput.value;
      const matchedUrl = getCropPreviewImage(title, cat);
      previewImg.src = matchedUrl;
      previewKeyword.innerText = title || cat;
      fileStatus.innerText = 'Optional: Upload photos/videos of your produce or leave blank to use auto-matched Unsplash photos.';
      fileStatus.style.color = '#64748b';
    }
  }

  titleInput.addEventListener('input', updateImagePreview);
  catInput.addEventListener('change', updateImagePreview);
  fileInput.addEventListener('change', updateImagePreview);

  // Location detection
  container.querySelector('#btn-detect-loc').addEventListener('click', async () => {
    const locInput = container.querySelector('#crop-input-loc');
    const pinInput = container.querySelector('#crop-input-pin');

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    locInput.value = 'Detecting...';

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await resp.json();
        const address = data.address;

        const city = address.city || address.town || address.village || address.county || 'Unknown';
        const state = address.state || 'Unknown';
        const pincode = address.postcode || '';

        locInput.value = `${city}, ${state}`;
        if (pincode) pinInput.value = pincode;
      } catch (err) {
        console.error('Reverse geocode error:', err);
        locInput.value = 'Error detecting location';
      }
    }, (err) => {
      alert('Unable to retrieve your location. Please enter it manually.');
      locInput.value = '';
    });
  });

  // Close handlers
  container.querySelector('#btn-close-add-modal').addEventListener('click', onClose);
  container.querySelector('#add-crop-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'add-crop-backdrop') onClose();
  });

  // Form submit
  container.querySelector('#add-crop-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = container.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = isEditing ? 'Saving...' : 'Publishing...';

    const title = titleInput.value.trim();
    const category = catInput.value;

    // Handle Media Uploads if any provided
    let uploadedImages = editCrop?.images || [];
    if (fileInput && fileInput.files.length > 0) {
      try {
        uploadedImages = await FarmDirectApi.uploadMedia(Array.from(fileInput.files));
      } catch (err) {
        alert('Media upload failed. Using automatic Unsplash crop image.');
        console.error('Upload error:', err);
      }
    }

    // Automatically resolve Unsplash images
    const finalImages = resolveCropImages(title, category, uploadedImages);

    const cropPayload = {
      ...(editCrop || {}),
      farmer_id: editCrop?.farmer_id || farmerUser?.id || `farmer-${Date.now()}`,
      farmer_name: editCrop?.farmer_name || farmerUser?.name || 'Farmer',
      farmer_avatar: '👨‍🌾',
      farmer_rating: editCrop?.farmer_rating || 4.9,
      farmer_reviews_count: editCrop?.farmer_reviews_count || 1,
      farmer_verified: true,
      farmer_phone: editCrop?.farmer_phone || farmerUser?.phone || '+91 98765 00000',
      title: title,
      category: category,
      quantity_available: Number(container.querySelector('#crop-input-qty').value),
      unit: 'kg',
      price_per_unit: Number(container.querySelector('#crop-input-price').value),
      quality_grade: container.querySelector('#crop-input-grade').value,
      location: container.querySelector('#crop-input-loc').value,
      pincode: container.querySelector('#crop-input-pin').value,
      distance_km: editCrop?.distance_km || 12,
      harvest_date: container.querySelector('#crop-input-harvest').value,
      description: container.querySelector('#crop-input-desc').value,
      tags: editCrop?.tags || ['Farm Fresh', 'Grade A', 'Direct Listing'],
      images: finalImages,
      status: 'active',
      price_intelligence: {
        current_market: Math.round(Number(container.querySelector('#crop-input-price').value) * 0.95),
        nearby_avg: Number(container.querySelector('#crop-input-price').value),
        highest_market: Math.round(Number(container.querySelector('#crop-input-price').value) * 1.25),
        trend: 'Increasing (↑ 10%)'
      }
    };

    if (isEditing && editCrop) {
      const updated = await FarmDirectApi.updateCrop(editCrop.id, cropPayload);
      submitBtn.disabled = false;
      submitBtn.innerText = t('btnSaveListing') || 'Save Changes';
      if (onCropUpdated) onCropUpdated(updated);
      else if (onCropAdded) onCropAdded(updated);
    } else {
      const added = await FarmDirectApi.addCrop(cropPayload);
      submitBtn.disabled = false;
      submitBtn.innerText = t('btnPublish');
      if (onCropAdded) onCropAdded(added);
    }
  });
}


