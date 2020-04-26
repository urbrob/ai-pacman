from flask import Flask, render_template, jsonify
from mongo import MongoHandler

from ai_tools.save_data_tools import validate_if_data_is_valid_to_save, format_saving_data_to_save, save_data_to_database
from ai_tools.predict_data_tools import validate_data_to_predict_move, format_data_to_predict_move, _predicted_move_with_ai, format_predicted_move

app = Flask(__name__, static_url_path="/static")

db = MongoHandler()

@app.route("/api/save_move", methods=["POST"])
def save_pacman_move_to_database():
    if validate_if_data_is_valid_to_save(request.json):
        formated_data = format_saving_data_to_save(request.json)

        save_data_to_database(formated_data)
        return {"status": "OK"}


@app.route("/api/predict_move")
def data():
    if validate_data_to_predict_move(request.json):
        formated_data = format_data_to_predict_move(request.json)
        predicted_move = _predicted_move_with_ai(db, formated_data)
        return format_predicted_move(predicted_move)


if __name__ == '__main__':
    app.run(debug=True)
