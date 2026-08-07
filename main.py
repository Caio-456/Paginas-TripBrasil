"""Rotas do projeto TripBrasil.

Cada rota devolve o HTML pronto com FileResponse. A conversao para
TemplateResponse/Jinja fica a cargo da equipe do projeto.
"""

from pathlib import Path
from fastapi import FastAPI
from fastapi import Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"
templates = Jinja2Templates(directory=BASE_DIR / "templates")

app = FastAPI(title="TripBrasil")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def pagina(caminho: str) -> FileResponse:
    """Devolve um arquivo de templates/ como resposta HTML."""
    return FileResponse(TEMPLATES_DIR / caminho)


# ----------------------------------------------------------------------
# publico
# ----------------------------------------------------------------------

'''
@app.get("/", response_class=HTMLResponse)
def get_index(request: Request):
    return templates.TemplateResponse(request, "publico/home.html")
'''

@app.get("/", response_class=FileResponse)
def get_index() -> FileResponse:
    return pagina("publico/home.html")


@app.get("/login", response_class=FileResponse)
def get_login() -> FileResponse:
    return pagina("publico/login.html")


@app.get("/cadastro", response_class=FileResponse)
def get_cadastro() -> FileResponse:
    return pagina("publico/cadastro.html")


@app.get("/recuperar-senha", response_class=FileResponse)
def get_recuperar_senha() -> FileResponse:
    return pagina("publico/recuperar-senha.html")


@app.get("/redefinir-senha", response_class=FileResponse)
def get_redefinir_senha() -> FileResponse:
    return pagina("publico/redefinir-senha.html")


@app.get("/buscar-explorar", response_class=FileResponse)
def get_buscar_explorar() -> FileResponse:
    return pagina("publico/buscar-explorar.html")


@app.get("/resultados-pesquisa", response_class=FileResponse)
def get_resultados_pesquisa() -> FileResponse:
    return pagina("publico/resultados-pesquisa.html")


@app.get("/estabelecimento", response_class=FileResponse)
def get_estabelecimento() -> FileResponse:
    return pagina("publico/estabelecimento.html")


@app.get("/ponto-turistico", response_class=FileResponse)
def get_ponto_turistico() -> FileResponse:
    return pagina("publico/ponto-turistico.html")


@app.get("/roteiro", response_class=FileResponse)
def get_roteiro() -> FileResponse:
    return pagina("publico/roteiro.html")


@app.get("/roteiros-predefinidos", response_class=FileResponse)
def get_roteiros_predefinidos() -> FileResponse:
    return pagina("publico/roteiros-predefinidos.html")


@app.get("/tornar-se-anunciante", response_class=FileResponse)
def get_tornar_se_anunciante() -> FileResponse:
    return pagina("publico/tornar-se-anunciante.html")

# ----------------------------------------------------------------------
# cadastrado
# ----------------------------------------------------------------------


@app.get("/conta/perfil", response_class=FileResponse)
def get_perfil() -> FileResponse:
    return pagina("cadastrado/perfil-usuario.html")


@app.get("/conta/editar-perfil", response_class=FileResponse)
def get_editar_perfil() -> FileResponse:
    return pagina("cadastrado/editar-perfil.html")


@app.get("/conta/favoritos", response_class=FileResponse)
def get_favoritos() -> FileResponse:
    return pagina("cadastrado/favoritos.html")


@app.get("/conta/minhas-avaliacoes", response_class=FileResponse)
def get_minhas_avaliacoes() -> FileResponse:
    return pagina("cadastrado/minhas-avaliacoes.html")


@app.get("/conta/avaliar-estabelecimento", response_class=FileResponse)
def get_avaliar_estabelecimento() -> FileResponse:
    return pagina("cadastrado/avaliar-estabelecimento.html")


@app.get("/conta/avaliar-ponto-turistico", response_class=FileResponse)
def get_avaliar_ponto_turistico() -> FileResponse:
    return pagina("cadastrado/avaliar-ponto-turistico.html")


@app.get("/conta/assinar-plano", response_class=FileResponse)
def get_assinar_plano() -> FileResponse:
    return pagina("cadastrado/assinar-plano.html")

# ----------------------------------------------------------------------
# assinante
# ----------------------------------------------------------------------


@app.get("/assinante/minha-assinatura", response_class=FileResponse)
def get_minha_assinatura() -> FileResponse:
    return pagina("assinante/minha-assinatura.html")


@app.get("/assinante/cancelar-assinatura", response_class=FileResponse)
def get_cancelar_assinatura() -> FileResponse:
    return pagina("assinante/cancelar-assinatura.html")


