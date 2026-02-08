import * as fs from "fs";
import path from "path";
import { build } from "esbuild"

try {

    // ===== 初期設定 =====
    const DIST_DIR_PATH = "./dist"
    const TARGET_DIR_PATH = "./src/functions"


    // ===== 引数処理 =====
    const args = process.argv.slice(2);
    if (args.length === 0) {
        throw new Error('デプロイする関数を指定してください。');
    }
    // デプロイ対象の関数を取得
    let targetFuncs: string[] = [];
    if (args[0] === 'all') {
        targetFuncs = fs.readdirSync(TARGET_DIR_PATH);
    } else {
        targetFuncs = args;
    }
    console.log(`\n<<<<< デプロイ対象の関数 >>>>>`)
    targetFuncs.forEach(f => console.log(`・${f}`))


    // ===== 該当のファイルをビルド =====
    for (const func of targetFuncs) {
        const entry = path.join(TARGET_DIR_PATH, func, 'index.ts');

        // 存在チェック
        if (!fs.existsSync(entry)) {
            console.log(`⚠　${entry}が存在しません。`)
            continue;
        }

        const outDir = path.join(DIST_DIR_PATH, func);

        fs.mkdirSync(outDir, { recursive: true });

        console.log(`\n🔨 build: ${func}`);

        await build({
            entryPoints: [entry],
            bundle: true,
            platform: "node",
            target: "node24",
            outfile: path.join(outDir, "index.js"),
            sourcemap: false,
            minify: false,
            external: ["aws-sdk"], // Lambda標準
        });

        console.log(`✅ 完了: ${func}`);

    }



    // ビルド後のjsをzipファイルへ


    // lambdaへアップロード


} catch (error) {
    console.log('エラー発生')
    console.log(error)
}