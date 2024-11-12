let sectionCounter = 0;

function addUrlSection() {
    sectionCounter++;
    const today = new Date().toISOString().slice(0, 10);
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("form-section");
    sectionDiv.id = `section-${sectionCounter}`;
    sectionDiv.innerHTML = `
        <button class="btn-remove" onclick="removeSection(${sectionCounter})">Eliminar</button>
        <div class="url-group">
            <label class="form-label">Listado de URLs (una por línea)</label>
            <textarea class="form-textarea url-input" rows="3" placeholder="https://example.com"></textarea>
        </div>
        <div class="config-group">
            <div class="container-config-sup">
                <div class="ctn-inter-w-50">
                    <label class="form-label">Frec. de cambio</label>
                    <select class="form-select frequency-select">
                        <option value="always">Always</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="never">Never</option>
                    </select>
                </div>
                <div class="ctn-inter-w-50">
                    <label class="form-label mobile">Prioridad (0.0 a 1.0)</label>
                    <input type="number" class="form-input priority-input" placeholder="0.5" value="0.5" min="0" max="1" step="0.1" oninput="validatePriority(this)">
                </div>
            </div>
            <div class="container-config-inf">
                <label class="form-label">Última modificación</label>
                <input type="date" class="form-input lastmod-input" value="${today}" max="{today}">
            </div>
        </div>
    `;
    document.getElementById("url-sections").appendChild(sectionDiv);
}

function removeSection(id) {
    document.getElementById(`section-${id}`).remove();
}

function isValidUrl(url) {
    return /^(https?:\/\/)/.test(url);
}

function validatePriority(input) {
    if (parseFloat(input.value) > 1) input.value = 1;
}

function generateSitemap() {
    const sections = document.querySelectorAll(".form-section");
    let urls = [];
    let allValid = true;

    sections.forEach(section => {
        const urlsText = section.querySelector(".url-input").value.trim();
        const sectionUrls = urlsText.split("\n").filter(url => url.trim() !== "");
        const changefreq = section.querySelector(".frequency-select").value;
        let priority = parseFloat(section.querySelector(".priority-input").value) || 0.5;
        const lastmod = `${section.querySelector(".lastmod-input").value}T${new Date().toISOString().slice(11, 19)}+00:00`;

        // Validación de URLs y Prioridad
        const invalidUrls = sectionUrls.some(url => !isValidUrl(url.trim()));
        const invalidPriority = priority > 1.0 || priority < 0.0;

        // Aplicar color dependiendo de la validez
        section.querySelector(".url-input").style.backgroundColor = invalidUrls ? "yellow" : "white";
        section.querySelector(".priority-input").style.backgroundColor = invalidPriority ? "yellow" : "white";

        if (invalidUrls || invalidPriority) {
            allValid = false;
        }

        // Agregar las URLs válidas
        sectionUrls.forEach(url => {
            if (!invalidUrls && !invalidPriority) {
                urls.push({ url: url.trim(), changefreq, priority, lastmod });
            }
        });
    });

    // Mostrar mensaje de error si hay URLs o prioridades inválidas
    if (!allValid) {
        alert("No se puede generar el sitemap. Por favor, corrige todas las URLs o prioridades inválidas.");
        return;
    }

    // Ordenar URLs
    urls.sort((a, b) => a.url.localeCompare(b.url));
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(item => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}\n</urlset>`;

    document.getElementById("xml-output").textContent = xmlContent;
    document.getElementById("output-section").style.display = "block";
}

function exportSitemap() {
    const xmlContent = document.getElementById("xml-output").textContent;
    const blob = new Blob([xmlContent], { type: "text/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(link.href);
}

// Inicializar con una sección
addUrlSection();
