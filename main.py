from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse, HTMLResponse


BASE_DIR = Path(__file__).resolve().parent
app = FastAPI()

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name = "static")

templates = Jinja2Templates(directory=BASE_DIR / "templates")

@app.get("/", response_class=HTMLResponse)
def get_index():
    return FileResponse(BASE_DIR / "templates" / "publico/home.html")