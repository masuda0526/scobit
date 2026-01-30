import { build } from "esbuild";
import path from "path";
import fs from "fs";
import archiver from 'archiver';

const distDir = 'dist';
const funcs = [
  'addProject',
  'createUser',
  'editProject',
  'getProjects',
  'getProjectOne',
  'editInfo',
  'login'
];

for(const func of funcs){
  const entry = path.join('src', 'functions', func, 'index.ts');
  const outFile = path.join(distDir, func, 'handler.cjs');
  const zipFile = path.join(distDir, `${func}.zip`);

  fs.mkdirSync(path.dirname(outFile), {recursive:true});

  await build({
    entryPoints:[entry],
    bundle:true,
    platform:'node',
    target:'node22',
    format:'cjs',
    outfile:outFile,
    sourcemap:false,
    minify:true
  })

  // zip作成
  const output = fs.createWriteStream(zipFile);
  const archive = archiver('zip', {zlib:{level:9}});
  archive.pipe(output);
  archive.file(outFile, {name:'handler.cjs'});
  await archive.finalize();

}