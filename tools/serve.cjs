const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.PORT)||4173;
http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[path.extname(file)]||'text/plain');res.setHeader('Cache-Control','no-store');res.end(data)})
}).listen(port,'127.0.0.1',()=>console.log(`CAT-ASTROPHE! http://127.0.0.1:${port}`));
