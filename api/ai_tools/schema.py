position_schema = {
    "type": "object",
    "properties": {
        "x": {"type": "number"},
        "y": {"type": "number"}
    },
    "required": ["x", "y"]
}

data_schema = {
  "type": "object",
  "properties": {
    "pacman": position_schema,
    "ghost_1": position_schema,
    "ghost_2": position_schema,
    "ghost_3": position_schema,
    "ghost_4": position_schema,
    "direction": {"type": "string", "pattern": "[wsda]"}
  },
  "required": ["pacman", "ghost_1", "ghost_2", "ghost_3", "ghost_4", "ghost_5"]
}
