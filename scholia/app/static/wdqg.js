function replaceElem(old, elem) {
  old.parentNode.replaceChild(elem, old);
}
async function sparqlElem({ elem, sparql }) {
  let pre = document.createElement("pre");
  pre.innerText = sparql;
  replaceElem(elem, pre);

  let lang = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;
  lang = typeof lang === 'string' ? lang.split("-").shift() : undefined;

  let api = new wikibase.queryService.api.Wikibase(
    "https://www.wikidata.org/w/api.php",
    lang,
  );
  let sparqlApi = new wikibase.queryService.api.Sparql(
    "https://query.wikidata.org/sparql",
    lang,
  );
  let resultView = new wikibase.queryService.ui.ResultView(
    sparqlApi,
    {getExamples: async () => []}, //querySamplesApi,
    api,
    null, //codeSamplesApi,
    null, //shortenApi,
    null,
    "https://query-builder-test.toolforge.org/",
  );
  let qh = new wikibase.queryService.ui.queryHelper.QueryHelper(api, sparqlApi);
  console.log(resultView);
  await resultView.draw(sparql);
  console.log(resultView);
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

function createEmbedElem() {
  /*
   conflicting ids:

   #result-browser-menu – ResultView.js, TableResultBrowser.js
   #download* – ResultView.js
   #download-button #open-example #help-label, #examples-label, #tools-label, #language-toggle – App.js



  let content = `<div class="logo"></div>
		<noscript>
			<div class="row action-bar" style="display: block">
				<div class="message">
					<div class="label label-warning">
						Please enable JavaScript or use a browser that supports it.
					</div>
				</div>
			</div>
		</noscript>

		<a class="edit-link brand" target="_blank" rel="noopener" href="./"><img width="24" height="15" src=""><span></span></a>
		<div class="header-toolbar">
			<ul id="result-browser-menu">
			</ul>
		</div>

		<div class="toolbar-right">
			<ul id="embed-right-menu">
				<li>
					<a href="#" target="_blank" rel="noopener" class="edit edit-link toolbar-right-item" data-toggle="popover">
						<div data-toggle="tooltip" data-i18n="[title]wdqs-embed-button-edit-query-title">
							<span class="glyphicon glyphicon-pencil toolbar-right-icon" aria-hidden="true"></span><span class="toolbar-right-label" data-i18n="wdqs-embed-button-edit-query"></span>
						</div>
					</a>
				</li>
				<li>
					<a class="link edit-link toolbar-right-item" target="_blank" rel="noopener" data-i18n="[title]wdqs-embed-button-edit-code-title">
						<span class="glyphicon glyphicon-edit toolbar-right-icon" aria-hidden="true"></span> <span class="toolbar-right-label" data-i18n="wdqs-embed-button-edit-code"></span>
					</a>
				</li>
				<li>
					<a href="https://www.wikidata.org/wiki/Special:MyLanguage/Wikidata:SPARQL_query_service/Wikidata_Query_Help" target="_blank" class="toolbar-right-item">
						<span class="glyphicon glyphicon-question-sign toolbar-right-icon" aria-hidden="true"></span> <span class="toolbar-right-label" data-i18n="wdqs-app-button-help" id="help-label"></span>
					</a>
				</li>
				<li>
					<a class="toolbar-right-item" href="#" id="open-example" data-toggle="modal" data-target="#QueryExamples">
						<span class="fa fa-folder-open-o toolbar-right-icon"></span> <span class="toolbar-right-label" data-i18n="wdqs-app-button-examples" id="examples-label"></span>
					</a>
				</li>
				<li>
					<a href="#" class="shareQuery shortUrlTrigger result toolbar-right-item" target="_blank" data-i18n="[title]wdqs-app-button-link-title" data-toggle="popover">
						<span class="glyphicon glyphicon-link toolbar-right-icon" aria-hidden="true"> </span> <span class="toolbar-right-label" data-i18n="wdqs-app-button-link"></span>
					</a>
				</li>
				<li class="download-dropdown">
					<a id="download-button" href="#" class="toolbar-right-item" data-toggle="dropdown" class="dropdown-toggle" data-placement="top" data-i18n="[title]wdqs-app-button-download-title">
						<span class="glyphicon glyphicon-download-alt toolbar-right-icon" aria-hidden="true"></span> <span data-i18n="wdqs-app-button-download" class="toolbar-right-label"></span>
						<span class="dropup"><span class="caret download-caret"></span></span>
					</a>
					<ul class="dropdown-menu download-dropdown-menu" role="menu">
							<li><a id="downloadJSON" href="#"><span class="fa fa-file-code-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-json"></span></a></li>
							<li><a id="downloadFull-JSON" href="#"><span class="fa fa-file-code-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-json-verbose"></span></a></li>
							<li role="separator" class="divider"></li>
							<li><a id="downloadSimple-TSV" href="#"><span class="fa fa-file-excel-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-tsv"></span></a></li>
							<li><a id="downloadTSV" href="#"><span class="fa fa-file-excel-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-tsv-verbose"></span></a></li>
							<li role="separator" class="divider"></li>
							<li><a id="downloadCSV" href="#"><span class="fa fa-file-excel-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-csv"></span></a></li>
							<li role="separator" class="divider"></li>
							<li><a id="downloadHTML" href="#"><span class="fa fa-file-code-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-html"></span></a></li>
							<li role="separator" class="divider"></li>
							<li><a id="downloadSVG" href="#"><span class="fa fa-file-image-o" aria-hidden="true"></span> <span data-i18n="wdqs-app-result-svg"></span></a></li>
					</ul>
				</li>
				<li>
					<span class="query-total"><span class="label label-default" id="response-summary"></span></span>
				</li>
			</ul>
		</div>
		<div class="action-bar">
			<div class="message"></div>
		</div>
		<div id="query-result">Test result</div>
		<div id="query-error" class="panel-heading">Test error</div>

		<div id="loading-spinner">
			<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
			<span class="sr-only">Loading...</span>
		</div>
		<div id="explorer-dialogs">
			<div class="explorer-dialog">
				<div data-role="header" class="modal-header clearfix explorer-header">
					<h3 data-role="title" class="modal-title pull-left explorer-title">Explorer</h3>
					<button data-role="close" type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div data-role="body" class="explorer-body">
				</div>
			</div>
		</div>

	<div class="expand-type" data-toggle="tooltip" data-i18n="[title]wdqs-embed-explorer-button-outgoing">
		<input id="expand-type-switch" type="checkbox" data-onstyle="primary" data-size="small">
	</div>

	<!-- Query Example Modal -->
	<div class="modal fade QueryExamples" id="QueryExamples" tabindex="-1" role="dialog" aria-labelledby="QueryExamplesModalLabel">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-body">
					<div class="tagCloud"></div>
					<div class="tagFilter"></div>
					<div class="input-group">
						<span class="input-group-addon"><span class="glyphicon glyphicon-filter" aria-hidden="true"></span></span>
						<input type="text" class="tableFilter form-control" placeholder="Type to filter"/>
						<span class="input-group-addon"><span class="badge count"></span></span>
					</div>
					<div class="exampleTable">
						<table class="table">
						    <tbody class="searchable">
						    </tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>`
}
