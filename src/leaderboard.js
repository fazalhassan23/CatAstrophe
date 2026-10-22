/* Optional online scores. Offline failures never interrupt a flight. */
(function(root){
async function request(body,board='classic'){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try{const response=await fetch('/api/leaderboard'+(body?'':'?board='+board),{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal});let data;try{data=await response.json()}catch{throw Error('Global scores need the online Vercel build.')}
 if(!response.ok)throw Error(data.error||'Global scores are unavailable.');return data;
 }finally{clearTimeout(timer)}
}
function element(tag,text){const e=document.createElement(tag);if(text)e.textContent=text;return e}
async function list(container,board,id){
 const load=container._load=(container._load||0)+1;container.replaceChildren(element('p','Loading global scores…'));
 try{const data=await request(null,board);if(container._load!==load)return;container.replaceChildren();
 container.append(element('p',board==='daily'?'Daily · '+data.date+' · resets at midnight UTC':'Classic · all time'));
 if(!data.rows.length){container.append(element('p','No scores yet. Be the first menace!'));return}
 const table=element('table');table.className='scoreboard';const header=element('tr');for(const title of ['Rank','Name','Score','Cat'])header.append(element('th',title));table.append(header);
 data.rows.forEach((row,i)=>{const tr=element('tr');if(row.id===id)tr.className='your-score';for(const value of [String(i+1),row.name,String(row.score),CatCore.ROSTER[row.cat]?.name||row.cat])tr.append(element('td',value));table.append(tr)});container.append(table);
 if(id&&!data.rows.some(r=>r.id===id))container.append(element('p','Score submitted. You haven’t reached the top 100 yet.'));
 }catch(e){if(container._load!==load)return;container.replaceChildren(element('p',e.message));const retry=element('button','Retry loading scores');retry.onclick=()=>list(container,board,id);container.append(retry)}
}
function ticket(board){return request({action:'start',board}).then(d=>({token:d.token})).catch(e=>({error:e.message}))}
function mount(panel,run,board){
 const area=element('section');area.className='global-scores';area.append(element('h3','GLOBAL TOP 100'));
 const form=element('form'),label=element('label','Your nickname'),input=element('input');input.maxLength=20;input.required=true;input.autocomplete='nickname';label.append(input);
 try{input.value=localStorage.getItem('catastrophe-nickname')||''}catch{}
 const submit=element('button','Submit score');submit.type='submit';submit.className='submit-score';const status=element('p');status.setAttribute('aria-live','polite');
 form.append(label,submit);area.append(form,status);const scores=element('div'),boardDetails=element('details'),summary=element('summary','View global top 100');boardDetails.className='board-details';boardDetails.append(summary,scores);area.append(boardDetails);panel.append(area);let loaded=false;boardDetails.ontoggle=()=>{if(boardDetails.open&&!loaded){loaded=true;list(scores,board)}};
 form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;status.textContent='Submitting…';
 try{const t=await run.onlineTicket;if(!t?.token)throw Error(t?.error||'This flight has no online ticket. Start a new flight to submit.');const name=input.value.trim();const data=await request({token:t.token,name,score:run.score,seconds:run.time,cat:run.cat});try{localStorage.setItem('catastrophe-nickname',name)}catch{}status.textContent=data.accepted?'Score submitted!':'This flight was already submitted.';input.disabled=true;submit.textContent='Submitted';loaded=true;boardDetails.open=true;await list(scores,board,data.id)}
 catch(err){status.textContent=err.message;submit.disabled=false}
 };
}
root.CatBoard={ticket,list,mount};
})(globalThis);
