import json
from flask import Flask, render_template, jsonify, request
from mongo import MongoHandler
from ai_tools import tools, utils
from werkzeug.exceptions import BadRequest
from flask_caching import Cache

def create_app(testing=False):
    app = Flask(__name__)

    db = MongoHandler(app, testing)
    cache = Cache(app, config={'CACHE_TYPE': 'simple'})

    @app.route("/api/save_move", methods=["POST"])
    def save_pacman_move_to_database():
        try:
            request_json = request.get_json(force=True)
        except BadRequest:
            return {"status": "Missing request body"}, 400
        erorrs = utils.validate_if_entry_data_is_valid(request_json)
        if erorrs:
            return {"status": erorrs.message}, 400
        else:
            formated_data = tools.format_data_for_ai(request.get_json())
            if formated_data:
                utils.save_data_to_database(db, formated_data)
                return {"status": "OK"}
            return {"status": "Not saved because data doesn't fit requirements"}, 400


    @app.route("/api/predict_move")
    def predict_move_from_ai():
        erorrs = utils.validate_if_entry_data_is_valid(request.get_json())
        if errors:
            return {"status": erorrs.message}, 400
        else:
            formated_data = tools.format_data_for_ai(request.get_json())
            predicted_move = utils.predicted_move_from_ai(db, formated_data)
            return tools.format_predicted_move(predicted_move)


    @app.route("/")
    def debug():
        ret_str = ""
        for row in db.get_all():
            ret_str += str(row) + "\n"
        return ret_str

    return app, db


if __name__ == '__main__':
    app, db = create_app()
    app.run(host='0.0.0.0')
