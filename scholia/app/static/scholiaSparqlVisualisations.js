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
    Dimensions: { type: "inline", resultBrowser: "MultiDimension" },
    Graph: { type: "inline" },
    ImageGrid: { type: "iframe", resultBrowser: "Image" }, // TODO styling
    LineChart: { type: "inline" },
    Map: { type: "inline", resultBrowser: "Coordinate" },
    ScatterChart: { type: "inline" },
    Table: { type: "inline" },
    Timeline: { type: "iframe" }, // TODO: bug: "something is wrong with the timeline scale"
    Tree: { type: "inline" },
    TreeMap: { type: "inline" },
  };

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


async function sparqlToIframe(sparql, element, filename) {
    await dependencies;
let elem = document.querySelector(element);
      sparqlElem({ elem, query: sparql});
/*
    $(element).attr('src', url);
    $(element).parent().after(
        '<span style="float:right; font-size:smaller"><a href="https://github.com/fnielsen/scholia/blob/master/scholia/app/templates/' + filename + '">' +
            filename.replace("_", ": ") +
            '</a></span>');
*/
};

  window.sparqlToIframe = sparqlToIframe;
  //
  // Find and replace <script type=sparql/scholia-visualised>...
  //
  let dependencies = loadDependencies();
  async function main() {
    await dependencies;

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

  function loadScript(src) {
    return new Promise((resolve, reject) => {
    let elem = document.createElement('script');
      elem.src = '/static/' + src;
      elem.onload = resolve;
      elem.onerror = reject;
    document.head.appendChild(elem);
    });
  }

  async function loadDependencies() {
    await Promise.all([
    "wikidata-query-gui/dependencies/underscore/underscore.js",
    "wikidata-query-gui/dependencies/leaflet/dist/leaflet.js",
    "wikidata-query-gui/dependencies/d3/d3.js",
    "wikidata-query-gui/dependencies/moment/min/moment-with-locales.js",
    "wikidata-query-gui/dependencies/wellknown/wellknown.js",
    "wikidata-query-gui/dependencies/downloadjs/download.js",
    "wikidata-query-gui/dependencies/sparqljs/dist/sparqljs-browser-min.js",
    ].map(loadScript));
    await Promise.all([
    "wikidata-query-gui/wikibase/queryService/ui/i18n/getMessage.js",
    "wikidata-query-gui/wikibase/queryService/ui/dialog/QueryExampleDialog.js",
    "wikidata-query-gui/wikibase/queryService/ui/ResultView.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/helper/FormatterHelper.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/helper/Options.js",
    "wikidata-query-gui/wikibase/queryService/api/Sparql.js",
    "wikidata-query-gui/wikibase/queryService/api/Wikibase.js",
    "wikidata-query-gui/wikibase/queryService/RdfNamespaces.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/QueryHelper.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/SparqlQuery.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/SelectorBox.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/QueryTemplate.js",
    "wikidata-query-gui/dependencies/leaflet-fullscreen/dist/Leaflet.fullscreen.js",
    "wikidata-query-gui/dependencies/leaflet-zoombox/L.Control.ZoomBox.js",
    "wikidata-query-gui/dependencies/leaflet.markercluster/dist/leaflet.markercluster.js",
    "wikidata-query-gui/dependencies/leaflet.locatecontrol/dist/L.Control.Locate.min.js",
    "wikidata-query-gui/dependencies/leaflet-minimap/dist/Control.MiniMap.min.js",
    "wikidata-query-gui/dependencies/dimple-js/dist/dimple.latest.js",
    "wikidata-query-gui/dependencies/vis/dist/vis.js",
    ].map(loadScript));
    for(const script of [
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/AbstractResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/AbstractChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/AbstractDimpleChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/ImageResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/TableResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/CoordinateResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/TreeMapResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/TreeResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/BubbleChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/LineChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/BarChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/ScatterChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/AreaChartResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/TimelineResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/MultiDimensionResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/GraphResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/GraphResultBrowserNodeBrowser.js",
      "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/PolestarResultBrowser.js"]) 
      await loadScript(script);


    for (const name in visualisations) {
      visualisations[name].resultBrowser = wikibase.queryService.ui
      .resultBrowser[
        (visualisations[name].resultBrowser || name) + "ResultBrowser"
      ];
      visualisations[name].name = name;
    }
  }

})();
