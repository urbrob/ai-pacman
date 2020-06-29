direction_map_reversed = {
    1: "w",
    0: "s",
    2: "d",
    3: "a"
}

def format_predicted_move(prediction):
    """EDITABLE. This function task is to format output from model prediction for human-readable move output."""
    prediction = list(prediction[0])
    max_guess_index = prediction.index(max(prediction))
    return direction_map_reversed[max_guess_index]


def format_data_for_ai(data):
    """EDITABLE. This function task is to prepare input data for AI model."""
    formated_data = [[
        data["pacman"]["x"],
        data["pacman"]["y"],
        data["ghost_1"]["x"],
        data["ghost_1"]["y"],
        data["ghost_2"]["x"],
        data["ghost_2"]["y"],
        data["ghost_3"]["x"],
        data["ghost_3"]["y"],
        data["ghost_4"]["x"],
        data["ghost_4"]["y"],
    ]]
    return formated_data
