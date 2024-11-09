function generateSitemap() {
    const sections = document.querySelectorAll(".form-section");
    let urls = [];
    let allValid = true;

    sections.forEach(section => {
        const urlsText = section.querySelector(".url-input").value.trim();
        const sectionUrls = urlsText.split("\n").filter(url => url.trim() !== "");
        const changefreq = section.querySelector(".frequency-select").value;
        let priority = parseFloat(section.querySelector(".priority-input").value) || 0.5;

        // Obteniendo la fecha y hora local
        const lastmodDate = new Date(section.querySelector(".lastmod-input").value);
        const localTime = new Date();
        lastmodDate.setHours(localTime.getHours(), localTime.getMinutes(), localTime.getSeconds());

        // Convertir a formato ISO con offset de la zona horaria
        const offset = -localTime.getTimezoneOffset();
        const offsetHours = String(Math.floor(Math.abs(offset / 60))).padStart(2, '0');
        const offsetMinutes = String(Math.abs(offset % 60)).padStart(2, '0');
        const offsetSign = offset >= 0 ? "+" : "-";
        const lastmod = `${lastmodDate.toISOString().slice(0, 10)}T${lastmodDate.toTimeString().slice(0, 8)}${offsetSign}${offsetHours}:${offsetMinutes}`;

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

    // Limpiar el contenido de XML si hay URLs o prioridades inválidas
    if (!allValid) {
        document.getElementById("xml-output").textContent = ""; // Limpia el campo XML
        document.getElementById("output-section").style.display = "none"; // Oculta la sección de salida
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