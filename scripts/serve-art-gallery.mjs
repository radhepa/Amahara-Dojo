import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../artwork/gallery/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2'};
// Serve ONLY the spoiler-reviewed gallery; there is no route to author material.
const server=http.createServer(async(req,res)=>{
 try{
  const requestPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(root,'.'+(requestPath==='/'?'/index.html':requestPath));
  const relative=path.relative(root,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||!types[path.extname(file)]){res.writeHead(404);res.end();return;}
  const body=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; img-src 'self'; font-src 'self'; script-src 'self'; style-src 'self'; connect-src 'none'; frame-ancestors 'none'"});res.end(body);
 }catch{res.writeHead(404);res.end();}
});
server.listen(Number(process.env.DOJO_GALLERY_PORT||4318),'127.0.0.1',()=>console.log('Spoiler-free art gallery: http://127.0.0.1:'+server.address().port));