@app.get("/assinante/aumentar-catalogo", response_class=FileResponse)
def get_aumentar_catalogo() -> FileResponse:
    return pagina("assinante/aumentar-catalogo.html")


@app.get("/assinante/meus-roteiros", response_class=FileResponse)
def get_meus_roteiros() -> FileResponse:
    return pagina("assinante/meus-roteiros.html")


@app.get("/assinante/roteiros-ia", response_class=FileResponse)
def get_roteiros_ia() -> FileResponse:
    return pagina("assinante/roteiros-ia.html")


@app.get("/assinante/sugerir-estabelecimento", response_class=FileResponse)
def get_sugerir_estabelecimento() -> FileResponse:
    return pagina("assinante/sugerir-estabelecimento.html")


@app.get("/assinante/sugerir-ponto-turistico", response_class=FileResponse)
def get_sugerir_ponto_turistico() -> FileResponse:
    return pagina("assinante/sugerir-ponto-turistico.html")

# ----------------------------------------------------------------------
# anunciante
# ----------------------------------------------------------------------


@app.get("/anunciante/area", response_class=FileResponse)
def get_area() -> FileResponse:
    return pagina("anunciante/area-anunciante.html")


@app.get("/anunciante/cadastrar-estabelecimento", response_class=FileResponse)
def get_cadastrar_estabelecimento() -> FileResponse:
    return pagina("anunciante/cadastrar-estabelecimento.html")


@app.get("/anunciante/editar-estabelecimento", response_class=FileResponse)
def get_editar_estabelecimento() -> FileResponse:
    return pagina("anunciante/editar-estabelecimento.html")


@app.get("/anunciante/contratar-resultado", response_class=FileResponse)
def get_contratar_resultado() -> FileResponse:
    return pagina("anunciante/contratar-resultado.html")


@app.get("/anunciante/estatisticas-anuncios", response_class=FileResponse)
def get_estatisticas_anuncios() -> FileResponse:
    return pagina("anunciante/estatisticas-anuncios.html")

# ----------------------------------------------------------------------
# administrador
# ----------------------------------------------------------------------


@app.get("/admin/login", response_class=FileResponse)
def get_login_admin() -> FileResponse:
    return pagina("administrador/login-adm.html")


@app.get("/admin/dashboard", response_class=FileResponse)
def get_dashboard() -> FileResponse:
    return pagina("administrador/dashboard-admin.html")


@app.get("/admin/usuarios", response_class=FileResponse)
def get_usuarios() -> FileResponse:
    return pagina("administrador/usuarios.html")


@app.get("/admin/locais", response_class=FileResponse)
def get_locais() -> FileResponse:
    return pagina("administrador/admin-locais.html")


@app.get("/admin/cadastrar-local", response_class=FileResponse)
def get_cadastrar_local() -> FileResponse:
    return pagina("administrador/admin-cadastrar-local.html")


@app.get("/admin/editar-local", response_class=FileResponse)
def get_editar_local() -> FileResponse:
    return pagina("administrador/admin-editar-local.html")


@app.get("/admin/anuncios", response_class=FileResponse)
def get_anuncios() -> FileResponse:
    return pagina("administrador/admin-anuncios.html")


@app.get("/admin/editar-anuncio", response_class=FileResponse)
def get_editar_anuncio() -> FileResponse:
    return pagina("administrador/admin-editar-anuncio.html")


@app.get("/admin/avaliacoes", response_class=FileResponse)
def get_avaliacoes() -> FileResponse:
    return pagina("administrador/admin-avaliacoes.html")


@app.get("/admin/ver-sugestoes", response_class=FileResponse)
def get_ver_sugestoes() -> FileResponse:
    return pagina("administrador/admin-ver-sugestoes.html")


@app.get("/admin/sugestao", response_class=FileResponse)
def get_sugestao() -> FileResponse:
    return pagina("administrador/admin-sugestao.html")



# ----------------------------------------------------------------------
# partials
# ----------------------------------------------------------------------
# Fragmentos injetados via fetch() pelo JS. Viram {% include %} quando o
# projeto migrar para Jinja.


@app.get("/partials/header", response_class=FileResponse)
def get_partial_header() -> FileResponse:
    return pagina("publico/header.html")


@app.get("/partials/header-cadastrado", response_class=FileResponse)
def get_partial_header_cadastrado() -> FileResponse:
    return pagina("cadastrado/header-cadastrado.html")


@app.get("/partials/header-admin", response_class=FileResponse)
def get_partial_header_admin() -> FileResponse:
    return pagina("administrador/header-admin.html")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
