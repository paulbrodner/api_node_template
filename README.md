# about
> A simple REST api that will store data regarding deployments in SQLite DB"

# usage:
* in Docker just run:
> this will download the Docker image and run the rest app. If you want to start from scratch continue bellow
```shell script
docker run -p 9000:8000 paulbrodner/environments:latest
```

# build

*  build the Docker image and run it
```shell script
$ make build run
```

* open in browser
  * http://localhost:9000/
  * http://localhost:9000/dashboard 

# C(create)R(read)U(update)D(delete)
* create/update environment
```shell script
curl -X POST http://localhost:9000/ \
     -H "Content-Type: application/json" \
     -d '{ "name":"myjob", "author": "pbrodner", "branch": "master"}'
```
* retrieve all
```shell script
curl http://localhost:9000/
```
* retrieve all by branch
```shell script
curl http://localhost:9000?branch=master
```
* retrieve all by branch and author
```shell script
curl http://localhost:8000?branch=master&author=pbrodner
```

* delete environment
```shell script
curl -X DELETE http://localhost:9000/myjob -H "Content-Type: application/json"
```