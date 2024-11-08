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
                    <input type="number" class="form-input priority-input" placeholder="0.5" value="0.5" min="0" max="1">
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
    document.getElementById(`section-${id}`).remove();
}

function validateInputs(urlsText, priority) {
    const urls = urlsText.split("\n").map(url => url.trim()).filter(Boolean);
    if (urls.some(url => !/^https?:\/\/[^\s]+$/.test(url))) {
        alert("Hay URLs incorrectas o incompletas.");
        return false;
    }
    if (parseFloat(priority) > 1.0) {
        alert("La prioridad no puede ser mayor a 1.0.");
        return false;
    }
    return { urls, priority: parseFloat(priority) };
}

function generateSitemap() {
    const sections = document.querySelectorAll(".form-section");
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    sections.forEach(section => {
        const urlsText = section.querySelector(".url-input").value.trim();
        const priority = section.querySelector(".priority-input").value;
        const changefreq = section.querySelector(".frequency-select").value;
        const selectedDate = section.querySelector(".lastmod-input").value;

        const validation = validateInputs(urlsText, priority);
        if (!validation) return;

        const { urls, priority: validatedPriority } = validation;

        // Obtener la hora local actual
        const lastmod = new Date(`${selectedDate}T${new Date().toLocaleTimeString()}`).toISOString();

        urls.forEach(url => {
            xmlContent += `  <url>\n`;
            xmlContent += `    <loc>${url}</loc>\n`;
            xmlContent += `    <lastmod>${lastmod}</lastmod>\n`;
            xmlContent += `    <changefreq>${changefreq}</changefreq>\n`;
            xmlContent += `    <priority>${validatedPriority}</priority>\n`;
            xmlContent += `  </url>\n`;
        });
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
