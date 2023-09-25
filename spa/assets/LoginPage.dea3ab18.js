import{c as j,r as q,V as R,ai as z,aj as $,o as k,h as N,d as O,j as U,aI as D,E as I,n as J,aJ as K,aK as M,J as E,L as B,M as L,N as d,O as n,aE as P,Q as _,R as Q,as as T,a6 as g,aL as G,a8 as H,u as W,a9 as X,at as Y,au as Z}from"./index.3a70196a.js";import{u as ee,Q as te}from"./use-quasar.8fefc9fa.js";var oe=j({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(o,{slots:u,emit:m}){const i=U(),s=q(null);let f=0;const c=[];function y(e){const l=typeof e=="boolean"?e:o.noErrorFocus!==!0,p=++f,C=(t,a)=>{m("validation"+(t===!0?"Success":"Error"),a)},V=t=>{const a=t.validate();return typeof a.then=="function"?a.then(r=>({valid:r,comp:t}),r=>({valid:!1,comp:t,err:r})):Promise.resolve({valid:a,comp:t})};return(o.greedy===!0?Promise.all(c.map(V)).then(t=>t.filter(a=>a.valid!==!0)):c.reduce((t,a)=>t.then(()=>V(a).then(r=>{if(r.valid===!1)return Promise.reject(r)})),Promise.resolve()).catch(t=>[t])).then(t=>{if(t===void 0||t.length===0)return p===f&&C(!0),!0;if(p===f){const{comp:a,err:r}=t[0];if(r!==void 0&&console.error(r),C(!1,a),l===!0){const w=t.find(({comp:F})=>typeof F.focus=="function"&&D(F.$)===!1);w!==void 0&&w.comp.focus()}}return!1})}function x(){f++,c.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function b(e){e!==void 0&&I(e);const l=f+1;y().then(p=>{l===f&&p===!0&&(o.onSubmit!==void 0?m("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function h(e){e!==void 0&&I(e),m("reset"),J(()=>{x(),o.autofocus===!0&&o.noResetFocus!==!0&&v()})}function v(){K(()=>{if(s.value===null)return;const e=s.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||s.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||s.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(s.value.querySelectorAll("[tabindex]"),l=>l.tabIndex>-1);e!=null&&e.focus({preventScroll:!0})})}R(M,{bindComponent(e){c.push(e)},unbindComponent(e){const l=c.indexOf(e);l>-1&&c.splice(l,1)}});let S=!1;return z(()=>{S=!0}),$(()=>{S===!0&&o.autofocus===!0&&v()}),k(()=>{o.autofocus===!0&&v()}),Object.assign(i.proxy,{validate:y,resetValidation:x,submit:b,reset:h,focus:v,getValidationComponents:()=>c}),()=>N("form",{class:"q-form",ref:s,onSubmit:b,onReset:h},O(u.default))}});const ae={class:"q-gutter-sm row items-center no-wrap justify-center"},se=E({__name:"LoginComponent",setup(o){const u=q({username:null,password:null});return(m,i)=>(B(),L(oe,{class:"q-gutter-md"},{default:d(()=>[n(P,{filled:"",modelValue:u.value.username,"onUpdate:modelValue":i[0]||(i[0]=s=>u.value.username=s),label:"Usuario","lazy-rules":""},null,8,["modelValue"]),n(P,{type:"password",filled:"",modelValue:u.value.password,"onUpdate:modelValue":i[1]||(i[1]=s=>u.value.password=s),label:"Contrase\xF1a","lazy-rules":""},null,8,["modelValue"]),_("div",ae,[n(Q,{label:"Login",to:"/",type:"button",color:"primary"}),n(Q,{label:"Cancelar",to:"/",type:"button",color:"negative"})])]),_:1}))}});const A=o=>(Y("data-v-1f450348"),o=o(),Z(),o),ne=A(()=>_("img",{src:"src/assets/profile.svg"},null,-1)),re=A(()=>_("div",{class:"text-center q-pt-lg"},[_("div",{class:"col text-h6 ellipsis"}," Inicio Sesi\xF3n ")],-1)),ue=E({__name:"LoginPage",setup(o){const u=ee();return(m,i)=>(B(),L(te,{class:"flex bg-image flex-center"},{default:d(()=>[n(X,{style:H(W(u).screen.lt.sm?{width:"80%"}:{width:"30%"})},{default:d(()=>[n(g,null,{default:d(()=>[n(G,{size:"103px",class:"absolute-center shadow-10"},{default:d(()=>[ne]),_:1})]),_:1}),n(g,null,{default:d(()=>[re]),_:1}),n(g,null,{default:d(()=>[n(se)]),_:1})]),_:1},8,["style"])]),_:1}))}});var de=T(ue,[["__scopeId","data-v-1f450348"]]);export{de as default};
