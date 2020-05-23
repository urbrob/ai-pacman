## Build
`docker build -t front:dev .`

Make sure you are in the ai-pacman/frontend directory.

## Run
`docker run -itd -p 3000:3000 --net ai-pacman --name front front:dev`

## Check 
It may depend on yours OS:
- [localhost:3000](http://localhost:3000/) - majority of OS
- [192.168.99.100:3000](http://192.168.99.100:3000/) - Windows

## docker-compose
It will be added soon.
