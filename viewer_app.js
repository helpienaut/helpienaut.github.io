var app = angular.module('viewer_app',['ngSanitize'])
.controller('viewer_controller',function($scope,$sce){
  $scope.viewer_markdown="";
  $scope.viewer_rendered = function(){

    var yourString= md.render($scope.viewer_markdown);
    var count=0;
    var urls=yourString.match(/(?:^|[^"'])(\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim);
    // Make an array of urls
    if(urls){
      urls.forEach(function(v,i,a){
          var n =    yourString.indexOf(v,count); //get location of string
          if(v.match(/\.(png|jpg|jpeg|gif)$/)===null){// Check if image
              // If link replace yourString with new  anchor tag
              yourString  = strSplice(yourString,n,v.length,'<a href="'+v+'">'+v+'</a>');
              count += (v.length*2)+16;// Increase count incase there are multiple of the same url.
          }else{
              // If link replace yourString with img tag
              yourString  = strSplice(yourString,n,v.length,'<img src="'+v+'"/>');
             count += v.length+14;// Increase count incase there are multiple of the same url.
          }
      });
    }
    return yourString;
  };
});
// A function to splice strings that I found on another StackOverflow Question.
function strSplice(str, index, count, add) {
  return str.slice(0, index) + (add || "") + str.slice(index + count);
}
var md = new Remarkable('full', {
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       true,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      false,         // autoconvert URL-like texts to links
  linkTarget:   '',           // set target to open link in

  // Enable some language-neutral replacements + quotes beautification
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if input not changed
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return ''; // use external default escaping
  }
});
