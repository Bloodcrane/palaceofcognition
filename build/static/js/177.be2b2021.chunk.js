/*! For license information please see 177.be2b2021.chunk.js.LICENSE.txt */
(self.webpackChunkpalaceofcognition=self.webpackChunkpalaceofcognition||[]).push([[177],{365:(e,t,n)=>{"use strict";n.d(t,{A:()=>a});var r=n(475),o=n(216),i=(n(43),n(579));const a=e=>{let{showMain:t=!0,showBooks:n=!0,showMovies:a=!0,showArticles:c=!0}=e;return(0,i.jsxs)("div",{className:"layoutDiv",children:[t&&(0,i.jsx)(r.N_,{className:"layoutButton",to:"/",children:"\u10db\u10d7\u10d0\u10d5\u10d0\u10e0\u10d8"}),n&&(0,i.jsx)(r.N_,{className:"layoutButton",to:"/books",children:"\u10ec\u10d8\u10d2\u10dc\u10d4\u10d1\u10d8"}),a&&(0,i.jsx)(r.N_,{className:"layoutButton",to:"/movies",children:"\u10e4\u10d8\u10da\u10db\u10d4\u10d1\u10d8"}),c&&(0,i.jsx)(r.N_,{className:"layoutButton",to:"/articles",children:"\u10e0\u10d4\u10ea\u10d4\u10dc\u10d6\u10d8\u10d4\u10d1\u10d8"}),(0,i.jsx)(o.sv,{})]})}},177:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>ye});var r=n(43),o=n(365),i=n(475),a=n(910),c=n(579);const s=["#6b7a6f","#775a5a","#634875","#647d94"],u=()=>(0,c.jsx)("div",{children:a.map((e=>(0,c.jsx)("div",{className:"webComponent",style:{backgroundColor:s[e.id%s.length]},children:(0,c.jsxs)("div",{className:"webComponent-inside-container",children:[(0,c.jsx)("img",{src:e.imageUrl,alt:e.title,className:"webComponent-image"}),(0,c.jsx)("h2",{className:"webComponent-title",children:e.title}),(0,c.jsx)("label",{className:"webComponent-author",children:e.author}),(0,c.jsx)("p",{className:"webComponent-description",children:e.description}),(0,c.jsx)("div",{className:"btnMargin",children:(0,c.jsx)(i.N_,{to:{pathname:"/article/".concat(e.title),state:{articleId:e.title}},className:"webComponent-button",children:"View More"})})]})},e.id)))});var l=n(173),f=n.n(l),p=n(161),d=n.n(p),h=n(366),y=n.n(h),m=n(123),b=n.n(m),g="bodyAttributes",T="htmlAttributes",v="titleAttributes",w={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"},O=(Object.keys(w).map((function(e){return w[e]})),"charset"),j="cssText",A="href",C="http-equiv",S="innerHTML",E="itemprop",x="name",k="property",P="rel",N="src",I="target",L={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},M="defaultTitle",_="defer",R="encodeSpecialCharacters",B="onChangeClientState",D="titleTemplate",q=Object.keys(L).reduce((function(e,t){return e[L[t]]=t,e}),{}),H=[w.NOSCRIPT,w.SCRIPT,w.STYLE],U="data-react-helmet",Y="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},F=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),V=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},z=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n},K=function(e){return!1===(!(arguments.length>1&&void 0!==arguments[1])||arguments[1])?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},W=function(e){var t=X(e,w.TITLE),n=X(e,D);if(n&&t)return n.replace(/%s/g,(function(){return Array.isArray(t)?t.join(""):t}));var r=X(e,M);return t||r||void 0},$=function(e){return X(e,B)||function(){}},J=function(e,t){return t.filter((function(t){return"undefined"!==typeof t[e]})).map((function(t){return t[e]})).reduce((function(e,t){return V({},e,t)}),{})},G=function(e,t){return t.filter((function(e){return"undefined"!==typeof e[w.BASE]})).map((function(e){return e[w.BASE]})).reverse().reduce((function(t,n){if(!t.length)for(var r=Object.keys(n),o=0;o<r.length;o++){var i=r[o].toLowerCase();if(-1!==e.indexOf(i)&&n[i])return t.concat(n)}return t}),[])},Q=function(e,t,n){var r={};return n.filter((function(t){return!!Array.isArray(t[e])||("undefined"!==typeof t[e]&&re("Helmet: "+e+' should be of type "Array". Instead found type "'+Y(t[e])+'"'),!1)})).map((function(t){return t[e]})).reverse().reduce((function(e,n){var o={};n.filter((function(e){for(var n=void 0,i=Object.keys(e),a=0;a<i.length;a++){var c=i[a],s=c.toLowerCase();-1===t.indexOf(s)||n===P&&"canonical"===e[n].toLowerCase()||s===P&&"stylesheet"===e[s].toLowerCase()||(n=s),-1===t.indexOf(c)||c!==S&&c!==j&&c!==E||(n=c)}if(!n||!e[n])return!1;var u=e[n].toLowerCase();return r[n]||(r[n]={}),o[n]||(o[n]={}),!r[n][u]&&(o[n][u]=!0,!0)})).reverse().forEach((function(t){return e.push(t)}));for(var i=Object.keys(o),a=0;a<i.length;a++){var c=i[a],s=b()({},r[c],o[c]);r[c]=s}return e}),[]).reverse()},X=function(e,t){for(var n=e.length-1;n>=0;n--){var r=e[n];if(r.hasOwnProperty(t))return r[t]}return null},Z=function(){var e=Date.now();return function(t){var n=Date.now();n-e>16?(e=n,t(n)):setTimeout((function(){Z(t)}),0)}}(),ee=function(e){return clearTimeout(e)},te="undefined"!==typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||Z:n.g.requestAnimationFrame||Z,ne="undefined"!==typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||ee:n.g.cancelAnimationFrame||ee,re=function(e){return console&&"function"===typeof console.warn&&console.warn(e)},oe=null,ie=function(e,t){var n=e.baseTag,r=e.bodyAttributes,o=e.htmlAttributes,i=e.linkTags,a=e.metaTags,c=e.noscriptTags,s=e.onChangeClientState,u=e.scriptTags,l=e.styleTags,f=e.title,p=e.titleAttributes;se(w.BODY,r),se(w.HTML,o),ce(f,p);var d={baseTag:ue(w.BASE,n),linkTags:ue(w.LINK,i),metaTags:ue(w.META,a),noscriptTags:ue(w.NOSCRIPT,c),scriptTags:ue(w.SCRIPT,u),styleTags:ue(w.STYLE,l)},h={},y={};Object.keys(d).forEach((function(e){var t=d[e],n=t.newTags,r=t.oldTags;n.length&&(h[e]=n),r.length&&(y[e]=d[e].oldTags)})),t&&t(),s(e,h,y)},ae=function(e){return Array.isArray(e)?e.join(""):e},ce=function(e,t){"undefined"!==typeof e&&document.title!==e&&(document.title=ae(e)),se(w.TITLE,t)},se=function(e,t){var n=document.getElementsByTagName(e)[0];if(n){for(var r=n.getAttribute(U),o=r?r.split(","):[],i=[].concat(o),a=Object.keys(t),c=0;c<a.length;c++){var s=a[c],u=t[s]||"";n.getAttribute(s)!==u&&n.setAttribute(s,u),-1===o.indexOf(s)&&o.push(s);var l=i.indexOf(s);-1!==l&&i.splice(l,1)}for(var f=i.length-1;f>=0;f--)n.removeAttribute(i[f]);o.length===i.length?n.removeAttribute(U):n.getAttribute(U)!==a.join(",")&&n.setAttribute(U,a.join(","))}},ue=function(e,t){var n=document.head||document.querySelector(w.HEAD),r=n.querySelectorAll(e+"["+U+"]"),o=Array.prototype.slice.call(r),i=[],a=void 0;return t&&t.length&&t.forEach((function(t){var n=document.createElement(e);for(var r in t)if(t.hasOwnProperty(r))if(r===S)n.innerHTML=t.innerHTML;else if(r===j)n.styleSheet?n.styleSheet.cssText=t.cssText:n.appendChild(document.createTextNode(t.cssText));else{var c="undefined"===typeof t[r]?"":t[r];n.setAttribute(r,c)}n.setAttribute(U,"true"),o.some((function(e,t){return a=t,n.isEqualNode(e)}))?o.splice(a,1):i.push(n)})),o.forEach((function(e){return e.parentNode.removeChild(e)})),i.forEach((function(e){return n.appendChild(e)})),{oldTags:o,newTags:i}},le=function(e){return Object.keys(e).reduce((function(t,n){var r="undefined"!==typeof e[n]?n+'="'+e[n]+'"':""+n;return t?t+" "+r:r}),"")},fe=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,n){return t[L[n]||n]=e[n],t}),t)},pe=function(e,t,n){switch(e){case w.TITLE:return{toComponent:function(){return function(e,t,n){var o,i=((o={key:t})[U]=!0,o),a=fe(n,i);return[r.createElement(w.TITLE,a,t)]}(0,t.title,t.titleAttributes)},toString:function(){return function(e,t,n,r){var o=le(n),i=ae(t);return o?"<"+e+" "+U+'="true" '+o+">"+K(i,r)+"</"+e+">":"<"+e+" "+U+'="true">'+K(i,r)+"</"+e+">"}(e,t.title,t.titleAttributes,n)}};case g:case T:return{toComponent:function(){return fe(t)},toString:function(){return le(t)}};default:return{toComponent:function(){return function(e,t){return t.map((function(t,n){var o,i=((o={key:n})[U]=!0,o);return Object.keys(t).forEach((function(e){var n=L[e]||e;if(n===S||n===j){var r=t.innerHTML||t.cssText;i.dangerouslySetInnerHTML={__html:r}}else i[n]=t[e]})),r.createElement(e,i)}))}(e,t)},toString:function(){return function(e,t,n){return t.reduce((function(t,r){var o=Object.keys(r).filter((function(e){return!(e===S||e===j)})).reduce((function(e,t){var o="undefined"===typeof r[t]?t:t+'="'+K(r[t],n)+'"';return e?e+" "+o:o}),""),i=r.innerHTML||r.cssText||"",a=-1===H.indexOf(e);return t+"<"+e+" "+U+'="true" '+o+(a?"/>":">"+i+"</"+e+">")}),"")}(e,t,n)}}}},de=function(e){var t=e.baseTag,n=e.bodyAttributes,r=e.encode,o=e.htmlAttributes,i=e.linkTags,a=e.metaTags,c=e.noscriptTags,s=e.scriptTags,u=e.styleTags,l=e.title,f=void 0===l?"":l,p=e.titleAttributes;return{base:pe(w.BASE,t,r),bodyAttributes:pe(g,n,r),htmlAttributes:pe(T,o,r),link:pe(w.LINK,i,r),meta:pe(w.META,a,r),noscript:pe(w.NOSCRIPT,c,r),script:pe(w.SCRIPT,s,r),style:pe(w.STYLE,u,r),title:pe(w.TITLE,{title:f,titleAttributes:p},r)}},he=function(e){var t,n;return n=t=function(t){function n(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,t.apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(n,t),n.prototype.shouldComponentUpdate=function(e){return!y()(this.props,e)},n.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case w.SCRIPT:case w.NOSCRIPT:return{innerHTML:t};case w.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},n.prototype.flattenArrayTypeChildren=function(e){var t,n=e.child,r=e.arrayTypeChildren,o=e.newChildProps,i=e.nestedChildren;return V({},r,((t={})[n.type]=[].concat(r[n.type]||[],[V({},o,this.mapNestedChildrenToProps(n,i))]),t))},n.prototype.mapObjectTypeChildren=function(e){var t,n,r=e.child,o=e.newProps,i=e.newChildProps,a=e.nestedChildren;switch(r.type){case w.TITLE:return V({},o,((t={})[r.type]=a,t.titleAttributes=V({},i),t));case w.BODY:return V({},o,{bodyAttributes:V({},i)});case w.HTML:return V({},o,{htmlAttributes:V({},i)})}return V({},o,((n={})[r.type]=V({},i),n))},n.prototype.mapArrayTypeChildrenToProps=function(e,t){var n=V({},t);return Object.keys(e).forEach((function(t){var r;n=V({},n,((r={})[t]=e[t],r))})),n},n.prototype.warnOnInvalidChildren=function(e,t){return!0},n.prototype.mapChildrenToProps=function(e,t){var n=this,o={};return r.Children.forEach(e,(function(e){if(e&&e.props){var r=e.props,i=r.children,a=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,n){return t[q[n]||n]=e[n],t}),t)}(z(r,["children"]));switch(n.warnOnInvalidChildren(e,i),e.type){case w.LINK:case w.META:case w.NOSCRIPT:case w.SCRIPT:case w.STYLE:o=n.flattenArrayTypeChildren({child:e,arrayTypeChildren:o,newChildProps:a,nestedChildren:i});break;default:t=n.mapObjectTypeChildren({child:e,newProps:t,newChildProps:a,nestedChildren:i})}}})),t=this.mapArrayTypeChildrenToProps(o,t)},n.prototype.render=function(){var t=this.props,n=t.children,o=z(t,["children"]),i=V({},o);return n&&(i=this.mapChildrenToProps(n,i)),r.createElement(e,i)},F(n,null,[{key:"canUseDOM",set:function(t){e.canUseDOM=t}}]),n}(r.Component),t.propTypes={base:f().object,bodyAttributes:f().object,children:f().oneOfType([f().arrayOf(f().node),f().node]),defaultTitle:f().string,defer:f().bool,encodeSpecialCharacters:f().bool,htmlAttributes:f().object,link:f().arrayOf(f().object),meta:f().arrayOf(f().object),noscript:f().arrayOf(f().object),onChangeClientState:f().func,script:f().arrayOf(f().object),style:f().arrayOf(f().object),title:f().string,titleAttributes:f().object,titleTemplate:f().string},t.defaultProps={defer:!0,encodeSpecialCharacters:!0},t.peek=e.peek,t.rewind=function(){var t=e.rewind();return t||(t=de({baseTag:[],bodyAttributes:{},encodeSpecialCharacters:!0,htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),t},n}(d()((function(e){return{baseTag:G([A,I],e),bodyAttributes:J(g,e),defer:X(e,_),encode:X(e,R),htmlAttributes:J(T,e),linkTags:Q(w.LINK,[P,A],e),metaTags:Q(w.META,[x,O,C,k,E],e),noscriptTags:Q(w.NOSCRIPT,[S],e),onChangeClientState:$(e),scriptTags:Q(w.SCRIPT,[N,S],e),styleTags:Q(w.STYLE,[j],e),title:W(e),titleAttributes:J(v,e)}}),(function(e){oe&&ne(oe),e.defer?oe=te((function(){ie(e,(function(){oe=null}))})):(ie(e),oe=null)}),de)((function(){return null})));he.renderStatic=he.rewind;const ye=()=>(0,c.jsxs)("div",{children:[(0,c.jsxs)(he,{children:[(0,c.jsx)("meta",{name:"description",content:"View more articles"}),(0,c.jsx)("meta",{property:"og:title",content:"Articles"}),(0,c.jsx)("meta",{property:"og:description",content:"View more articles"})]}),(0,c.jsx)("header",{children:(0,c.jsx)(o.A,{showMain:!0,showBooks:!0,showMovies:!0,showArticles:!1})}),(0,c.jsx)("h1",{style:{marginTop:"95px"},children:"\u10e0\u10d4\u10ea\u10d4\u10dc\u10d6\u10d8\u10d4\u10d1\u10d8"}),(0,c.jsx)(u,{})]})},123:e=>{"use strict";var t=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(o){return!1}}()?Object.assign:function(e,o){for(var i,a,c=function(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),s=1;s<arguments.length;s++){for(var u in i=Object(arguments[s]))n.call(i,u)&&(c[u]=i[u]);if(t){a=t(i);for(var l=0;l<a.length;l++)r.call(i,a[l])&&(c[a[l]]=i[a[l]])}}return c}},497:(e,t,n)=>{"use strict";var r=n(218);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,i,a){if(a!==r){var c=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}function t(){return e}e.isRequired=e;var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return n.PropTypes=n,n}},173:(e,t,n)=>{e.exports=n(497)()},218:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},366:e=>{var t="undefined"!==typeof Element,n="function"===typeof Map,r="function"===typeof Set,o="function"===typeof ArrayBuffer&&!!ArrayBuffer.isView;function i(e,a){if(e===a)return!0;if(e&&a&&"object"==typeof e&&"object"==typeof a){if(e.constructor!==a.constructor)return!1;var c,s,u,l;if(Array.isArray(e)){if((c=e.length)!=a.length)return!1;for(s=c;0!==s--;)if(!i(e[s],a[s]))return!1;return!0}if(n&&e instanceof Map&&a instanceof Map){if(e.size!==a.size)return!1;for(l=e.entries();!(s=l.next()).done;)if(!a.has(s.value[0]))return!1;for(l=e.entries();!(s=l.next()).done;)if(!i(s.value[1],a.get(s.value[0])))return!1;return!0}if(r&&e instanceof Set&&a instanceof Set){if(e.size!==a.size)return!1;for(l=e.entries();!(s=l.next()).done;)if(!a.has(s.value[0]))return!1;return!0}if(o&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(a)){if((c=e.length)!=a.length)return!1;for(s=c;0!==s--;)if(e[s]!==a[s])return!1;return!0}if(e.constructor===RegExp)return e.source===a.source&&e.flags===a.flags;if(e.valueOf!==Object.prototype.valueOf&&"function"===typeof e.valueOf&&"function"===typeof a.valueOf)return e.valueOf()===a.valueOf();if(e.toString!==Object.prototype.toString&&"function"===typeof e.toString&&"function"===typeof a.toString)return e.toString()===a.toString();if((c=(u=Object.keys(e)).length)!==Object.keys(a).length)return!1;for(s=c;0!==s--;)if(!Object.prototype.hasOwnProperty.call(a,u[s]))return!1;if(t&&e instanceof Element)return!1;for(s=c;0!==s--;)if(("_owner"!==u[s]&&"__v"!==u[s]&&"__o"!==u[s]||!e.$$typeof)&&!i(e[u[s]],a[u[s]]))return!1;return!0}return e!==e&&a!==a}e.exports=function(e,t){try{return i(e,t)}catch(n){if((n.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw n}}},161:(e,t,n)=>{"use strict";var r,o=n(43),i=(r=o)&&"object"===typeof r&&"default"in r?r.default:r;function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c=!("undefined"===typeof window||!window.document||!window.document.createElement);e.exports=function(e,t,n){if("function"!==typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!==typeof t)throw new Error("Expected handleStateChangeOnClient to be a function.");if("undefined"!==typeof n&&"function"!==typeof n)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(r){if("function"!==typeof r)throw new Error("Expected WrappedComponent to be a React component.");var s,u=[];function l(){s=e(u.map((function(e){return e.props}))),f.canUseDOM?t(s):n&&(s=n(s))}var f=function(e){var t,n;function o(){return e.apply(this,arguments)||this}n=e,(t=o).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,o.peek=function(){return s},o.rewind=function(){if(o.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=s;return s=void 0,u=[],e};var a=o.prototype;return a.UNSAFE_componentWillMount=function(){u.push(this),l()},a.componentDidUpdate=function(){l()},a.componentWillUnmount=function(){var e=u.indexOf(this);u.splice(e,1),l()},a.render=function(){return i.createElement(r,this.props)},o}(o.PureComponent);return a(f,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(r)+")"),a(f,"canUseDOM",c),f}}},910:e=>{"use strict";e.exports=JSON.parse('[{"id":1,"title":"Article 1","description":"Description of article 1","author":"Author","imageUrl":"https://example.com/article1.jpg"},{"id":2,"title":"Article 2","description":"Description of article 2","author":"Author","imageUrl":"https://example.com/article2.jpg"}]')}}]);
//# sourceMappingURL=177.be2b2021.chunk.js.map