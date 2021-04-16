(() => {
  // 
  // Utility functions
  //
  function replaceElem(old, elem) {
    old.parentNode.replaceChild(elem, old);
  }

  // 
  // Definition of visualisation types;
  let inline = {};
  let iframe = {};
  let visualisations = {
    BarChart: inline,
    BubbleChart: inline,
    Graph: inline,
    ImageGrid: iframe,
    LineChart: inline,
    Map: iframe,
    ScatterChart: iframe,
    Table: iframe,
    TimeLine: iframe,
    Tree: iframe,
    TreeMap: iframe,
  }

  /** Instantiate wikibase.queryService.api.Sparql and execute query.  */
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
  async function sparqlElem({ elem, sparql }) {
    sparql = sparql.trim();
    let newElem = document.createElement("div");
    newElem.style.cssText = elem.style.cssText;
    if(elem.id) newElem.id = elem.id;
    if(elem.className) newElem.className= elem.className;
    replaceElem(elem, newElem);
    elem = newElem;
    elem.innerText = "executing query";

    // experiment with sizing
    Object.assign(elem.style, {
      display: 'inline-block',
      height: '300px',
      width: '500px',
    });

    let viewType = 'Table';
    let m = sparql.match(/#defaultView:[^a-zA-Z]*([a-zA-Z]*)(.*)/)
    if(m && m[1]) {
      viewType = m[1];
    }
    viewType = (({
      Dimensions: "MultiDimension",
      Map: "Coordinate",
      ImageGrid: "Image",
    })[viewType] || viewType);


    try {
      let sparqlApi = await runSparql(sparql);
      let resultBrowser = new wikibase.queryService.ui
        .resultBrowser[viewType + "ResultBrowser"]();
      elem.innerHTML = "";
      resultBrowser.setSparqlApi(sparqlApi);
      var options = new wikibase.queryService.ui.resultBrowser.helper.Options(
        {},
      );
      resultBrowser.setOptions(options);
      resultBrowser.setResult(sparqlApi.getResultRawData());
      resultBrowser.draw($(elem));

      // Hack to resize 
      elem.children[0].style.height = "300px";
      if(viewType === "BarChart") {
        resultBrowser._drawChart(250, true);
      }
      console.log('here', elem.children[0]);
    } catch (e) {
      elem.innerText = "Error running sparql query:" + String(e);
      throw e;
    }
  }
  async function main() {
    const elements = document.querySelectorAll(
      "script[type='sparql/scholia-visualised']",
    );
    for (const elem of elements) {
      const sparql = elem.innerText;
      sparqlElem({ elem, sparql });
    }
  }

  window.addEventListener("load", main); // used for development, to avoid confusion due to load errors
  //window.addEventListener('DOMContentLoaded', main); // this is faster
})();
