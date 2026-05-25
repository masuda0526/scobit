import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";
import archiver from "archiver";
import { error } from "console";
import { build } from "esbuild";
import fs from "fs";
import path from "path";

const targetDir = process.argv[2];
const distDir = "dist";
const inputFile = path.join("src", "LambdaHandler", targetDir, "index.ts")
const outFile = path.join(distDir, targetDir, 'index.js');

const main = async () => {
  console.log('=============== ビルドスタート ===============');
  console.log(`InputFile:${inputFile}`);
  console.log(`-> OutputFile:${outFile}`);
  await build({
    entryPoints: [inputFile],
    bundle: true,              // 依存関係をすべてまとめる
    platform: "node",
    target: "node22",
    outfile: outFile,
    format: "cjs",             // Node.js 18以降のLambdaはESM対応
    sourcemap: false,
    minify: true,
  });
  }
  
  main().catch(error => {
    console.log(error);
    console.log('ビルドに失敗しました');
});
    console.log('================= ビルド成功 =================');