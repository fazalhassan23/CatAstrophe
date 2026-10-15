const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{randomUUID}=require('node:crypto');
const {PGlite}=require('@electric-sql/pglite');
test('real PostgreSQL schema retains top twenty, prevents replay and isolates boards',async()=>{
 const db=new PGlite();try{
 const schema=fs.readFileSync(require.resolve('../database/schema.sql'),'utf8');await db.exec(schema);await db.exec(schema);
 const id=randomUUID();const submit=(r,b,d,s)=>db.query('SELECT cat_submit_score($1::uuid,$2,$3,$4,$5,$6) AS accepted',[r,b,d,'Tester',s,'biscuit']);
 await submit(id,'classic','all',1);
 for(let i=2;i<=25;i++)await submit(randomUUID(),'classic','all',i);
 const rows=(await db.query('SELECT score FROM cat_scores ORDER BY score DESC')).rows;assert.equal(rows.length,20);assert.equal(rows[0].score,25);assert.equal(rows[19].score,6);
 assert.equal((await submit(id,'classic','all',999)).rows[0].accepted,false,'pruned scores cannot be replayed');
 await submit(randomUUID(),'daily',new Date().toISOString().slice(0,10),8);assert.equal((await db.query('SELECT count(*)::int AS n FROM cat_scores')).rows[0].n,21);
 for(let i=0;i<20;i++)assert.equal((await db.query("SELECT cat_rate_limit('test-client') AS allowed")).rows[0].allowed,true);
 assert.equal((await db.query("SELECT cat_rate_limit('test-client') AS allowed")).rows[0].allowed,false);
 }finally{await db.close()}
});
