// ----------------------------------------------------------------------------
// markItUp! Universal MarkUp Engine, JQuery plugin
// v 1.1.x
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) 2007-2010 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------

!function($){$.fn.markItUp=function(settings,extraSettings){var method,params,options,ctrlKey,shiftKey,altKey;ctrlKey=shiftKey=altKey=!1,"string"==typeof settings&&(method=settings,params=extraSettings),options={id:"",nameSpace:"",root:"",previewHandler:!1,previewInWindow:"",previewInElement:"",previewAutoRefresh:!0,previewPosition:"after",previewTemplatePath:"~/templates/preview.html",previewParser:!1,previewParserPath:"",previewParserVar:"data",previewParserAjaxType:"POST",resizeHandle:!0,beforeInsert:"",afterInsert:"",onEnter:{},onShiftEnter:{},onCtrlEnter:{},onTab:{},markupSet:[{}]},$.extend(options,settings,extraSettings),options.root||$("script").each(function(e,t){miuScript=$(t).get(0).src.match(/(.*)jquery\.markitup(\.pack)?\.js$/),null!==miuScript&&(options.root=miuScript[1])});var uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},matched=uaMatch(navigator.userAgent),browser={};return matched.browser&&(browser[matched.browser]=!0,browser.version=matched.version),browser.chrome?browser.webkit=!0:browser.webkit&&(browser.safari=!0),this.each(function(){function localize(e,t){return t?e.replace(/("|')~\//g,"$1"+options.root):e.replace(/^~\//,options.root)}function init(){id="",nameSpace="",options.id?id='id="'+options.id+'"':$$.attr("id")&&(id='id="markItUp'+$$.attr("id").substr(0,1).toUpperCase()+$$.attr("id").substr(1)+'"'),options.nameSpace&&(nameSpace='class="'+options.nameSpace+'"'),$$.wrap("<div "+nameSpace+"></div>"),$$.wrap("<div "+id+' class="markItUp"></div>'),$$.wrap('<div class="markItUpContainer"></div>'),$$.addClass("markItUpEditor"),header=$('<div class="markItUpHeader"></div>').insertBefore($$),$(dropMenus(options.markupSet)).appendTo(header),footer=$('<div class="markItUpFooter"></div>').insertAfter($$),options.resizeHandle===!0&&browser.safari!==!0&&(resizeHandle=$('<div class="markItUpResizeHandle"></div>').insertAfter($$).bind("mousedown.markItUp",function(e){var t,r,i=$$.height(),n=e.clientY;t=function(e){return $$.css("height",Math.max(20,e.clientY+i-n)+"px"),!1},r=function(e){return $("html").unbind("mousemove.markItUp",t).unbind("mouseup.markItUp",r),!1},$("html").bind("mousemove.markItUp",t).bind("mouseup.markItUp",r)}),footer.append(resizeHandle)),$$.bind("keydown.markItUp",keyPressed).bind("keyup",keyPressed),$$.bind("insertion.markItUp",function(e,t){t.target!==!1&&get(),textarea===$.markItUp.focused&&markup(t)}),$$.bind("focus.markItUp",function(){$.markItUp.focused=this}),options.previewInElement&&refreshPreview()}function dropMenus(markupSet){var ul=$("<ul></ul>"),i=0;return $("li:hover > ul",ul).css("display","block"),$.each(markupSet,function(){var button=this,t="",title,li,j;if(title=button.title?button.key?(button.title||"")+" [Ctrl+"+button.key+"]":button.title||"":button.key?(button.name||"")+" [Ctrl+"+button.key+"]":button.name||"",key=button.key?'accesskey="'+button.key+'"':"",button.separator)li=$('<li class="markItUpSeparator">'+(button.separator||"")+"</li>").appendTo(ul);else{for(i++,j=levels.length-1;j>=0;j--)t+=levels[j]+"-";li=$('<li class="markItUpButton markItUpButton'+t+i+" "+(button.className||"")+'"><a href="#" '+key+' title="'+title+'">'+(button.name||"")+"</a></li>").bind("contextmenu.markItUp",function(){return!1}).bind("click.markItUp",function(e){e.preventDefault()}).bind("focusin.markItUp",function(){$$.focus()}).bind("mouseup",function(e){return button.call&&eval(button.call)(e),setTimeout(function(){markup(button)},1),!1}).bind("mouseenter.markItUp",function(){$("> ul",this).show(),$(document).one("click",function(){$("ul ul",header).hide()})}).bind("mouseleave.markItUp",function(){$("> ul",this).hide()}).appendTo(ul),button.dropMenu&&(levels.push(i),$(li).addClass("markItUpDropMenu").append(dropMenus(button.dropMenu)))}}),levels.pop(),ul}function magicMarkups(e){return e?(e=e.toString(),e=e.replace(/\(\!\(([\s\S]*?)\)\!\)/g,function(e,t){var r=t.split("|!|");return altKey===!0?void 0!==r[1]?r[1]:r[0]:void 0===r[1]?"":r[0]}),e=e.replace(/\[\!\[([\s\S]*?)\]\!\]/g,function(e,t){var r=t.split(":!:");return abort===!0?!1:(value=prompt(r[0],r[1]?r[1]:""),null===value&&(abort=!0),value)})):""}function prepare(e){return $.isFunction(e)&&(e=e(hash)),magicMarkups(e)}function build(e){var t=prepare(clicked.openWith),r=prepare(clicked.placeHolder),i=prepare(clicked.replaceWith),n=prepare(clicked.closeWith),o=prepare(clicked.openBlockWith),a=prepare(clicked.closeBlockWith),s=clicked.multiline;if(""!==i)block=t+i+n;else if(""===selection&&""!==r)block=t+r+n;else{e=e||selection;var l=[e],c=[];s===!0&&(l=e.split(/\r?\n/));for(var p=0;p<l.length;p++){line=l[p];var u;(u=line.match(/ *$/))?c.push(t+line.replace(/ *$/g,"")+n+u):c.push(t+line+n)}block=c.join("\n")}return block=o+block+a,{block:block,openBlockWith:o,openWith:t,replaceWith:i,placeHolder:r,closeWith:n,closeBlockWith:a}}function markup(e){var t,r,i,n;if(hash=clicked=e,get(),$.extend(hash,{line:"",root:options.root,textarea:textarea,selection:selection||"",caretPosition:caretPosition,ctrlKey:ctrlKey,shiftKey:shiftKey,altKey:altKey}),prepare(options.beforeInsert),prepare(clicked.beforeInsert),(ctrlKey===!0&&shiftKey===!0||e.multiline===!0)&&prepare(clicked.beforeMultiInsert),$.extend(hash,{line:1}),ctrlKey===!0&&shiftKey===!0){for(lines=selection.split(/\r?\n/),r=0,i=lines.length,n=0;i>n;n++)""!==$.trim(lines[n])?($.extend(hash,{line:++r,selection:lines[n]}),lines[n]=build(lines[n]).block):lines[n]="";string={block:lines.join("\n")},start=caretPosition,t=string.block.length+(browser.opera?i-1:0)}else ctrlKey===!0?(string=build(selection),start=caretPosition+string.openWith.length,t=string.block.length-string.openWith.length-string.closeWith.length,t-=string.block.match(/ $/)?1:0,t-=fixIeBug(string.block)):shiftKey===!0?(string=build(selection),start=caretPosition,t=string.block.length,t-=fixIeBug(string.block)):(string=build(selection),start=caretPosition+string.block.length,t=0,start-=fixIeBug(string.block));""===selection&&""===string.replaceWith&&(caretOffset+=fixOperaBug(string.block),start=caretPosition+string.openBlockWith.length+string.openWith.length,t=string.block.length-string.openBlockWith.length-string.openWith.length-string.closeWith.length-string.closeBlockWith.length,caretOffset=$$.val().substring(caretPosition,$$.val().length).length,caretOffset-=fixOperaBug($$.val().substring(0,caretPosition))),$.extend(hash,{caretPosition:caretPosition,scrollPosition:scrollPosition}),string.block!==selection&&abort===!1?(insert(string.block),set(start,t)):caretOffset=-1,get(),$.extend(hash,{line:"",selection:selection}),(ctrlKey===!0&&shiftKey===!0||e.multiline===!0)&&prepare(clicked.afterMultiInsert),prepare(clicked.afterInsert),prepare(options.afterInsert),previewWindow&&options.previewAutoRefresh&&refreshPreview(),shiftKey=altKey=ctrlKey=abort=!1}function fixOperaBug(e){return browser.opera?e.length-e.replace(/\n*/g,"").length:0}function fixIeBug(e){return browser.msie?e.length-e.replace(/\r*/g,"").length:0}function insert(e){if(document.selection){var t=document.selection.createRange();t.text=e}else textarea.value=textarea.value.substring(0,caretPosition)+e+textarea.value.substring(caretPosition+selection.length,textarea.value.length)}function set(e,t){if(textarea.createTextRange){if(browser.opera&&browser.version>=9.5&&0==t)return!1;range=textarea.createTextRange(),range.collapse(!0),range.moveStart("character",e),range.moveEnd("character",t),range.select()}else textarea.setSelectionRange&&textarea.setSelectionRange(e,e+t);textarea.scrollTop=scrollPosition,textarea.focus()}function get(){if(textarea.focus(),scrollPosition=textarea.scrollTop,document.selection)if(selection=document.selection.createRange().text,browser.msie){var e=document.selection.createRange(),t=e.duplicate();for(t.moveToElementText(textarea),caretPosition=-1;t.inRange(e);)t.moveStart("character"),caretPosition++}else caretPosition=textarea.selectionStart;else caretPosition=textarea.selectionStart,selection=textarea.value.substring(caretPosition,textarea.selectionEnd);return selection}function preview(){"function"==typeof options.previewHandler?previewWindow=!0:options.previewInElement?previewWindow=$(options.previewInElement):!previewWindow||previewWindow.closed?options.previewInWindow?(previewWindow=window.open("","preview",options.previewInWindow),$(window).unload(function(){previewWindow.close()})):(iFrame=$('<iframe class="markItUpPreviewFrame"></iframe>'),"after"==options.previewPosition?iFrame.insertAfter(footer):iFrame.insertBefore(header),previewWindow=iFrame[iFrame.length-1].contentWindow||frame[iFrame.length-1]):altKey===!0&&(iFrame?iFrame.remove():previewWindow.close(),previewWindow=iFrame=!1),options.previewAutoRefresh||refreshPreview(),options.previewInWindow&&previewWindow.focus()}function refreshPreview(){renderPreview()}function renderPreview(){var e=$$.val();return options.previewParser&&"function"==typeof options.previewParser&&(e=options.previewParser(e)),options.previewHandler&&"function"==typeof options.previewHandler?options.previewHandler(e):""!==options.previewParserPath?$.ajax({type:options.previewParserAjaxType,dataType:"text",global:!1,url:options.previewParserPath,data:options.previewParserVar+"="+encodeURIComponent(e),success:function(e){writeInPreview(localize(e,1))}}):template||$.ajax({url:options.previewTemplatePath,dataType:"text",global:!1,success:function(t){writeInPreview(localize(t,1).replace(/<!-- content -->/g,e))}}),!1}function writeInPreview(e){if(options.previewInElement)$(options.previewInElement).html(e);else if(previewWindow&&previewWindow.document){try{sp=previewWindow.document.documentElement.scrollTop}catch(t){sp=0}previewWindow.document.open(),previewWindow.document.write(e),previewWindow.document.close(),previewWindow.document.documentElement.scrollTop=sp}}function keyPressed(e){if(shiftKey=e.shiftKey,altKey=e.altKey,ctrlKey=e.altKey&&e.ctrlKey?!1:e.ctrlKey||e.metaKey,"keydown"===e.type){if(ctrlKey===!0&&(li=$('a[accesskey="'+(13==e.keyCode?"\\n":String.fromCharCode(e.keyCode))+'"]',header).parent("li"),0!==li.length))return ctrlKey=!1,setTimeout(function(){li.triggerHandler("mouseup")},1),!1;if(13===e.keyCode||10===e.keyCode)return ctrlKey===!0?(ctrlKey=!1,markup(options.onCtrlEnter),options.onCtrlEnter.keepDefault):shiftKey===!0?(shiftKey=!1,markup(options.onShiftEnter),options.onShiftEnter.keepDefault):(markup(options.onEnter),options.onEnter.keepDefault);if(9===e.keyCode)return 1==shiftKey||1==ctrlKey||1==altKey?!1:-1!==caretOffset?(get(),caretOffset=$$.val().length-caretOffset,set(caretOffset,0),caretOffset=-1,!1):(markup(options.onTab),options.onTab.keepDefault)}}function remove(){$$.unbind(".markItUp").removeClass("markItUpEditor"),$$.parent("div").parent("div.markItUp").parent("div").replaceWith($$);var e=$$.parent("div").parent("div.markItUp").parent("div");e.length&&e.replaceWith($$),$$.data("markItUp",null)}var $$,textarea,levels,scrollPosition,caretPosition,caretOffset,clicked,hash,header,footer,previewWindow,template,iFrame,abort;if($$=$(this),textarea=this,levels=[],abort=!1,scrollPosition=caretPosition=0,caretOffset=-1,options.previewParserPath=localize(options.previewParserPath),options.previewTemplatePath=localize(options.previewTemplatePath),method)switch(method){case"remove":remove();break;case"insert":markup(params);break;default:$.error("Method "+method+" does not exist on jQuery.markItUp")}else init()})},$.fn.markItUpRemove=function(){return this.each(function(){$(this).markItUp("remove")})},$.markItUp=function(e){var t={target:!1};return $.extend(t,e),t.target?$(t.target).each(function(){$(this).focus(),$(this).trigger("insertion",[t])}):void $("textarea").trigger("insertion",[t])}}(jQuery);
