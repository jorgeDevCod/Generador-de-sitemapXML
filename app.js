let sectionCounter = 0;

function addUrlSection() {
    sectionCounter++;
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("form-section");
    sectionDiv.id = `section-${sectionCounter}`;

    // Obtener la fecha y hora actual en el formato requerido
    const now = new Date().toISOString().slice(0, 19) + "+00:00";

    sectionDiv.innerHTML = `
        <button class="btn-remove" onclick="removeSection(${sectionCounter})">Eliminar</button>
        <div class="url-group">
            <label class="form-label">Listado de URLs (una por línea)</label>
            <textarea class="form-textarea url-input" rows="3" placeholder="https://example.com"></textarea>
        </div>
        <div class="config-group">
            <div>
                <label class="form-label">Frecuencia de cambio</label>
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
            <div>
                <label class="form-label">Prioridad (0.0 a 1.0)</label>
                <input type="text" class="form-input priority-input" placeholder="0.5" value="0.5">
            </div>
            <div>
                <label class="form-label">Última modificación</label>
                <input type="datetime-local" class="form-input lastmod-input" value="${now.slice(0, 16)}">
            </div>
        </div>
    `;
    document.getElementById("url-sections").appendChild(sectionDiv);
}

function removeSection(id) {
    const section = document.getElementById(`section-${id}`);
    if (section) {
        section.remove();
    }
}

function generateSitemap() {
    const sections = document.querySelectorAll(".form-section");
    let urls = [];

    sections.forEach(section => {
        const urlsText = section.querySelector(".url-input").value.trim();
        const sectionUrls = urlsText.split("\n").filter(url => url.trim() !== "");
        const changefreq = section.querySelector(".frequency-select").value;
        const priority = section.querySelector(".priority-input").value;
        let lastmod = section.querySelector(".lastmod-input").value;

        // Formatear lastmod al formato requerido
        if (lastmod) {
            lastmod = new Date(lastmod).toISOString().replace(/.\d{3}Z$/, "+00:00");
        } else {
            lastmod = new Date().toISOString().replace(/.\d{3}Z$/, "+00:00");
        }

        sectionUrls.forEach(url => {
            urls.push({ url: url.trim(), changefreq, priority, lastmod });
        });
    });

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
