# Stupid Pacman AI
##### Goal of project is to create enviorment to play classic pacman game and let AI take control of it

### Github worklow
- start branch with prefix as tag, for ex. ui/ or logic/
- followup with number
- add underscore
- write parto or whole ticket name
logic/8_create_pacman_logic


### How to use
- `docker-compose build` in /ai-pacman to build
- `docker-compose up` in /ai-pacman to start app
- `docker exec -it ai-pacman_server_1 bash` in \ai-pacman to get in console

### Data feature for pacman game schema
```
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
```
