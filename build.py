"""把 src/ 裡的頁面與兩支 JS 合併成根目錄的 index.html。修改 src/ 後執行：python3 build.py"""
from pathlib import Path
root = Path(__file__).parent
src = root / "src"
page = (src / "page.html").read_text(encoding="utf-8")
page = page.replace("/*__ZW_CORE__*/", (src / "zw-core.js").read_text(encoding="utf-8"))
page = page.replace("/*__ZW_ANALYSIS__*/", (src / "zw-analysis.js").read_text(encoding="utf-8"))
(root / "index.html").write_text(page, encoding="utf-8")
print("已產生 index.html")
