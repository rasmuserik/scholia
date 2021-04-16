// simple nodejs-script that bundles wikidata-query-gui
const fs = require('fs');
function bundle(bundles) {
  for(const dst in bundles) {
    let result = "";
    for(const src of bundles[dst]) {
      result += `// << ${src}\n`
      result += fs.readFileSync(src, 'utf-8');
    }
    fs.writeFileSync(dst, result);
  }
}
const bundles = {
  "bundle.wdqg.vendor.js": [
    //already-loaded "wikidata-query-gui/node_modules/jquery/dist/jquery.js",
    "wikidata-query-gui/node_modules/underscore/underscore.js",
    //already loaded "wikidata-query-gui/node_modules/bootstrap/dist/js/bootstrap.js",
    /* not editable query
    "wikidata-query-gui/node_modules/codemirror/lib/codemirror.js",
    "wikidata-query-gui/node_modules/codemirror/mode/sparql/sparql.js",
    "wikidata-query-gui/node_modules/codemirror/mode/htmlmixed/htmlmixed.js",
    "wikidata-query-gui/node_modules/codemirror/mode/xml/xml.js",
    "wikidata-query-gui/node_modules/codemirror/mode/clike/clike.js",
    "wikidata-query-gui/node_modules/codemirror/mode/php/php.js",
    "wikidata-query-gui/node_modules/codemirror/mode/javascript/javascript.js",
    "wikidata-query-gui/node_modules/codemirror/mode/octave/octave.js",
    "wikidata-query-gui/node_modules/codemirror/mode/python/python.js",
    "wikidata-query-gui/node_modules/codemirror/mode/ruby/ruby.js",
    "wikidata-query-gui/node_modules/codemirror/mode/r/r.js",
    "wikidata-query-gui/node_modules/codemirror/addon/display/autorefresh.js",
    "wikidata-query-gui/node_modules/codemirror/addon/hint/show-hint.js",
    "wikidata-query-gui/node_modules/codemirror/addon/display/placeholder.js",
    "wikidata-query-gui/node_modules/codemirror/addon/display/fullscreen.js",
    "wikidata-query-gui/node_modules/codemirror/addon/comment/comment.js",
    */ 
    /*
    "wikidata-query-gui/node_modules/bootstrap-table/dist/bootstrap-table.js",
    "wikidata-query-gui/node_modules/bootstrap-table/dist/extensions/mobile/bootstrap-table-mobile.js",
    "wikidata-query-gui/node_modules/bootstrap-table/dist/extensions/key-events/bootstrap-table-key-events.js",
    "wikidata-query-gui/node_modules/bootstrap-table/dist/extensions/cookie/bootstrap-table-cookie.js",
    "wikidata-query-gui/node_modules/bootstrap-toggle/js/bootstrap-toggle.min.js",
    */
    //"wikidata-query-gui/node_modules/ekko-lightbox/dist/ekko-lightbox.js",
    "wikidata-query-gui/node_modules/leaflet/dist/leaflet.js",
    "wikidata-query-gui/node_modules/leaflet-fullscreen/dist/Leaflet.fullscreen.js",
    "wikidata-query-gui/node_modules/leaflet-zoombox/L.Control.ZoomBox.js",
    "wikidata-query-gui/node_modules/leaflet.markercluster/dist/leaflet.markercluster.js",
    "wikidata-query-gui/node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.js",
    "wikidata-query-gui/node_modules/leaflet-minimap/dist/Control.MiniMap.min.js",
    "wikidata-query-gui/node_modules/d3/d3.js",
    "wikidata-query-gui/node_modules/dimple-js/dist/dimple.latest.js",
    //"wikidata-query-gui/node_modules/js-cookie/src/js.cookie.js",
    "wikidata-query-gui/node_modules/vis/dist/vis.js",
    //"wikidata-query-gui/node_modules/select2/dist/js/select2.js",
    "wikidata-query-gui/node_modules/moment/min/moment-with-locales.js",
    "wikidata-query-gui/node_modules/wellknown/wellknown.js",
    "wikidata-query-gui/node_modules/downloadjs/download.js",
    //"wikidata-query-gui/node_modules/jqcloud2/dist/jqcloud.js",
    //"wikidata-query-gui/node_modules/gijgo/js/gijgo.min.js",
    "wikidata-query-gui/vendor/sparqljs/dist/sparqljs-browser-min.js",
    //"wikidata-query-gui/vendor/bootstrapx-clickover/bootstrapx-clickover.js",
    /*
    "wikidata-query-gui/node_modules/jstree/dist/jstree.js",
    "wikidata-query-gui/node_modules/jquery.uls/src/jquery.uls.data.js",
    "wikidata-query-gui/node_modules/jquery.uls/src/jquery.uls.data.utils.js",
    "wikidata-query-gui/node_modules/jquery.uls/src/jquery.uls.lcd.js",
    "wikidata-query-gui/node_modules/jquery.uls/src/jquery.uls.languagefilter.js",
    "wikidata-query-gui/node_modules/jquery.uls/src/jquery.uls.core.js",
    "wikidata-query-gui/node_modules/cldrpluralruleparser/src/CLDRPluralRuleParser.js",
    "wikidata-query-gui/node_modules/@wikimedia/jquery.i18n/src/jquery.i18n.js",
    "wikidata-query-gui/node_modules/@wikimedia/jquery.i18n/src/jquery.i18n.messagestore.js",
    "wikidata-query-gui/node_modules/@wikimedia/jquery.i18n/src/jquery.i18n.fallbacks.js",
    "wikidata-query-gui/node_modules/@wikimedia/jquery.i18n/src/jquery.i18n.parser.js",
    "wikidata-query-gui/node_modules/@wikimedia/jquery.i18n/src/jquery.i18n.emitter.js",
    "wikidata-query-gui/node_modules/@wikimedia/jquery.i18n/src/jquery.i18n.language.js",
    "wikidata-query-gui/node_modules/mathjax/es5/mml-chtml.js",
    "wikidata-query-gui/vendor/bootstrap-tags/js/bootstrap-tags.min.js",
    */
  ],
  "bundle.wdqg.js": [
    //"wikidata-query-gui/wikibase/config.js",
    "wikidata-query-gui/wikibase/queryService/ui/i18n/getMessage.js",
    "wikidata-query-gui/wikibase/queryService/ui/dialog/QueryExampleDialog.js",
    "wikidata-query-gui/wikibase/queryService/ui/ResultView.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/helper/FormatterHelper.js",
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/helper/Options.js",
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
    "wikidata-query-gui/wikibase/queryService/ui/resultBrowser/PolestarResultBrowser.js",
    "wikidata-query-gui/wikibase/queryService/api/Sparql.js",
    //"wikidata-query-gui/wikibase/queryService/api/QuerySamples.js",
    "wikidata-query-gui/wikibase/queryService/api/Wikibase.js",
    //"wikidata-query-gui/wikibase/queryService/api/Tracking.js",
    //"wikidata-query-gui/wikibase/queryService/api/UrlShortener.js",
    "wikidata-query-gui/wikibase/queryService/RdfNamespaces.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/QueryHelper.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/SparqlQuery.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/SelectorBox.js",
    "wikidata-query-gui/wikibase/queryService/ui/queryHelper/QueryTemplate.js",
    //"wikidata-query-gui/wikibase/queryService/ui/toolbar/ActionBar.js",
  ],
};
bundle(bundles);
