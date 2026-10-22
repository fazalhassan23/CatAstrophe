const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync(path.join(root,'style.css'),'utf8')+'</style>');
html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,f)=>'<script>'+fs.readFileSync(path.join(root,f),'utf8')+'</script>');
// Embed story photos so the standalone file remains portable and works offline.
html=html.replace(/assets\/cats\/[a-z]+\.png/g,file=>'data:image/png;base64,'+fs.readFileSync(path.join(root,file)).toString('base64'));
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist','cat-astrophe.html'),html);console.log('Built dist/cat-astrophe.html (offline, no dependencies)');
