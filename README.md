# 河洛紫微飛星排盤

by Catherine Wu

以河洛飛星派為主的紫微斗數線上排盤，整個網站只有一個靜態網頁，不需要伺服器。

## 功能

- 國曆／農曆輸入，可設定閏月與晚子時的算法
- 十四主星、甲級輔煞星、38 顆乙級星、長生十二神、博士十二神
- 宮干（五虎遁）、生年四化、十二宮飛化、自化（離心）、對宮化入
- 追忌（忌轉忌）、祿隨忌走、立太極、來因宮
- 疊盤：大限、流年、小限、流月（斗君）、流日
- 四化異說可切換：戊干化科、庚干四化、壬干化科
- 自動命盤分析：個性、姻緣、事業財運、健康、家庭六親、人際關係

## 檔案結構

```
index.html              ← 網站本體（由 build.py 產生）
manifest.webmanifest    ← 加到手機主畫面時的名稱與圖示
icons/                  ← 主畫面圖示、網站小圖示（icon.svg 為原始向量檔）
src/page.html           ← 頁面版型與互動程式
src/zw-core.js          ← 排盤核心：安星、四化、飛化、運限
src/zw-analysis.js      ← 命盤分析規則
build.py                ← 合併 src/ 成 index.html
```

## 放上 GitHub Pages

1. 在 GitHub 建立新的 repository，把這個資料夾的所有檔案上傳（包含 `.nojekyll`）。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
4. 約一分鐘後，網址會是 `https://你的帳號.github.io/repository名稱/`。

## 加到 iPhone 主畫面

1. 用 **Safari** 打開上面的網址。
2. 點下方的「分享」按鈕，選「加入主畫面」。
3. 名稱預設為「河洛紫微排盤」，按「新增」。之後從主畫面打開會以全螢幕顯示。

## 修改程式後重新產生網頁

修改 `src/` 裡的檔案後執行：

```
python3 build.py
```

再把新的 `index.html` 上傳即可。

## 第三方程式庫

農曆換算使用 [lunar-javascript](https://github.com/6tail/lunar-javascript)（MIT 授權），從 jsDelivr CDN 載入，因此網頁需要連網才能排盤。
