#from keras.models import load_model
from jsonschema import exceptions, validate
from ai_tools.schema import data_schema
model = None # Model for our instance, we use it as global to do not reload it every time


def validate_if_entry_data_is_valid(data):
    if data:
        try:
            validate(
                instance=data, schema=data_schema
            )
        except exceptions.ValidationError as err:
            return err
    else:
        return "Request need payload."

def save_data_to_database(db, data):
    db.add_one(data)


def predicted_move_from_ai(data):
    if model is None:
        global models
        #model = load_model() # Uncomment when beta version is ready. Right now it takes to long to build requirements
    return model.predict(data)
