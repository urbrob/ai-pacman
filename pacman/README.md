## Build
`docker build -t pacman:dev .`

Make sure you are in the ai-pacman/pacman directory.

## Run
`docker run -itd -p 5678:5678 --name pacman pacman:dev`

## Check 
It may depend on yours OS:
- [localhost:3000](http://localhost:5678/) - majority of OS
- [192.168.99.100:3000](http://192.168.99.100:5678/) - Windows

## docker-compose
It will be added soon.
