import{W as w,j as s,Y as f}from"./app-CDfxkUEj.js";import{G as x}from"./GuestLayout-4VJo4ICR.js";import{T as t,I as m}from"./TextInput-DSJFpSKO.js";import{I as i}from"./InputLabel-BLmsyUwI.js";import{P as j}from"./PrimaryButton--0L5qqHQ.js";import"./ApplicationLogo-BbawVRmO.js";function C({token:l,email:n}){const{data:e,setData:o,post:d,processing:p,errors:r,reset:c}=w({token:l,email:n,password:"",password_confirmation:""}),u=a=>{a.preventDefault(),d(route("password.store"),{onFinish:()=>c("password","password_confirmation")})};return s.jsxs(x,{children:[s.jsx(f,{title:"Reset Password"}),s.jsxs("form",{onSubmit:u,children:[s.jsxs("div",{children:[s.jsx(i,{htmlFor:"email",value:"Email"}),s.jsx(t,{id:"email",type:"email",name:"email",value:e.email,className:"mt-1 block w-full",autoComplete:"username",onChange:a=>o("email",a.target.value)}),s.jsx(m,{message:r.email,className:"mt-2"})]}),s.jsxs("div",{className:"mt-4",children:[s.jsx(i,{htmlFor:"password",value:"Password"}),s.jsx(t,{id:"password",type:"password",name:"password",value:e.password,className:"mt-1 block w-full",autoComplete:"new-password",isFocused:!0,onChange:a=>o("password",a.target.value)}),s.jsx(m,{message:r.password,className:"mt-2"})]}),s.jsxs("div",{className:"mt-4",children:[s.jsx(i,{htmlFor:"password_confirmation",value:"Confirm Password"}),s.jsx(t,{type:"password",id:"password_confirmation",name:"password_confirmation",value:e.password_confirmation,className:"mt-1 block w-full",autoComplete:"new-password",onChange:a=>o("password_confirmation",a.target.value)}),s.jsx(m,{message:r.password_confirmation,className:"mt-2"})]}),s.jsx("div",{className:"flex items-center justify-end mt-4",children:s.jsx(j,{className:"ms-4",disabled:p,children:"Reset Password"})})]})]})}export{C as default};
