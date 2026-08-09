(() => {
  const SKIP = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','SELECT','OPTION','CODE','PRE','KBD','SAMP','SVG','MATH']);
  const original = new WeakMap();
  let enabled = false, intensity = 0.70;

  const whole = new Map(Object.entries({
    'wikipedia':'pikiwedia','encyclopedia':'enfryclodepia','sandwich':'handwich',
    'ham':'sam','cheese':'veese','lettuce':'tettuce','tomato':'omato','onion':'lonion',
    'mustard':'maystard','mayonnaise':'muonnaise','supermarket':'westermarket',
    'supermarkets':'westermarkets','preparation':'creparation','consumption':'ponsumption',
    'common':'compon','component':'commonent','components':'commonents',
    'bread':'slead','sliced':'briced','cooked':'sooked','smoked':'hiced',
    'packed':'lacked','lunches':'punches','british':'slitish','violent':'chiolent',
    'voyage':'choyage','population':'populativode','migration':'migrativode',
    'background':'background','history':'histery-wise','century':'century-fold'
  }));

  const starts = [
    [/^sp/i,'ps'], [/^st/i,'ts'], [/^sk/i,'ks'], [/^pl/i,'lp'], [/^pr/i,'cr'],
    [/^cl/i,'sl'], [/^cr/i,'pr'], [/^br/i,'sl'], [/^tr/i,'fr'], [/^fr/i,'tr'],
    [/^ch/i,'v'], [/^v/i,'ch'], [/^th/i,'f'], [/^wh/i,'w']
  ];
  const suffixes = ['-wise','-fold','-ode','-olly','-acious','-ibode','-most','-only'];

  function hash(s){ let h=2166136261; for(const c of s){h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return (h>>>0)/4294967296; }
  function preserveCase(src, out){
    if(!out) return src;
    if(src.toUpperCase()===src) return out.toUpperCase();
    if(src[0]===src[0].toUpperCase()) return out[0].toUpperCase()+out.slice(1);
    return out;
  }
  function onset(w){
    const m=w.match(/^(?:sch|scr|shr|spl|spr|squ|str|thr|chr|ph|sh|ch|th|wh|qu|[bcdfghjklmnpqrstvwxyz]{1,3})/i);
    return m ? m[0] : '';
  }
  function swapPair(a,b,key){
    const oa=onset(a), ob=onset(b);
    if(!oa || !ob || oa.toLowerCase()===ob.toLowerCase()) return [a,b];
    const na=ob + a.slice(oa.length), nb=oa + b.slice(ob.length);
    if(na.length<2 || nb.length<2) return [a,b];
    return [preserveCase(a,na.toLowerCase()), preserveCase(b,nb.toLowerCase())];
  }
  function word(w, idx){
    const low=w.toLowerCase();
    if(whole.has(low)) return preserveCase(w, whole.get(low));
    if(w.length < 4 || hash(low+'|'+idx) > intensity) return w;
    let out=low;
    for(const [re,r] of starts){ if(re.test(out)){ out=out.replace(re,r); break; } }
    const r=hash(low+'suffix');
    if(r < intensity*0.18 && out.length>6) out = out.replace(/(ing|ed|ly|tion|ment|ness|ity)$/,'') + suffixes[Math.floor(hash(low+'pick')*suffixes.length)];
    else if(r < intensity*0.34 && /tion$/.test(out)) out=out.replace(/tion$/,'tivode');
    else if(r < intensity*0.48 && /ing$/.test(out)) out=out.replace(/ing$/,'inbold');
    return preserveCase(w,out);
  }
  function transform(s){
    const tokens=s.split(/(\b[A-Za-z][A-Za-z'-]*\b)/);
    const wordSlots=[];
    for(let i=1;i<tokens.length;i+=2) wordSlots.push(i);
    for(let j=0;j<wordSlots.length-1;j++){
      const ia=wordSlots[j], ib=wordSlots[j+1];
      const a=tokens[ia], b=tokens[ib];
      const gap=tokens[ia+1] || '';
      if(/[.!?;:\n]/.test(gap)) continue;
      const chance=Math.max(0,(intensity-0.25))*0.72;
      if(a.length>2 && b.length>2 && hash(a.toLowerCase()+' '+b.toLowerCase()+'|spoon') < chance){
        [tokens[ia],tokens[ib]]=swapPair(a,b,j);
        j++;
      }
    }
    let idx=0;
    for(const i of wordSlots) tokens[i]=word(tokens[i],idx++);
    return tokens.join('');
  }
  function eligible(n){ const p=n.parentElement; return p && !SKIP.has(p.tagName) && !p.closest('[contenteditable="true"],script,style,textarea,input,select,code,pre'); }
  function apply(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    for(const n of nodes){ if(!eligible(n) || !n.nodeValue.trim()) continue; if(!original.has(n)) original.set(n,n.nodeValue); n.nodeValue=transform(original.get(n)); }
  }
  function restore(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){ const n=walker.currentNode; if(original.has(n)) n.nodeValue=original.get(n); }
  }
  const observer=new MutationObserver(ms=>{ if(!enabled) return; for(const m of ms) for(const n of m.addedNodes) if(n.nodeType===1) apply(n); });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  chrome.runtime.onMessage.addListener((msg,_sender,send)=>{
    if(msg.type==='set'){ enabled=!!msg.enabled; intensity=Number(msg.intensity ?? intensity); enabled?apply():restore(); send({ok:true}); }
    if(msg.type==='status') send({enabled,intensity});
  });
  chrome.storage.local.get({enabled:false,intensity:0.70}, s=>{ enabled=s.enabled; intensity=s.intensity; if(enabled) apply(); });
})();
