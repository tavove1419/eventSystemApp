import{c as g,F as o,G as t,a as s,h,d as p,j as d,I as y,W as f,aH as v}from"./index.3a70196a.js";var Q=g({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(n,{slots:i}){const{proxy:{$q:r}}=d(),e=o(y,t);if(e===t)return console.error("QPage needs to be a deep child of QLayout"),t;if(o(f,t)===t)return console.error("QPage needs to be child of QPageContainer"),t;const u=s(()=>{const a=(e.header.space===!0?e.header.size:0)+(e.footer.space===!0?e.footer.size:0);if(typeof n.styleFn=="function"){const l=e.isContainer.value===!0?e.containerHeight.value:r.screen.height;return n.styleFn(a,l)}return{minHeight:e.isContainer.value===!0?e.containerHeight.value-a+"px":r.screen.height===0?a!==0?`calc(100vh - ${a}px)`:"100vh":r.screen.height-a+"px"}}),c=s(()=>`q-page${n.padding===!0?" q-layout-padding":""}`);return()=>h("main",{class:c.value,style:u.value},p(i.default))}});function F(){return o(v)}export{Q,F as u};
