// CSV Parser
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] ? values[index].trim().replace(/\r/g, '') : '';
        });
        data.push(obj);
    }

    return data;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    return result.map(v => v.replace(/^"|"$/g, ''));
}

// Global data storage
let servicesData = [];
let pricesData = [];

// Change service image on hover (globální funkce)
window.changeServiceImage = function (imageId) {
    document.querySelectorAll('#serviceImages img').forEach(img => {
        img.classList.remove('opacity-100');
        img.classList.add('opacity-0');
    });

    const targetImg = document.getElementById(imageId);
    if (targetImg) {
        targetImg.classList.remove('opacity-0');
        targetImg.classList.add('opacity-100');
    }
};

// Open service detail modal (globální funkce)
window.openServiceDetail = function (serviceId) {
    const service = servicesData.find(s => s.service_id === serviceId);
    if (!service) return;

    const benefits = service.benefits.split(',').filter(b => b.trim());
    const indications = service.indications.split(',').filter(i => i.trim());
    const contraindications = service.contraindications.split(',').filter(c => c.trim());
    const images = service.image.split(';').filter(img => img.trim());

    // Find prices for this service
    const servicePrices = pricesData.filter(p => p.service_id === serviceId);

    const modalHTML = `
        <div id="serviceDetailModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4" onclick="closeServiceDetail()">
            <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"></div>
            
            <div class="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up" onclick="event.stopPropagation()">
                <button onclick="closeServiceDetail()" class="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-900 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
                
                <!-- Image Gallery -->
                <div class="w-full h-64 md:h-96 bg-stone-100 relative overflow-hidden">
                    ${images.length > 0 ? `
                        <img src="images/${images[0]}" alt="${service.category_name}" class="w-full h-full object-cover">
                    ` : ''}
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                        <h2 class="text-4xl md:text-5xl font-cormorant text-white font-medium">${service.category_name}</h2>
                    </div>
                </div>
                
                <div class="p-8 md:p-12 space-y-8">
                    <!-- Short Description -->
                    <div>
                        <p class="text-xl text-stone-600 font-light font-geist italic">${service.short_description}</p>
                    </div>
                    
                    <!-- Full Description -->
                    <div>
                        <h3 class="text-2xl font-cormorant text-stone-900 mb-4">O ošetření</h3>
                        <p class="text-stone-600 font-light font-geist leading-relaxed">${service.full_description}</p>
                    </div>
                    
                    <!-- Benefits -->
                    ${benefits.length > 0 ? `
                        <div>
                            <h3 class="text-2xl font-cormorant text-stone-900 mb-4">Přínosy</h3>
                            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${benefits.map(b => `
                                    <li class="flex items-start gap-2 text-stone-600 font-geist">
                                        <svg class="w-5 h-5 text-stone-900 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>${b.trim()}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <!-- Indications -->
                    ${indications.length > 0 ? `
                        <div>
                            <h3 class="text-2xl font-cormorant text-stone-900 mb-4">Vhodné pro</h3>
                            <div class="flex flex-wrap gap-2">
                                ${indications.map(i => `
                                    <span class="px-3 py-1 bg-stone-100 text-stone-700 text-sm font-geist">${i.trim()}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Contraindications -->
                    ${contraindications.length > 0 ? `
                        <div class="bg-amber-50 border border-amber-200 p-6">
                            <h3 class="text-xl font-cormorant text-amber-900 mb-3">Kontraindikace</h3>
                            <ul class="space-y-2">
                                ${contraindications.map(c => `
                                    <li class="flex items-start gap-2 text-amber-800 text-sm font-geist">
                                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        <span>${c.trim()}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <!-- Prices -->
                    ${servicePrices.length > 0 ? `
                        <div>
                            <h3 class="text-2xl font-cormorant text-stone-900 mb-4">Ceník</h3>
                            <div class="space-y-3">
                                ${servicePrices.map(price => `
                                    <div class="flex justify-between items-baseline border-b border-stone-100 pb-2">
                                        <div>
                                            <span class="font-geist text-stone-900">${price.name}</span>
                                            ${price.duration_in_minutes ? `<span class="text-sm text-stone-400 ml-2">(${price.duration_in_minutes} min)</span>` : ''}
                                            ${price.session > 1 ? `<span class="text-sm text-stone-400 ml-2">• ${price.session}x</span>` : ''}
                                        </div>
                                        <span class="font-geist font-medium text-stone-900">${price.price_in_czk} Kč</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- CTA -->
                    <div class="pt-6 flex gap-4">
                        <button onclick="closeServiceDetail(); openBookingModal();" class="flex-1 bg-stone-900 text-white px-8 py-4 hover:bg-stone-800 transition-colors font-geist text-sm uppercase tracking-widest">
                            Rezervovat termín
                        </button>
                        <button onclick="closeServiceDetail()" class="flex-1 border border-stone-300 text-stone-900 px-8 py-4 hover:border-stone-900 transition-colors font-geist text-sm uppercase tracking-widest">
                            Zavřít
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
};

window.closeServiceDetail = function () {
    const modal = document.getElementById('serviceDetailModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
};

// Load CSV files
async function loadData() {
    try {
        const [servicesResponse, pricesResponse] = await Promise.all([
            fetch('services.csv'),
            fetch('prices.csv')
        ]);

        const servicesText = await servicesResponse.text();
        const pricesText = await pricesResponse.text();

        servicesData = parseCSV(servicesText);
        pricesData = parseCSV(pricesText);

        console.log('Services loaded:', servicesData.length);
        console.log('Prices loaded:', pricesData.length);

        renderServices();
        renderPriceList();
        renderBookingServices();

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render services section
function renderServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;

    servicesList.innerHTML = servicesData.map((service, index) => {
        const imageId = `img-${service.service_id}`;
        return `
            <div class="service-item group cursor-pointer" 
                 onmouseenter="changeServiceImage('${imageId}')"
                 onclick="openServiceDetail('${service.service_id}')">
                <h3 class="text-5xl md:text-6xl lg:text-7xl font-medium font-cormorant text-stone-200 group-hover:text-stone-900 transition-colors duration-500">
                    ${service.category_name}
                </h3>
            </div>
        `;
    }).join('');

    // Update service images
    const serviceImages = document.getElementById('serviceImages');
    if (serviceImages) {
        serviceImages.innerHTML = servicesData.map((service, index) => {
            const images = service.image.split(';');
            const firstImage = images[0];
            const imageId = `img-${service.service_id}`;

            return `
                <img id="${imageId}"
                     src="images/${firstImage}"
                     class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === 0 ? 'opacity-100' : 'opacity-0'}"
                     alt="${service.category_name}">
            `;
        }).join('') + `<div class="absolute inset-0 bg-stone-900/5 pointer-events-none"></div>`;
    }
}


// Render price list modal
function renderPriceList() {
    const priceListContainer = document.querySelector('#priceListModal .overflow-y-auto');
    if (!priceListContainer) return;

    // Group prices by service
    const groupedPrices = {};
    pricesData.forEach(price => {
        if (!groupedPrices[price.service_id]) {
            groupedPrices[price.service_id] = [];
        }
        groupedPrices[price.service_id].push(price);
    });

    let html = '';

    Object.keys(groupedPrices).forEach(serviceId => {
        const service = servicesData.find(s => s.service_id === serviceId);
        const prices = groupedPrices[serviceId];

        if (!service) return;

        html += `
            <div>
                <h3 class="font-cormorant text-2xl text-stone-900 mb-6 border-b border-stone-100 pb-2">
                    ${service.category_name}
                </h3>
                <div class="space-y-6 md:space-y-4">
                    ${prices.map(price => `
                        <div class="flex justify-between items-baseline group">
                            <div class="flex-1 pr-4">
                                <span class="font-geist text-stone-600 group-hover:text-stone-900 transition-colors text-sm md:text-base">
                                    ${price.name}
                                </span>
                                ${price.duration_in_minutes ? `<span class="text-xs text-stone-400 ml-2">(${price.duration_in_minutes} min)</span>` : ''}
                                ${price.session > 1 ? `<span class="text-xs text-stone-400 ml-2">• ${price.session} ošetření</span>` : ''}
                            </div>
                            <span class="font-geist font-medium text-stone-900 text-sm md:text-base whitespace-nowrap">
                                ${price.price_in_czk} Kč
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    priceListContainer.innerHTML = `<div class="space-y-10 md:space-y-12 pb-24 md:pb-12">${html}</div>` + priceListContainer.querySelector('.sticky')?.outerHTML || '';
}

// Render booking services
function renderBookingServices() {
    const bookingStep1 = document.getElementById('booking-step-1');
    if (!bookingStep1) return;

    const servicesGrid = bookingStep1.querySelector('.grid');
    if (!servicesGrid) return;

    // Group prices by service for display
    const serviceOptions = servicesData.map(service => {
        const servicePrices = pricesData.filter(p => p.service_id === service.service_id);
        const priceRange = servicePrices.length > 0
            ? `od ${Math.min(...servicePrices.map(p => parseInt(p.price_in_czk)))} Kč`
            : 'Cena na dotaz';

        return {
            id: service.service_id,
            name: service.category_name,
            description: service.short_description,
            priceRange: priceRange
        };
    });

    servicesGrid.innerHTML = serviceOptions.map(service => `
        <button onclick="selectService('${service.name}', '${service.priceRange}')" 
                class="text-left p-6 border border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all group">
            <span class="block font-cormorant text-2xl mb-2 text-stone-900">${service.name}</span>
            <span class="block font-geist text-sm text-stone-500 mb-4">${service.description}</span>
            <span class="block font-geist text-xs uppercase tracking-widest text-stone-400 group-hover:text-stone-900">
                ${service.priceRange}
            </span>
        </button>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
