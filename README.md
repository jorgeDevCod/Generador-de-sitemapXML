# Generador de Sitemap XML

Esta aplicación permite crear un archivo `sitemap.xml` de manera fácil y rápida para mejorar el SEO de sitios web. La aplicación permite agregar múltiples URLs, configurar opciones como la frecuencia de cambio y la prioridad, y exportar el resultado en un archivo XML compatible con los motores de búsqueda.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Archivos del Proyecto](#archivos-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Personalización](#personalización)

## Requisitos

- Navegador web (Chrome, Firefox, Safari, Edge, etc.).
- Archivos `index.html`, `app.js` y `style.css` en la misma carpeta.

## Archivos del Proyecto

- **index.html**: La interfaz principal de la aplicación.
- **app.js**: Contiene el código JavaScript para agregar secciones, generar y exportar el archivo `sitemap.xml`.
- **style.css**: Define los estilos de la interfaz.

## Instalación

1. Clona este repositorio o descarga el archivo ZIP.

Abre el archivo index.html en tu navegador para iniciar la aplicación.

# Uso

## Agregar URLs

Haz clic en el botón **Agregar Sección de URLs** para añadir una nueva sección. En el campo de texto, ingresa una **URL por línea**. Luego, puedes configurar las siguientes opciones para cada URL:

- **Frecuencia de cambio**: Selecciona con qué frecuencia cambia la página (opciones disponibles: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`).
- **Prioridad**: Ingresa un valor de prioridad entre **0.0** y **1.0**, siendo **1.0** la mayor prioridad.
- **Última modificación**: La fecha actual se asigna automáticamente, pero puedes seleccionar una fecha diferente si lo deseas.

## Generar Sitemap

Haz clic en el botón **Generar Sitemap XML** para crear el archivo **sitemap.xml**. El resultado se mostrará en la sección de salida del sitio.

## Exportar el Sitemap

Para descargar el archivo **sitemap.xml**, haz clic en el botón **Exportar XML**. Esto generará un archivo descargable con el contenido del sitemap en formato XML.

## Ejemplo de Estructura Generada

Aquí tienes un ejemplo de cómo se genera la estructura del sitemap para una URL:

```xml
<url>
    <loc>https://example.com</loc>
    <lastmod>2024-11-08T15:45:00+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
</url>

