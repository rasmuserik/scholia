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
  /** Map "#defaultView:..." in sparql to wikibase query service class name */
  function viewType(name) {
    name = ({
      Dimensions: "MultiDimension",
      Map: "Coordinate",
      ImageGrid: "Image",
    })[name] || name;
    return name + "ResultBrowser";
  }
  async function sparqlElem({ elem, sparql }) {
    let newElem = document.createElement("div");
    replaceElem(elem, newElem);
    elem = newElem;
    elem.innerText = "executing query";
    sparql = sparql.trim();
    try {
      let sparqlApi = await runSparql(sparql);
      let resultBrowser = new wikibase.queryService.ui
        .resultBrowser[viewType("Graph")]();
      elem.innerHTML = "";
      resultBrowser.setSparqlApi(sparqlApi);
      var options = new wikibase.queryService.ui.resultBrowser.helper.Options(
        {},
      );
      resultBrowser.setOptions(options);
      resultBrowser.setResult(sparqlApi.getResultRawData());

      resultBrowser.draw($(elem));

      console.log(resultBrowser);
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
