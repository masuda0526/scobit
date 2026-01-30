import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";
import archiver from "archiver";
import { error } from "console";
import { build } from "esbuild";
import fs from "fs";
import path from "path";

const distDir = "dist";
const outFile = path.join(distDir, 'handler.cjs');
const zipFile = path.join(distDir, 'lambda.zip');
const lambdaFunctionName = "gantsuleFunc";

const main = async () => {
  console.log('ビルドスタート');
  await build({
    entryPoints: ["index.ts"],
    bundle: true,              // 依存関係をすべてまとめる
    platform: "node",
    target: "node22",
    outfile: outFile,
    format: "cjs",             // Node.js 18以降のLambdaはESM対応
    sourcemap: false,
    minify: true,
  });
  
  if(!fs.existsSync(distDir)){
    console.log(`${distDir}ディレクトリ作成`)
    fs.mkdirSync(distDir, {recursive:true})
  } 

  console.log('ZIPファイルにまとめる');
  const output = fs.createWriteStream(zipFile);
  const archive = archiver("zip", {zlib:{level:9}});

  archive.pipe(output);
  archive.file(outFile, {name:"handler.cjs"});
  await archive.finalize();

  await new Promise((resolve, reject) => {
    output.on("close", () => {
      console.log(`✅ ZIPファイル完了 (${archive.pointer()} bytes)`);
      resolve();
    });
    output.on("error", reject);
  });

  console.log('ZIPファイル作成完了');

  console.log('AWSへのアップロード');
  const client = new LambdaClient({region:'ap-northeast-1'});
  const zipBuf = fs.readFileSync(zipFile);

  const command = new UpdateFunctionCodeCommand({
    FunctionName: lambdaFunctionName,
    ZipFile:zipBuf
  })

  const response = await client.send(command);
  console.log('デプロイ完了', response.FunctionArn);
}

main().catch(error => {
  console.log(error);
  console.log('ビルドに失敗しました');
})