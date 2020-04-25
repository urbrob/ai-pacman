from keras.models import load_model


model = None # Model for our instance, we use it as global to do not reload it every time

def validate_data_to_predict_move(data) -> bool:
    """EDITABLE. This function task is to validate if data from request is good for prediction"""
    return True


def format_data_to_predict_move(data):
    """EDITABLE. This function task is to format data to the way how it is required for prediction."""
    return data


def format_predicted_move(prediction):
    """EDITABLE. This function task is to format output from model prediction for human-readable move output."""
    return prediction

def _predicted_move_with_ai(data):
    if model is None:
        global models
        model = load_model()
    return model.predict(data)
