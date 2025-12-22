(async()=>{
  try{
    const fetch = global.fetch || (await import('node-fetch')).default;
    const login = await fetch('http://localhost:3000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'test+copilot@example.com',password:'password123'})});
    const tok = await login.json();
    console.log('login', login.status, tok);
    if(!tok.token) return;
    const resp = await fetch('http://localhost:3000/api/loans',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+tok.token},body:JSON.stringify({productId:'69477f911d8101e26941f05e',applicantName:'Kunal Tyagi',applicantEmail:'kunal@gmail.com',principal:300000,tenureMonths:24})});
    console.log('create status', resp.status);
    console.log(await resp.text());
  }catch(e){console.error(e);}
})();
