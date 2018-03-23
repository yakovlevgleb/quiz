;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.jquery_dotdotdot_js = factory(root.jQuery);
  }
}(this, function(jQuery) {
/*
 *	jQuery dotdotdot 3.2.2
 *	@requires jQuery 1.7.0 or later
 *
 *	dotdotdot.frebsite.nl
 *
 *	Copyright (c) Fred Heusschen
 *	www.frebsite.nl
 *
 *	License: CC-BY-NC-4.0
 *	http://creativecommons.org/licenses/by-nc/4.0/
 */
!function(t){"use strict";function e(){h=t(window),s={},o={},r={},t.each([s,o,r],function(t,e){e.add=function(t){t=t.split(" ");for(var i=0,n=t.length;i<n;i++)e[t[i]]=e.ddd(t[i])}}),s.ddd=function(t){return"ddd-"+t},s.add("truncated keep"),o.ddd=function(t){return"ddd-"+t},r.ddd=function(t){return t+".ddd"},r.add("resize"),e=function(){}}var i="dotdotdot",n="3.2.2";if(!(t[i]&&t[i].version>n)){t[i]=function(t,e){this.$dot=t,this.api=["getInstance","truncate","restore","destroy","watch","unwatch"],this.opts=e;var n=this.$dot.data(i);return n&&n.destroy(),this.init(),this.truncate(),this.opts.watch&&this.watch(),this},t[i].version=n,t[i].uniqueId=0,t[i].defaults={ellipsis:"… ",callback:function(t){},truncate:"word",tolerance:0,keep:null,watch:"window",height:null},t[i].prototype={init:function(){this.watchTimeout=null,this.watchInterval=null,this.uniqueId=t[i].uniqueId++,this.originalStyle=this.$dot.attr("style")||"",this.originalContent=this._getOriginalContent(),"break-word"!==this.$dot.css("word-wrap")&&this.$dot.css("word-wrap","break-word"),"nowrap"===this.$dot.css("white-space")&&this.$dot.css("white-space","normal"),null===this.opts.height&&(this.opts.height=this._getMaxHeight()),"string"==typeof this.opts.ellipsis&&(this.opts.ellipsis=document.createTextNode(this.opts.ellipsis))},getInstance:function(){return this},truncate:function(){this.$inner=this.$dot.wrapInner("<div />").children().css({display:"block",height:"auto",width:"auto",border:"none",padding:0,margin:0}),this.$inner.empty().append(this.originalContent.clone(!0)),this.maxHeight=this._getMaxHeight();var t=!1;return this._fits()||(t=!0,this._truncateToNode(this.$inner[0])),this.$dot[t?"addClass":"removeClass"](s.truncated),this.$inner.replaceWith(this.$inner.contents()),this.$inner=null,this.opts.callback.call(this.$dot[0],t),t},restore:function(){this.unwatch(),this.$dot.empty().append(this.originalContent).attr("style",this.originalStyle).removeClass(s.truncated)},destroy:function(){this.restore(),this.$dot.data(i,null)},watch:function(){var t=this;this.unwatch();var e={};"window"==this.opts.watch?h.on(r.resize+t.uniqueId,function(i){t.watchTimeout&&clearTimeout(t.watchTimeout),t.watchTimeout=setTimeout(function(){e=t._watchSizes(e,h,"width","height")},100)}):this.watchInterval=setInterval(function(){e=t._watchSizes(e,t.$dot,"innerWidth","innerHeight")},500)},unwatch:function(){h.off(r.resize+this.uniqueId),this.watchInterval&&clearInterval(this.watchInterval),this.watchTimeout&&clearTimeout(this.watchTimeout)},_api:function(){var e=this,i={};return t.each(this.api,function(t){var n=this;i[n]=function(){var t=e[n].apply(e,arguments);return"undefined"==typeof t?i:t}}),i},_truncateToNode:function(e){var i=[],n=[];if(t(e).contents().each(function(){var e=t(this);if(!e.hasClass(s.keep)){var o=document.createComment("");e.replaceWith(o),n.push(this),i.push(o)}}),n.length){for(var o=0;o<n.length;o++){t(i[o]).replaceWith(n[o]),t(n[o]).append(this.opts.ellipsis);var r=this._fits();if(t(this.opts.ellipsis,n[o]).remove(),!r){if("node"==this.opts.truncate&&o>1)return void t(n[o-2]).remove();break}}for(var h=o;h<i.length;h++)t(i[h]).remove();var a=n[Math.max(0,Math.min(o,n.length-1))];if(1==a.nodeType){var d=t("<"+a.nodeName+" />");d.append(this.opts.ellipsis),t(a).replaceWith(d),this._fits()?d.replaceWith(a):(d.remove(),a=n[Math.max(0,o-1)])}1==a.nodeType?this._truncateToNode(a):this._truncateToWord(a)}},_truncateToWord:function(t){for(var e=t,i=this,n=this.__getTextContent(e),s=n.indexOf(" ")!==-1?" ":"　",o=n.split(s),r="",h=o.length;h>=0;h--)if(r=o.slice(0,h).join(s),i.__setTextContent(e,i._addEllipsis(r)),i._fits()){"letter"==i.opts.truncate&&(i.__setTextContent(e,o.slice(0,h+1).join(s)),i._truncateToLetter(e));break}},_truncateToLetter:function(t){for(var e=this,i=this.__getTextContent(t),n=i.split(""),s="",o=n.length;o>=0&&(s=n.slice(0,o).join(""),!s.length||(e.__setTextContent(t,e._addEllipsis(s)),!e._fits()));o--);},_fits:function(){return this.$inner.innerHeight()<=this.maxHeight+this.opts.tolerance},_addEllipsis:function(e){for(var i=[" ","　",",",";",".","!","?"];t.inArray(e.slice(-1),i)>-1;)e=e.slice(0,-1);return e+=this.__getTextContent(this.opts.ellipsis)},_getOriginalContent:function(){var e=this;return this.$dot.find("script, style").addClass(s.keep),this.opts.keep&&this.$dot.find(this.opts.keep).addClass(s.keep),this.$dot.find("*").not("."+s.keep).add(this.$dot).contents().each(function(){var i=this,n=t(this);if(3==i.nodeType){if(""==t.trim(e.__getTextContent(i))){if(n.parent().is("table, thead, tbody, tfoot, tr, dl, ul, ol, video"))return void n.remove();if(n.prev().is("div, p, table, td, td, dt, dd, li"))return void n.remove();if(n.next().is("div, p, table, td, td, dt, dd, li"))return void n.remove();if(!n.prev().length)return void n.remove();if(!n.next().length)return void n.remove()}}else 8==i.nodeType&&n.remove()}),this.$dot.contents()},_getMaxHeight:function(){if("number"==typeof this.opts.height)return this.opts.height;for(var t=["maxHeight","height"],e=0,i=0;i<t.length;i++)if(e=window.getComputedStyle(this.$dot[0])[t[i]],"px"==e.slice(-2)){e=parseFloat(e);break}var t=[];switch(this.$dot.css("boxSizing")){case"border-box":t.push("borderTopWidth"),t.push("borderBottomWidth");case"padding-box":t.push("paddingTop"),t.push("paddingBottom")}for(var i=0;i<t.length;i++){var n=window.getComputedStyle(this.$dot[0])[t[i]];"px"==n.slice(-2)&&(e-=parseFloat(n))}return Math.max(e,0)},_watchSizes:function(t,e,i,n){if(this.$dot.is(":visible")){var s={width:e[i](),height:e[n]()};return t.width==s.width&&t.height==s.height||this.truncate(),s}return t},__getTextContent:function(t){for(var e=["nodeValue","textContent","innerText"],i=0;i<e.length;i++)if("string"==typeof t[e[i]])return t[e[i]];return""},__setTextContent:function(t,e){for(var i=["nodeValue","textContent","innerText"],n=0;n<i.length;n++)t[i[n]]=e}},t.fn[i]=function(n){return e(),n=t.extend(!0,{},t[i].defaults,n),this.each(function(){t(this).data(i,new t[i](t(this),n)._api())})};var s,o,r,h}}(jQuery);
return true;
}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJleHQvanF1ZXJ5LmRvdGRvdGRvdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuanF1ZXJ5X2RvdGRvdGRvdF9qcyA9IGZhY3Rvcnkocm9vdC5qUXVlcnkpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKGpRdWVyeSkge1xuLypcbiAqXHRqUXVlcnkgZG90ZG90ZG90IDMuMi4yXG4gKlx0QHJlcXVpcmVzIGpRdWVyeSAxLjcuMCBvciBsYXRlclxuICpcbiAqXHRkb3Rkb3Rkb3QuZnJlYnNpdGUubmxcbiAqXG4gKlx0Q29weXJpZ2h0IChjKSBGcmVkIEhldXNzY2hlblxuICpcdHd3dy5mcmVic2l0ZS5ubFxuICpcbiAqXHRMaWNlbnNlOiBDQy1CWS1OQy00LjBcbiAqXHRodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1uYy80LjAvXG4gKi9cbiFmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKCl7aD10KHdpbmRvdykscz17fSxvPXt9LHI9e30sdC5lYWNoKFtzLG8scl0sZnVuY3Rpb24odCxlKXtlLmFkZD1mdW5jdGlvbih0KXt0PXQuc3BsaXQoXCIgXCIpO2Zvcih2YXIgaT0wLG49dC5sZW5ndGg7aTxuO2krKyllW3RbaV1dPWUuZGRkKHRbaV0pfX0pLHMuZGRkPWZ1bmN0aW9uKHQpe3JldHVyblwiZGRkLVwiK3R9LHMuYWRkKFwidHJ1bmNhdGVkIGtlZXBcIiksby5kZGQ9ZnVuY3Rpb24odCl7cmV0dXJuXCJkZGQtXCIrdH0sci5kZGQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQrXCIuZGRkXCJ9LHIuYWRkKFwicmVzaXplXCIpLGU9ZnVuY3Rpb24oKXt9fXZhciBpPVwiZG90ZG90ZG90XCIsbj1cIjMuMi4yXCI7aWYoISh0W2ldJiZ0W2ldLnZlcnNpb24+bikpe3RbaV09ZnVuY3Rpb24odCxlKXt0aGlzLiRkb3Q9dCx0aGlzLmFwaT1bXCJnZXRJbnN0YW5jZVwiLFwidHJ1bmNhdGVcIixcInJlc3RvcmVcIixcImRlc3Ryb3lcIixcIndhdGNoXCIsXCJ1bndhdGNoXCJdLHRoaXMub3B0cz1lO3ZhciBuPXRoaXMuJGRvdC5kYXRhKGkpO3JldHVybiBuJiZuLmRlc3Ryb3koKSx0aGlzLmluaXQoKSx0aGlzLnRydW5jYXRlKCksdGhpcy5vcHRzLndhdGNoJiZ0aGlzLndhdGNoKCksdGhpc30sdFtpXS52ZXJzaW9uPW4sdFtpXS51bmlxdWVJZD0wLHRbaV0uZGVmYXVsdHM9e2VsbGlwc2lzOlwi4oCmIFwiLGNhbGxiYWNrOmZ1bmN0aW9uKHQpe30sdHJ1bmNhdGU6XCJ3b3JkXCIsdG9sZXJhbmNlOjAsa2VlcDpudWxsLHdhdGNoOlwid2luZG93XCIsaGVpZ2h0Om51bGx9LHRbaV0ucHJvdG90eXBlPXtpbml0OmZ1bmN0aW9uKCl7dGhpcy53YXRjaFRpbWVvdXQ9bnVsbCx0aGlzLndhdGNoSW50ZXJ2YWw9bnVsbCx0aGlzLnVuaXF1ZUlkPXRbaV0udW5pcXVlSWQrKyx0aGlzLm9yaWdpbmFsU3R5bGU9dGhpcy4kZG90LmF0dHIoXCJzdHlsZVwiKXx8XCJcIix0aGlzLm9yaWdpbmFsQ29udGVudD10aGlzLl9nZXRPcmlnaW5hbENvbnRlbnQoKSxcImJyZWFrLXdvcmRcIiE9PXRoaXMuJGRvdC5jc3MoXCJ3b3JkLXdyYXBcIikmJnRoaXMuJGRvdC5jc3MoXCJ3b3JkLXdyYXBcIixcImJyZWFrLXdvcmRcIiksXCJub3dyYXBcIj09PXRoaXMuJGRvdC5jc3MoXCJ3aGl0ZS1zcGFjZVwiKSYmdGhpcy4kZG90LmNzcyhcIndoaXRlLXNwYWNlXCIsXCJub3JtYWxcIiksbnVsbD09PXRoaXMub3B0cy5oZWlnaHQmJih0aGlzLm9wdHMuaGVpZ2h0PXRoaXMuX2dldE1heEhlaWdodCgpKSxcInN0cmluZ1wiPT10eXBlb2YgdGhpcy5vcHRzLmVsbGlwc2lzJiYodGhpcy5vcHRzLmVsbGlwc2lzPWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMub3B0cy5lbGxpcHNpcykpfSxnZXRJbnN0YW5jZTpmdW5jdGlvbigpe3JldHVybiB0aGlzfSx0cnVuY2F0ZTpmdW5jdGlvbigpe3RoaXMuJGlubmVyPXRoaXMuJGRvdC53cmFwSW5uZXIoXCI8ZGl2IC8+XCIpLmNoaWxkcmVuKCkuY3NzKHtkaXNwbGF5OlwiYmxvY2tcIixoZWlnaHQ6XCJhdXRvXCIsd2lkdGg6XCJhdXRvXCIsYm9yZGVyOlwibm9uZVwiLHBhZGRpbmc6MCxtYXJnaW46MH0pLHRoaXMuJGlubmVyLmVtcHR5KCkuYXBwZW5kKHRoaXMub3JpZ2luYWxDb250ZW50LmNsb25lKCEwKSksdGhpcy5tYXhIZWlnaHQ9dGhpcy5fZ2V0TWF4SGVpZ2h0KCk7dmFyIHQ9ITE7cmV0dXJuIHRoaXMuX2ZpdHMoKXx8KHQ9ITAsdGhpcy5fdHJ1bmNhdGVUb05vZGUodGhpcy4kaW5uZXJbMF0pKSx0aGlzLiRkb3RbdD9cImFkZENsYXNzXCI6XCJyZW1vdmVDbGFzc1wiXShzLnRydW5jYXRlZCksdGhpcy4kaW5uZXIucmVwbGFjZVdpdGgodGhpcy4kaW5uZXIuY29udGVudHMoKSksdGhpcy4kaW5uZXI9bnVsbCx0aGlzLm9wdHMuY2FsbGJhY2suY2FsbCh0aGlzLiRkb3RbMF0sdCksdH0scmVzdG9yZTpmdW5jdGlvbigpe3RoaXMudW53YXRjaCgpLHRoaXMuJGRvdC5lbXB0eSgpLmFwcGVuZCh0aGlzLm9yaWdpbmFsQ29udGVudCkuYXR0cihcInN0eWxlXCIsdGhpcy5vcmlnaW5hbFN0eWxlKS5yZW1vdmVDbGFzcyhzLnRydW5jYXRlZCl9LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLnJlc3RvcmUoKSx0aGlzLiRkb3QuZGF0YShpLG51bGwpfSx3YXRjaDpmdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy51bndhdGNoKCk7dmFyIGU9e307XCJ3aW5kb3dcIj09dGhpcy5vcHRzLndhdGNoP2gub24oci5yZXNpemUrdC51bmlxdWVJZCxmdW5jdGlvbihpKXt0LndhdGNoVGltZW91dCYmY2xlYXJUaW1lb3V0KHQud2F0Y2hUaW1lb3V0KSx0LndhdGNoVGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZT10Ll93YXRjaFNpemVzKGUsaCxcIndpZHRoXCIsXCJoZWlnaHRcIil9LDEwMCl9KTp0aGlzLndhdGNoSW50ZXJ2YWw9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtlPXQuX3dhdGNoU2l6ZXMoZSx0LiRkb3QsXCJpbm5lcldpZHRoXCIsXCJpbm5lckhlaWdodFwiKX0sNTAwKX0sdW53YXRjaDpmdW5jdGlvbigpe2gub2ZmKHIucmVzaXplK3RoaXMudW5pcXVlSWQpLHRoaXMud2F0Y2hJbnRlcnZhbCYmY2xlYXJJbnRlcnZhbCh0aGlzLndhdGNoSW50ZXJ2YWwpLHRoaXMud2F0Y2hUaW1lb3V0JiZjbGVhclRpbWVvdXQodGhpcy53YXRjaFRpbWVvdXQpfSxfYXBpOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxpPXt9O3JldHVybiB0LmVhY2godGhpcy5hcGksZnVuY3Rpb24odCl7dmFyIG49dGhpcztpW25dPWZ1bmN0aW9uKCl7dmFyIHQ9ZVtuXS5hcHBseShlLGFyZ3VtZW50cyk7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/aTp0fX0pLGl9LF90cnVuY2F0ZVRvTm9kZTpmdW5jdGlvbihlKXt2YXIgaT1bXSxuPVtdO2lmKHQoZSkuY29udGVudHMoKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9dCh0aGlzKTtpZighZS5oYXNDbGFzcyhzLmtlZXApKXt2YXIgbz1kb2N1bWVudC5jcmVhdGVDb21tZW50KFwiXCIpO2UucmVwbGFjZVdpdGgobyksbi5wdXNoKHRoaXMpLGkucHVzaChvKX19KSxuLmxlbmd0aCl7Zm9yKHZhciBvPTA7bzxuLmxlbmd0aDtvKyspe3QoaVtvXSkucmVwbGFjZVdpdGgobltvXSksdChuW29dKS5hcHBlbmQodGhpcy5vcHRzLmVsbGlwc2lzKTt2YXIgcj10aGlzLl9maXRzKCk7aWYodCh0aGlzLm9wdHMuZWxsaXBzaXMsbltvXSkucmVtb3ZlKCksIXIpe2lmKFwibm9kZVwiPT10aGlzLm9wdHMudHJ1bmNhdGUmJm8+MSlyZXR1cm4gdm9pZCB0KG5bby0yXSkucmVtb3ZlKCk7YnJlYWt9fWZvcih2YXIgaD1vO2g8aS5sZW5ndGg7aCsrKXQoaVtoXSkucmVtb3ZlKCk7dmFyIGE9bltNYXRoLm1heCgwLE1hdGgubWluKG8sbi5sZW5ndGgtMSkpXTtpZigxPT1hLm5vZGVUeXBlKXt2YXIgZD10KFwiPFwiK2Eubm9kZU5hbWUrXCIgLz5cIik7ZC5hcHBlbmQodGhpcy5vcHRzLmVsbGlwc2lzKSx0KGEpLnJlcGxhY2VXaXRoKGQpLHRoaXMuX2ZpdHMoKT9kLnJlcGxhY2VXaXRoKGEpOihkLnJlbW92ZSgpLGE9bltNYXRoLm1heCgwLG8tMSldKX0xPT1hLm5vZGVUeXBlP3RoaXMuX3RydW5jYXRlVG9Ob2RlKGEpOnRoaXMuX3RydW5jYXRlVG9Xb3JkKGEpfX0sX3RydW5jYXRlVG9Xb3JkOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10LGk9dGhpcyxuPXRoaXMuX19nZXRUZXh0Q29udGVudChlKSxzPW4uaW5kZXhPZihcIiBcIikhPT0tMT9cIiBcIjpcIuOAgFwiLG89bi5zcGxpdChzKSxyPVwiXCIsaD1vLmxlbmd0aDtoPj0wO2gtLSlpZihyPW8uc2xpY2UoMCxoKS5qb2luKHMpLGkuX19zZXRUZXh0Q29udGVudChlLGkuX2FkZEVsbGlwc2lzKHIpKSxpLl9maXRzKCkpe1wibGV0dGVyXCI9PWkub3B0cy50cnVuY2F0ZSYmKGkuX19zZXRUZXh0Q29udGVudChlLG8uc2xpY2UoMCxoKzEpLmpvaW4ocykpLGkuX3RydW5jYXRlVG9MZXR0ZXIoZSkpO2JyZWFrfX0sX3RydW5jYXRlVG9MZXR0ZXI6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMsaT10aGlzLl9fZ2V0VGV4dENvbnRlbnQodCksbj1pLnNwbGl0KFwiXCIpLHM9XCJcIixvPW4ubGVuZ3RoO28+PTAmJihzPW4uc2xpY2UoMCxvKS5qb2luKFwiXCIpLCFzLmxlbmd0aHx8KGUuX19zZXRUZXh0Q29udGVudCh0LGUuX2FkZEVsbGlwc2lzKHMpKSwhZS5fZml0cygpKSk7by0tKTt9LF9maXRzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGlubmVyLmlubmVySGVpZ2h0KCk8PXRoaXMubWF4SGVpZ2h0K3RoaXMub3B0cy50b2xlcmFuY2V9LF9hZGRFbGxpcHNpczpmdW5jdGlvbihlKXtmb3IodmFyIGk9W1wiIFwiLFwi44CAXCIsXCIsXCIsXCI7XCIsXCIuXCIsXCIhXCIsXCI/XCJdO3QuaW5BcnJheShlLnNsaWNlKC0xKSxpKT4tMTspZT1lLnNsaWNlKDAsLTEpO3JldHVybiBlKz10aGlzLl9fZ2V0VGV4dENvbnRlbnQodGhpcy5vcHRzLmVsbGlwc2lzKX0sX2dldE9yaWdpbmFsQ29udGVudDpmdW5jdGlvbigpe3ZhciBlPXRoaXM7cmV0dXJuIHRoaXMuJGRvdC5maW5kKFwic2NyaXB0LCBzdHlsZVwiKS5hZGRDbGFzcyhzLmtlZXApLHRoaXMub3B0cy5rZWVwJiZ0aGlzLiRkb3QuZmluZCh0aGlzLm9wdHMua2VlcCkuYWRkQ2xhc3Mocy5rZWVwKSx0aGlzLiRkb3QuZmluZChcIipcIikubm90KFwiLlwiK3Mua2VlcCkuYWRkKHRoaXMuJGRvdCkuY29udGVudHMoKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGk9dGhpcyxuPXQodGhpcyk7aWYoMz09aS5ub2RlVHlwZSl7aWYoXCJcIj09dC50cmltKGUuX19nZXRUZXh0Q29udGVudChpKSkpe2lmKG4ucGFyZW50KCkuaXMoXCJ0YWJsZSwgdGhlYWQsIHRib2R5LCB0Zm9vdCwgdHIsIGRsLCB1bCwgb2wsIHZpZGVvXCIpKXJldHVybiB2b2lkIG4ucmVtb3ZlKCk7aWYobi5wcmV2KCkuaXMoXCJkaXYsIHAsIHRhYmxlLCB0ZCwgdGQsIGR0LCBkZCwgbGlcIikpcmV0dXJuIHZvaWQgbi5yZW1vdmUoKTtpZihuLm5leHQoKS5pcyhcImRpdiwgcCwgdGFibGUsIHRkLCB0ZCwgZHQsIGRkLCBsaVwiKSlyZXR1cm4gdm9pZCBuLnJlbW92ZSgpO2lmKCFuLnByZXYoKS5sZW5ndGgpcmV0dXJuIHZvaWQgbi5yZW1vdmUoKTtpZighbi5uZXh0KCkubGVuZ3RoKXJldHVybiB2b2lkIG4ucmVtb3ZlKCl9fWVsc2UgOD09aS5ub2RlVHlwZSYmbi5yZW1vdmUoKX0pLHRoaXMuJGRvdC5jb250ZW50cygpfSxfZ2V0TWF4SGVpZ2h0OmZ1bmN0aW9uKCl7aWYoXCJudW1iZXJcIj09dHlwZW9mIHRoaXMub3B0cy5oZWlnaHQpcmV0dXJuIHRoaXMub3B0cy5oZWlnaHQ7Zm9yKHZhciB0PVtcIm1heEhlaWdodFwiLFwiaGVpZ2h0XCJdLGU9MCxpPTA7aTx0Lmxlbmd0aDtpKyspaWYoZT13aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRkb3RbMF0pW3RbaV1dLFwicHhcIj09ZS5zbGljZSgtMikpe2U9cGFyc2VGbG9hdChlKTticmVha312YXIgdD1bXTtzd2l0Y2godGhpcy4kZG90LmNzcyhcImJveFNpemluZ1wiKSl7Y2FzZVwiYm9yZGVyLWJveFwiOnQucHVzaChcImJvcmRlclRvcFdpZHRoXCIpLHQucHVzaChcImJvcmRlckJvdHRvbVdpZHRoXCIpO2Nhc2VcInBhZGRpbmctYm94XCI6dC5wdXNoKFwicGFkZGluZ1RvcFwiKSx0LnB1c2goXCJwYWRkaW5nQm90dG9tXCIpfWZvcih2YXIgaT0wO2k8dC5sZW5ndGg7aSsrKXt2YXIgbj13aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRkb3RbMF0pW3RbaV1dO1wicHhcIj09bi5zbGljZSgtMikmJihlLT1wYXJzZUZsb2F0KG4pKX1yZXR1cm4gTWF0aC5tYXgoZSwwKX0sX3dhdGNoU2l6ZXM6ZnVuY3Rpb24odCxlLGksbil7aWYodGhpcy4kZG90LmlzKFwiOnZpc2libGVcIikpe3ZhciBzPXt3aWR0aDplW2ldKCksaGVpZ2h0OmVbbl0oKX07cmV0dXJuIHQud2lkdGg9PXMud2lkdGgmJnQuaGVpZ2h0PT1zLmhlaWdodHx8dGhpcy50cnVuY2F0ZSgpLHN9cmV0dXJuIHR9LF9fZ2V0VGV4dENvbnRlbnQ6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPVtcIm5vZGVWYWx1ZVwiLFwidGV4dENvbnRlbnRcIixcImlubmVyVGV4dFwiXSxpPTA7aTxlLmxlbmd0aDtpKyspaWYoXCJzdHJpbmdcIj09dHlwZW9mIHRbZVtpXV0pcmV0dXJuIHRbZVtpXV07cmV0dXJuXCJcIn0sX19zZXRUZXh0Q29udGVudDpmdW5jdGlvbih0LGUpe2Zvcih2YXIgaT1bXCJub2RlVmFsdWVcIixcInRleHRDb250ZW50XCIsXCJpbm5lclRleHRcIl0sbj0wO248aS5sZW5ndGg7bisrKXRbaVtuXV09ZX19LHQuZm5baV09ZnVuY3Rpb24obil7cmV0dXJuIGUoKSxuPXQuZXh0ZW5kKCEwLHt9LHRbaV0uZGVmYXVsdHMsbiksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dCh0aGlzKS5kYXRhKGksbmV3IHRbaV0odCh0aGlzKSxuKS5fYXBpKCkpfSl9O3ZhciBzLG8scixofX0oalF1ZXJ5KTtcbnJldHVybiB0cnVlO1xufSkpO1xuIl0sImZpbGUiOiJleHQvanF1ZXJ5LmRvdGRvdGRvdC5qcyJ9
