/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var d="[=(),; \t\"']|%(09|20|22|27|28|29|2c|2C|3b|3B)",s="\\$\\w+",o="[a-zA-Z_\\u0080-\\uFFFF][\\w\\u0080-\\uFFFF]*",w="(?:[ \\t]|%09|%20)",r=new RegExp(w+"+","g"),a=new RegExp("^not"+w+"+"),O="("+w+"+)(and|eq|ge|gt|le|lt|ne|or)"+w+"*",g="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",S="(?:\\*|%2[aA])",n=o+"(?:[./]"+o+")*"+"(?:[./]"+S+"|/\\$ref|/\\$count)?",b=S+"(?:/\\$ref)?",p=n+"|"+b,v='(?:[-+:./\\w"]|%2[bB])+',e=new RegExp("^(?:"+O+"|"+d+"|("+g+")|("+p+")|("+v+")|("+s+"))"),f=/^[0-9a-f]{2}$/i,F={"ceiling":{ambiguousParameters:true},"concat":{type:"Edm.String"},"contains":{type:"Edm.Boolean"},"day":{type:"Edm.Int32",ambiguousParameters:true},"endswith":{type:"Edm.Boolean"},"floor":{ambiguousParameters:true},"hour":{type:"Edm.Int32",ambiguousParameters:true},"indexof":{type:"Edm.Int32"},"length":{type:"Edm.Int32"},"minute":{type:"Edm.Int32",ambiguousParameters:true},"month":{type:"Edm.Int32",ambiguousParameters:true},"round":{ambiguousParameters:true},"second":{type:"Edm.Int32",ambiguousParameters:true},"startswith":{type:"Edm.Boolean"},"substring":{type:"Edm.String"},"tolower":{type:"Edm.String"},"toupper":{type:"Edm.String"},"trim":{type:"Edm.String"},"year":{type:"Edm.Int32",ambiguousParameters:true}},m={"(":{lbp:9,led:function(T,L){var c,i;if(L.id!=="PATH"){this.error("Unexpected ",T);}c=F[L.value];if(!c){this.error("Unknown function ",L);}L.id="FUNCTION";if(c.type){L.type=c.type;}L.parameters=[];do{this.advanceBws();i=this.expression(0);if(c.ambiguousParameters){i.ambiguous=true;}L.parameters.push(i);this.advanceBws();}while(this.advanceIf(","));this.advanceBws();this.advance(')');return L;},nud:function(){this.advanceBws();var T=this.expression(0);this.advanceBws();this.advance(')');return T;}},"not":{lbp:7,nud:function(T){T.precedence=7;T.right=this.expression(7);T.type="Edm.Boolean";return T;}}};function h(i,L){m[i]={lbp:L,led:function(T,c){T.type="Edm.Boolean";T.precedence=L;T.left=c;T.right=this.expression(L);return T;}};}function j(i){m[i]={lbp:0,nud:function(T){T.precedence=99;return T;}};}h("and",2);h("eq",3);h("ge",4);h("gt",4);h("le",4);h("lt",4);h("ne",3);h("or",1);j("PATH");j("VALUE");function P(){}P.prototype.advance=function(E){var T=this.current();if(E&&(!T||T.id!==E)){if(E==="OPTION"){E="system query option";}else if(E.length===1){E="'"+E+"'";}this.expected(E,T);}this.iCurrentToken+=1;return T;};P.prototype.advanceIf=function(E){var T=this.current();if(T&&T.id===E){this.iCurrentToken+=1;return true;}return false;};P.prototype.current=function(){return this.aTokens[this.iCurrentToken];};P.prototype.error=function(M,T){var v;if(T){v=T.value;M+="'"+(v===" "?v:v.replace(r,""))+"' at "+T.at;}else{M+="end of input";}throw new SyntaxError(M+": "+this.sText);};P.prototype.expected=function(W,T){this.error("Expected "+W+" but instead saw ",T);};P.prototype.finish=function(R){if(this.iCurrentToken<this.aTokens.length){this.expected("end of input",this.aTokens[this.iCurrentToken]);}return R;};P.prototype.init=function(T){this.sText=T;this.aTokens=x(T);this.iCurrentToken=0;};function k(){}k.prototype=Object.create(P.prototype);k.prototype.advanceBws=function(){var T;for(;;){T=this.current();if(!T||(T.id!==" "&&T.id!=="\t")){return;}this.advance();}};k.prototype.expression=function(R){var L,c,T;T=this.advance();if(!T){this.expected("expression");}L=this.getSymbolValue(T,"nud");if(!L){this.expected("expression",T);}c=L.call(this,T);T=this.current();while(T&&this.getSymbolValue(T,"lbp",0)>R){c=this.getSymbolValue(T,"led").call(this,this.advance(),c);T=this.current();}return c;};k.prototype.getSymbolValue=function(T,W,D){var c=m[T.id];return c&&W in c?c[W]:D;};k.prototype.parse=function(c){this.init(c);return this.finish(this.expression(0));};function K(){}K.prototype=Object.create(P.prototype);K.prototype.parse=function(c){var i,y={},v;this.init(c);this.advance("(");if(this.current().id==="VALUE"){y[""]=this.advance().value;}else{do{i=this.advance("PATH").value;this.advance("=");v=this.advance("VALUE").value;y[i]=v;}while(this.advanceIf(","));}this.advance(")");this.finish();return y;};function l(){}l.prototype=Object.create(P.prototype);l.prototype.parse=function(c){this.init(c);return this.finish(this.parseSystemQueryOption());};l.prototype.parseAnythingWithBrackets=function(c){var v="",R={},T,i=this;function y(){for(;;){T=i.advance();if(!T||T.id===';'){i.expected("')'",T);}v+=T.value;if(T.id===")"){return;}if(T.id==="("){y();}}}this.advance("=");for(;;){T=this.current();if(!T||T.id===")"||T.id===";"){break;}v+=this.advance().value;if(T.id==="("){y();}}if(!v){this.expected("an option value",T);}R[c.value]=v;return R;};l.prototype.parseExpand=function(){var E={},c,Q,i,V;this.advance("=");do{V=null;c=this.advance("PATH").value.replace(/%2a/i,"*");if(this.advanceIf("(")){V={};do{Q=this.parseSystemQueryOption();i=Object.keys(Q)[0];V[i]=Q[i];}while(this.advanceIf(";"));this.advance(")");}E[c]=V;}while(this.advanceIf(","));return{"$expand":E};};l.prototype.parseSelect=function(){var p,c,i=[],T;this.advance("=");do{T=this.advance("PATH");p=T.value.replace(/%2a/i,"*");if(this.advanceIf("(")){c="(";do{p+=c+this.advance("PATH").value;c=",";}while(this.advanceIf(","));p+=this.advance(")").value;}i.push(p);}while(this.advanceIf(","));return{"$select":i};};l.prototype.parseSystemQueryOption=function(){var T=this.advance('OPTION');switch(T.value){case"$expand":return this.parseExpand();case"$select":return this.parseSelect();default:return this.parseAnythingWithBrackets(T);}};function u(E){return String.fromCharCode(parseInt(E,16));}function t(N,y,A){var i;function z(C){var c=N[i];if(c==="%"&&N[i+1]==="2"&&N[i+2]==="7"){c="'";if(C){i+=2;}}if(C){i+=1;}return c;}for(i=1;i<N.length;){if(z(true)==="'"){if(z(false)!=="'"){return N.slice(0,i);}z(true);}}throw new SyntaxError("Unterminated string at "+A+": "+y);}function q(N,y,A){var c,E,z=false,i;for(i=1;i<N.length;i+=1){if(z){z=false;}else{c=N[i];if(c==="%"){E=N.slice(i+1,i+3);if(f.test(E)){c=u(E);i+=2;}}if(c==='"'){return N.slice(0,i+1);}z=c==='\\';}}throw new SyntaxError("Unterminated string at "+A+": "+y);}function x(c){var A=1,i,M,N=c,y,T,z=[],v;while(N.length){M=e.exec(N);y=0;if(M){v=M[0];if(M[7]){i="OPTION";}else if(M[6]||M[4]){i="VALUE";}else if(M[5]){i="PATH";if(v==="false"||v==="true"||v==="null"){i="VALUE";}else if(v==="not"){i="not";M=a.exec(N);if(M){v=M[0];}}}else if(M[3]){i=u(M[3]);}else if(M[2]){i=M[2];y=M[1].length;}else{i=M[0];}if(i==='"'){i="VALUE";v=q(N,c,A);}else if(i==="'"){i="VALUE";v=t(N,c,A);}T={at:A+y,id:i,value:v};}else{throw new SyntaxError("Unknown character '"+N[0]+"' at "+A+": "+c);}N=N.slice(v.length);A+=v.length;z.push(T);}return z;}return{buildFilterString:function(c){function i(N,y){var z;if(!N){return"";}if(N.parameters){z=N.parameters.map(function(A){return i(A,0);}).join(",");return N.value+"("+z+")";}z=i(N.left,N.precedence)+N.value+i(N.right,N.precedence);if(N.precedence<y){z="("+z+")";}return z;}return i(c,0);},parseFilter:function(c){return new k().parse(c);},parseKeyPredicate:function(c){return new K().parse(c);},parseSystemQueryOption:function(c){return new l().parse(c);}};},false);