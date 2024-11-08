let sectionCounter = 0;

function addUrlSection() {
    sectionCounter++;
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("form-section");
    sectionDiv.id = `section-${sectionCounter}`;

    const today = new Date().toISOString().slice(0, 10); // Fecha actual en formato yyyy-mm-dd

    sectionDiv.innerHTML = `
        <button class="btn-remove" onclick="removeSection(${sectionCounter})">Eliminar</button>
        <div class="url-group">
            <label class="form-label">Listado de URLs (una por línea)</label>
            <textarea class="form-textarea url-input" rows="3" placeholder="https://example.com" oninput="highlightInvalidUrls(${sectionCounter})"></textarea>
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
                    <input type="text" class="form-input priority-input" placeholder="0.5" value="0.5" oninput="validatePriority(${sectionCounter})">
                </div>
            </div>
            <div class="container-config-inf">
                <label class="form-label">Última modificación</label>
                <input type="date" class="form-input lastmod-input" value="${today}">
            </div>
        </div>
    `;
    document.getElementById("url-sections").appendChild(sectionDiv);
}

function removeSection(id) {
    const section = document.getElementById(`section-${id}`);
    if (section) section.remove();
}

function validatePriority(sectionId) {
    const priorityInput = document.querySelector(`#section-${sectionId} .priority-input`);
    const priorityValue = parseFloat(priorityInput.value);
    if (priorityValue > 1.0) {
        priorityInput.value = "1.0";
        alert("La prioridad no puede ser mayor a 1.0");
    }
}

function highlightInvalidUrls(sectionId) {
    const urlTextArea = document.querySelector(`#section-${sectionId} .url-input`);
    const urls = urlTextArea.value.split("\n");

    const invalidUrls = urls.filter(url => !isValidUrl(url.trim()));

    // Resaltar las URLs inválidas
    urls.forEach(url => {
        const trimmedUrl = url.trim();
        const isInvalid = !isValidUrl(trimmedUrl);
        const formattedUrl = urlTextArea.value.replace(trimmedUrl, `<span style="text-decoration: underline; color: yellow;">${trimmedUrl}</span>`);
        urlTextArea.innerHTML = formattedUrl; // Subrayar en amarillo las URLs incorrectas
    });

    // Si hay URLs inválidas, marcar el fondo del textarea como amarillo
    urlTextArea.style.backgroundColor = invalidUrls.length > 0 ? "yellow" : "white";
}

function isValidUrl(url) {
    const regex = /^(https?:\/\/)/;
    return regex.test(url);
}

function generateSitemap() {
    const sections = document.querySelectorAll(".form-section");
    let urls = [];

    let validUrls = true; // Para verificar si todas las URLs son válidas

    sections.forEach(section => {
        const urlsText = section.querySelector(".url-input").value.trim();
        const sectionUrls = urlsText.split("\n").filter(url => url.trim() !== "");
        const changefreq = section.querySelector(".frequency-select").value;
        const priority = section.querySelector(".priority-input").value;
        const selectedDate = section.querySelector(".lastmod-input").value;

        // Obtener la hora actual
        const localDate = new Date();
        const hours = String(localDate.getHours()).padStart(2, '0');
        const minutes = String(localDate.getMinutes()).padStart(2, '0');
        const seconds = String(localDate.getSeconds()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;
        const lastmod = `${selectedDate}T${currentTime}+00:00`;

        // Verificar si todas las URLs son válidas
        sectionUrls.forEach(url => {
            if (!isValidUrl(url.trim())) validUrls = false;
            urls.push({ url: url.trim(), changefreq, priority, lastmod });
        });
    });

    // Si alguna URL es inválida, no generar el sitemap
    if (!validUrls) {
        alert("Hay URLs inválidas, por favor corrígelas antes de generar el sitemap.");
        return;
    }

    // Ordenar las URLs alfabéticamente
    urls.sort((a, b) => a.url.localeCompare(b.url));

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    urls.forEach(item => {
        xmlContent += `  <url>\n`;
        xmlContent += `    <loc>${item.url}</loc>\n`;
        xmlContent += `    <lastmod>${item.lastmod}</lastmod>\n`;
        xmlContent += `    <changefreq>${item.changefreq}</changefreq>\n`;
        xmlContent += `    <priority>${item.priority}</priority>\n`;
        xmlContent += `  </url>\n`;
    });

    xmlContent += "</urlset>";
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

// Agregar automáticamente la primera sección de URLs
addUrlSection();
