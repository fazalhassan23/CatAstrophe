const {createHmac,randomUUID,timingSafeEqual}=require('node:crypto');
const today=()=>new Date().toISOString().slice(0,10);
function sign(value,secret){return createHmac('sha256',secret).update(value).digest('base64url')}
function issue(board,secret){const data={id:randomUUID(),board,date:board==='daily'?today():'all',started:Date.now()};const body=Buffer.from(JSON.stringify(data)).toString('base64url');return body+'.'+sign(body,secret)}
function verify(token,secret){
 if(typeof token!=='string'||token.length>1000)throw Error('Invalid flight ticket.');
 const [body,signature]=token.split('.'),expected=sign(body||'',secret);
 if(!signature||signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))throw Error('Invalid flight ticket.');
 const data=JSON.parse(Buffer.from(body,'base64url'));const age=Date.now()-data.started;
 if(data.board==='daily'&&data.date!==today())throw Error('Daily flight expired at midnight UTC. Start a new flight.');
 if(age<0||age>86400000||!['classic','daily'].includes(data.board))throw Error('Flight ticket expired. Start a new flight.');return data;
}
function submission(body,secret){
 const ticket=verify(body.token,secret),name=typeof body.name==='string'?body.name.trim().normalize('NFKC'):'';
 if(!/^[\p{L}\p{N} _.-]{1,20}$/u.test(name))throw Error('Use 1–20 letters, numbers, spaces, dots, dashes or underscores.');
 if(!['biscuit','mochi','pounce'].includes(body.cat)||ticket.board==='daily'&&body.cat!=='biscuit')throw Error('Invalid cat.');
 const {score,seconds}=body;
 if(!Number.isInteger(score)||score<1||score>1000000||!Number.isFinite(seconds)||seconds<0||seconds>86400||seconds>(Date.now()-ticket.started)/1000+2||score>100+seconds*100)throw Error('Score could not be validated.');
 return{...ticket,name,cat:body.cat,score};
}
function createHandler({sql,secret}){return async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 try{
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Method not allowed.'})}
  if(!sql||!secret)return res.status(503).json({error:'Global scores are not connected yet. Your local progress is safe.'});
  if(req.method==='GET'){
   const board=req.query?.board==='daily'?'daily':'classic',date=board==='daily'?today():'all';
   const rows=await sql`SELECT run_id AS id, name, score, cat FROM cat_scores WHERE board=${board} AND flight_date=${date} ORDER BY score DESC, created_at ASC, run_id ASC LIMIT 20`;
   return res.status(200).json({board,date,rows});
  }
  if(req.headers.origin&&req.headers.origin!==`https://${req.headers.host}`&&req.headers.origin!==`http://${req.headers.host}`)return res.status(403).json({error:'Invalid origin.'});
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body}catch{return res.status(400).json({error:'Invalid JSON.'})}
  if(!body||JSON.stringify(body).length>2048)return res.status(400).json({error:'Invalid request.'});
  const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'local').split(',')[0];
  const key=sign(ip,secret);
  const [limit]=await sql`SELECT cat_rate_limit(${key}) AS allowed`;
  if(!limit.allowed)return res.status(429).json({error:'Too many requests. Please wait a minute.'});
  if(body.action==='start'){
   if(!['classic','daily'].includes(body.board))return res.status(400).json({error:'Invalid board.'});
   return res.status(200).json({token:issue(body.board,secret)});
  }
  let entry;try{entry=submission(body,secret)}catch(e){return res.status(400).json({error:e.message})}
  const [result]=await sql`SELECT cat_submit_score(${entry.id}::uuid,${entry.board},${entry.date},${entry.name},${entry.score},${entry.cat}) AS accepted`;
  return res.status(200).json({id:entry.id,accepted:result.accepted});
 }catch{return res.status(503).json({error:'Global scores are temporarily unavailable. Please try again.'})}
}}
module.exports={createHandler,issue,verify,submission,today};
