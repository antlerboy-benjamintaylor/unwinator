const e=document.querySelector('#enabled'), r=document.querySelector('#intensity'), o=document.querySelector('#value');
function show(){o.value=Math.round(r.value*100)+'%'}
async function send(){const intensity=Number(r.value); await chrome.storage.local.set({enabled:e.checked,intensity}); const [tab]=await chrome.tabs.query({active:true,currentWindow:true}); if(tab?.id) chrome.tabs.sendMessage(tab.id,{type:'set',enabled:e.checked,intensity}).catch(()=>{});}
chrome.storage.local.get({enabled:false,intensity:0.70},s=>{e.checked=s.enabled;r.value=s.intensity;show()});
e.addEventListener('change',send); r.addEventListener('input',()=>{show();send()});
