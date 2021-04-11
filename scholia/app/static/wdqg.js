(() => {
  let api, lang;
  function init() {
    lang = (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage;
    lang = typeof lang === "string" ? lang.split("-").shift() : undefined;

    api = new wikibase.queryService.api.Wikibase(
      "https://www.wikidata.org/w/api.php",
      lang,
    );
  }
  init();

  function replaceElem(old, elem) {
    old.parentNode.replaceChild(elem, old);
  }
  function runSparql(q) {
    let sparqlApi = new wikibase.queryService.api.Sparql(
      "https://query.wikidata.org/sparql",
      lang,
    );
    return new Promise((resolve, reject) =>
      sparqlApi.query(q).done(() => {
        resolve(sparqlApi);
      }).fail(() => {
        reject(sparqlApi.getError());
      })
    );
  }
  async function sparqlElem({ elem, sparql }) {
    sparql = sparql.trim();
    let newElem = document.createElement("div");
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
    })[viewType] || viewType) + "ResultBrowser";


    try {
      let sparqlApi = await runSparql(sparql);
      let resultBrowser = new wikibase.queryService.ui
        .resultBrowser[viewType]();
      elem.innerHTML = "";
      resultBrowser.setSparqlApi(sparqlApi);
      var options = new wikibase.queryService.ui.resultBrowser.helper.Options(
        {},
      );
      resultBrowser.setOptions(options);
      resultBrowser.setResult(sparqlApi.getResultRawData());
      resultBrowser.draw($(elem));
    } catch (e) {
      elem.innerText = "Error running sparql query:" + String(e);
      throw e;
    }
  }
  async function main() {
    const elements = document.querySelectorAll(
      "script[type='sparql/wikidata-query-gui']",
    );
    for (const elem of elements) {
      const sparql = elem.innerText;
      sparqlElem({ elem, sparql });
    }
  }

  window.addEventListener("load", main); // used for development, to avoid confusion due to load errors
  //window.addEventListener('DOMContentLoaded', main); // this is faster
})();
