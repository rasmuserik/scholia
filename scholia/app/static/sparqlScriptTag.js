//
// Code for handling <script type=sparql/scholia-visualisation>...
//
(() => {
  //
  // Definition of visualisation types;
  //
  let visualisations = {
    BarChart: { type: "inline" },
    BubbleChart: { type: "inline" },
    Dimensions: { type: "iframe", resultBrowser: "MultiDimension" },
    Graph: { type: "inline" },
    ImageGrid: { type: "iframe", resultBrowser: "Image" },
    LineChart: { type: "inline" },
    Map: { type: "iframe", resultBrowser: "Coordinate" },
    ScatterChart: { type: "iframe" },
    Table: { type: "iframe" },
    TimeLine: { type: "iframe" },
    Tree: { type: "iframe" },
    TreeMap: { type: "iframe" },
  };
  for (const name in visualisations) {
    visualisations[name].resultBrowser = wikibase.queryService.ui
      .resultBrowser[
        (visualisations[name].resultBrowser || name) + "ResultBrowser"
      ];
    visualisations[name].name = name;
  }

  //
  // Code for executing and rendering sparql
  //
  function runSparql(q) {
    let lang = (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage;
    lang = typeof lang === "string" ? lang.split("-").shift() : undefined;
    let sparqlApi = new wikibase.queryService.api.Sparql(
      "https://query.wikidata.org/sparql",
      lang,
    );
    return new Promise((resolve, reject) =>
      sparqlApi.query(q).done(() => {
        resolve(sparqlApi);
      }).fail(() => {
        reject(sparqlApi);
      })
    );
  }

  async function sparqlElem({ elem, query }) {
    query = query.trim();

    let match = query.match(/#defaultView:[^a-zA-Z]*([a-zA-Z]*)(.*)/);
    let view = visualisations[match && match[1] || "Table"];
    try {
      if (!view) {
        throw new Error("Invalid view: " + match[0]);
      }
      if (view.type === "inline") {
        elem = replaceElem(elem, inheritElem(elem, "div"));
        elem.innerText = "executing query";

        let sparqlApi = await runSparql(query);
        let resultBrowser = new view.resultBrowser();
        elem.innerHTML = "";
        resultBrowser.setSparqlApi(sparqlApi);
        var options = new wikibase.queryService.ui.resultBrowser.helper.Options(
          {},
        );
        resultBrowser.setOptions(options);
        resultBrowser.setResult(sparqlApi.getResultRawData());
        resultBrowser.draw($(elem));

        // Hack to resize
        elem.children[0].style.height = elem.clientHeight + "px";
        if (view.name === "BarChart") {
          resultBrowser._drawChart(250, true);
        }
      } else if (view.type === "iframe") {
        let iframe = replaceElem(elem, inheritElem(elem, "iframe"));
        iframe.src = "https://query.wikidata.org/embed.html#" +
          encodeURIComponent(query);
      }
    } catch (e) {
      elem.innerText = "Error running sparql query:" + String(e);
      throw e;
    }
  }

  //
  // Find and replace <script type=sparql/scholia-visualised>...
  //
  async function main() {
    const elements = document.querySelectorAll(
      "script[type='sparql/scholia-visualised']",
    );
    for (const elem of elements) {
      sparqlElem({ elem, query: elem.innerText });
    }
  }
  window.addEventListener("load", main); // used for development, to avoid confusion due to load errors
  //window.addEventListener('DOMContentLoaded', main); // this is faster

  //
  // Utility functions
  //
  function inheritElem(elem, type) {
    let newElem = document.createElement(type);
    newElem.style.cssText = elem.style.cssText;
    if (elem.id) newElem.id = elem.id;
    if (elem.className) newElem.className = elem.className;
    return newElem;
  }
  function replaceElem(elem, newElem) {
    elem.parentNode.replaceChild(newElem, elem);
    return newElem;
  }

})();
