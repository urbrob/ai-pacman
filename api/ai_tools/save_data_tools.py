def validate_if_data_is_valid_to_save(data):
    """EDITABLE. This function goal is to validate data if it is correct for database save."""
    return True


def format_saving_data_to_save(data):
    """EDITABLE. This function goal is to prepare data to save it to database as you want."""
    return data["data"]


def save_data_to_database(db, data):
    for row in data:
        db.add_one({"1": row[0]})
