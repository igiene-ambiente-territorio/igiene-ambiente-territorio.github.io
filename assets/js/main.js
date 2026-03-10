// main javascript for site

import Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm";

// =============================
// CONFIGURAZIONE
// =============================
const showSlidesLink = true;
const showPrintableSlides = false;
const showMapLink = true;
const showTextLink = true;

const sheetBaseUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtHwSLmnxjW2c-PZP6IFxxYRSLENYdplcf_wxcAYo2j5mStHoZpgYUCObuQS7M3a06293CkZA_2dKr/pub?gid=0&single=true&output=csv";

const slidesBaseUrl = "https://insegnante076.github.io/teachingTools/tools/reveal-md-slideshow/?csv=" + encodeURIComponent(sheetBaseUrl) + "&id=";
const textBaseUrl = "https://insegnante076.github.io/teachingTools/tools/html-content-concat-viewer/?csv=" + encodeURIComponent(sheetBaseUrl) + "&id=";

Papa.parse(sheetBaseUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function(results) {

        const container = document.getElementById("content");
        container.innerHTML = "";

        results.data.forEach((row) => {

            const card = document.createElement("div");
            card.className = "card";

            // titolo
            const h2 = document.createElement("h2");
            h2.textContent = row.title;
            card.appendChild(h2);

            // content HTML
            if(row.content && row.content.trim() !== ""){
                const contentDiv = document.createElement("div");
                contentDiv.innerHTML = row.content;
                contentDiv.style.marginBottom = "15px";
                card.appendChild(contentDiv);
            }

            const links = document.createElement("div");
            links.className = "links";

            const fullSlidesUrl = slidesBaseUrl + row.id;
            const fullTextUrl = textBaseUrl + row.id;

            // verifica contenuto slides
            const hasSlidesContent = ["slides_p1","slides_p2","slides_p3"].some(col => {
                return row[col] && row[col].trim() !== "";
            });

            // link slides
            if(showSlidesLink && hasSlidesContent){
                const a = document.createElement("a");
                a.href = fullSlidesUrl;
                a.textContent = "Slides";
                a.target="_blank";
                a.className="button";
                links.appendChild(a);
            }

            // slides stampabili
            if(showPrintableSlides && hasSlidesContent){
                const a = document.createElement("a");
                a.href = fullSlidesUrl + "&print-pdf";
                a.textContent="Slides stampabili";
                a.target="_blank";
                a.className="button";
                links.appendChild(a);
            }

            // link mappa
            if(showMapLink && row.map_html && row.map_html.trim() !== ""){
                const a = document.createElement("a");
                a.href="#";
                a.textContent="Mappa";
                a.className="button";

                a.onclick=function(e){
                    e.preventDefault();
                    const newWindow = window.open();
                    newWindow.document.write(row.map_html);
                    newWindow.document.close();
                };

                links.appendChild(a);
            }

            // verifica contenuto testo
            const hasTextContent = ["text_p1","text_p2","text_p3"].some(col => {
                return row[col] && row[col].trim() !== "";
            });

            if(showTextLink && hasTextContent){
                const a = document.createElement("a");
                a.href = fullTextUrl;
                a.textContent="Testo didattico";
                a.target="_blank";
                a.className="button";
                links.appendChild(a);
            }

            card.appendChild(links);
            container.appendChild(card);

        });

    },

    error: function(err){
        document.getElementById("content").innerText = "Error loading data.";
        console.error(err);
    }

});
