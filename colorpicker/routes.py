from pathlib import Path

from flask import current_app, render_template, request

from colorpicker.models import Theme


@current_app.route("/")
def index():
    return render_template(
        "index.html", debug=current_app.config.get("ENV") == "development"
    )


@current_app.post("/about")
def about():
    success = True
    msg = ""
    readme_ = ""

    try:
        readme_ = open(Path(__file__).parent.parent / "README.md").read()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "readme": readme_,
    }


@current_app.post("/add_theme")
def add_theme():
    success = True
    msg = ""

    try:
        theme_ = Theme(
            name=request.json.get("name"),
            hex=request.json.get("hex"),
            text_color=request.json.get("textColor"),
        )
        theme_.add()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/get_themes")
def get_themes():
    success = True
    msg = ""
    themes = []

    try:
        themes = [i.to_dict() for i in Theme.all()]
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
        "themes": themes,
    }


@current_app.post("/delete_theme")
def delete_theme():
    success = True
    msg = ""

    try:
        theme_ = Theme.get(int(request.json.get("id")))
        theme_.delete()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }


@current_app.post("/delete_all_themes")
def delete_all_themes():
    success = True
    msg = ""

    try:
        Theme.delete_all()
    except Exception as e:
        success = False
        msg = str(e)

    return {
        "success": success,
        "msg": msg,
    }
