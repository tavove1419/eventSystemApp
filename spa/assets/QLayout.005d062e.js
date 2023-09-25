import{c as T,r as s,X as W,s as w,a as o,Y as v,V as F,w as E,Z as I,_ as O,h as r,j,I as B}from"./index.3a70196a.js";import{a as K,Q as L}from"./QScrollObserver.e445fbae.js";var V=T({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:t=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(t.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(t,{slots:R,emit:h}){const{proxy:{$q:i}}=j(),m=s(null),u=s(i.screen.height),g=s(t.container===!0?0:i.screen.width),S=s({position:0,direction:"down",inflectionPoint:0}),d=s(0),l=s(W.value===!0?0:w()),H=o(()=>"q-layout q-layout--"+(t.container===!0?"containerized":"standard")),p=o(()=>t.container===!1?{minHeight:i.screen.height+"px"}:null),q=o(()=>l.value!==0?{[i.lang.rtl===!0?"left":"right"]:`${l.value}px`}:null),x=o(()=>l.value!==0?{[i.lang.rtl===!0?"right":"left"]:0,[i.lang.rtl===!0?"left":"right"]:`-${l.value}px`,width:`calc(100% + ${l.value}px)`}:null);function P(e){if(t.container===!0||document.qScrollPrevented!==!0){const n={position:e.position.top,direction:e.direction,directionChanged:e.directionChanged,inflectionPoint:e.inflectionPoint.top,delta:e.delta.top};S.value=n,t.onScroll!==void 0&&h("scroll",n)}}function $(e){const{height:n,width:a}=e;let c=!1;u.value!==n&&(c=!0,u.value=n,t.onScrollHeight!==void 0&&h("scrollHeight",n),b()),g.value!==a&&(c=!0,g.value=a),c===!0&&t.onResize!==void 0&&h("resize",e)}function Q({height:e}){d.value!==e&&(d.value=e,b())}function b(){if(t.container===!0){const e=u.value>d.value?w():0;l.value!==e&&(l.value=e)}}let f=null;const z={instances:{},view:o(()=>t.view),isContainer:o(()=>t.container),rootRef:m,height:u,containerHeight:d,scrollbarWidth:l,totalWidth:o(()=>g.value+l.value),rows:o(()=>{const e=t.view.toLowerCase().split(" ");return{top:e[0].split(""),middle:e[1].split(""),bottom:e[2].split("")}}),header:v({size:0,offset:0,space:!1}),right:v({size:300,offset:0,space:!1}),footer:v({size:0,offset:0,space:!1}),left:v({size:300,offset:0,space:!1}),scroll:S,animate(){f!==null?clearTimeout(f):document.body.classList.add("q-body--layout-animate"),f=setTimeout(()=>{f=null,document.body.classList.remove("q-body--layout-animate")},155)},update(e,n,a){z[e][n]=a}};if(F(B,z),w()>0){let a=function(){e=null,n.classList.remove("hide-scrollbar")},c=function(){if(e===null){if(n.scrollHeight>i.screen.height)return;n.classList.add("hide-scrollbar")}else clearTimeout(e);e=setTimeout(a,300)},y=function(C){e!==null&&C==="remove"&&(clearTimeout(e),a()),window[`${C}EventListener`]("resize",c)},e=null;const n=document.body;E(()=>t.container!==!0?"add":"remove",y),t.container!==!0&&y("add"),I(()=>{y("remove")})}return()=>{const e=O(R.default,[r(K,{onScroll:P}),r(L,{onResize:$})]),n=r("div",{class:H.value,style:p.value,ref:t.container===!0?void 0:m,tabindex:-1},e);return t.container===!0?r("div",{class:"q-layout-container overflow-hidden",ref:m},[r(L,{onResize:Q}),r("div",{class:"absolute-full",style:q.value},[r("div",{class:"scroll",style:x.value},[n])])]):n}}});export{V as Q};
