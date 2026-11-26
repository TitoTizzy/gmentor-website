"""Build the public GitHub Pages bundle (_site/) with only the files the website needs.

Everything else in the repository (content-sources/, archive/, src/, supabase/, original
unwatermarked drawings, CV extracts...) stays private to the repo and is NOT published.
Run locally with:  python scripts/build_pages.py   (then open _site/index.html)
"""
import os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "_site")
PAGES = [f for f in os.listdir(ROOT) if f.endswith(".html")]
DIRS = ["css", "js", "assets"]
EXTRA = [".nojekyll", "CNAME", "robots.txt"]

shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT)
for f in PAGES + [e for e in EXTRA if os.path.exists(os.path.join(ROOT, e))]:
    shutil.copy2(os.path.join(ROOT, f), os.path.join(OUT, f))
for d in DIRS:
    shutil.copytree(os.path.join(ROOT, d), os.path.join(OUT, d))
open(os.path.join(OUT, ".nojekyll"), "w").close()

# Copy only the images actually referenced by the pages, data, scripts or styles.
text = ""
for f in PAGES:
    text += open(os.path.join(ROOT, f), encoding="utf-8").read()
for d in ["js", "css"]:
    for base, _, files in os.walk(os.path.join(ROOT, d)):
        for f in files:
            if f.endswith((".js", ".css")):
                text += open(os.path.join(base, f), encoding="utf-8", errors="ignore").read()
refs = set(re.findall(r"[\w./-]+\.(?:webp|png|jpe?g|svg|gif|avif)", text))
copied, missing = 0, []
for ref in sorted(refs):
    rel = ref.split("images/", 1)[1] if "images/" in ref else ref
    src = os.path.join(ROOT, "images", rel)
    if os.path.isfile(src):
        dst = os.path.join(OUT, "images", rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1
    elif not os.path.exists(os.path.join(ROOT, ref)) and not ref.startswith(("assets/", "http")):
        missing.append(ref)
print(f"_site ready: {len(PAGES)} pages, {copied} images")
if missing:
    print("Unresolved image references (check them):", *missing, sep="\n  ")
