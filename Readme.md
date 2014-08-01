# Installation

Clone the repo, then use npm to install all the dependencies

```
npm install
```

To run in development mode:

```
node index.js
```

Open browser and go to the url

```
http://localhost:3000
```

To run in production, install nginx and mongodb. In ubuntu 

```
sudo apt-get install nginx
```

Go to the nginx web root and clone/copy the repo there

```
cd /usr/share/nginx/html
```

Now to edit nginx configuration

```
cd /etc/nginx/sites-available/
sudo nano defualt
```

Change server name to the domain you would like the api to be hosted

```
server_name api.getrti.org;
```

Replace the location directive with the following code snippet

```
location / {

                if ($request_method = 'OPTIONS') {
                        add_header 'Access-Control-Allow-Origin' '*';

                        #
                        # Om nom nom cookies
                        #

                        add_header 'Access-Control-Allow-Credentials' 'true';
                        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';

                        #
                        # Custom headers and headers various browsers *should* be OK with but aren't
                        #

                        add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Typ$

                        #
                        # Tell client that this pre-flight info is valid for 20 days
                        #

                        add_header 'Access-Control-Max-Age' 1728000;
                        add_header 'Content-Type' 'text/plain charset=UTF-8';
                        add_header 'Content-Length' 0;
            return 204;
                }

             if ($request_method = 'POST') {

                        add_header 'Access-Control-Allow-Origin' '*';
                        add_header 'Access-Control-Allow-Credentials' 'true';
                        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
                        add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Typ$

             }

             if ($request_method = 'GET') {

                        add_header 'Access-Control-Allow-Origin' '*';
                        add_header 'Access-Control-Allow-Credentials' 'true';
                        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Typ$

             }
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header HOST $http_host;
                proxy_set_header X-NginX-Proxy true;

                proxy_pass http://127.0.0.1:3000;
                proxy_redirect off;
        }
}

```

Restart the nginx server
```
sudo service nginx restart
```

Install forever using npm to keep the node process running
```
cd
sudo npm install -g forever
```

Go the site root, and run the following command to start the node
```
forever start --spinSleepTime 10000 index.js
```
Site will be available in your choosen domain


To stop the node

```
forever stop index.js
```

## Mongodb Setup

After setting up Mongodb on your system, import the collection.json file, which has the list of PIOs. Instructions to setup mongodb here- http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
Note that, this command is to be used in your system terminal. Not the mongodb terminal.
```
mongoimport --db getrti --collection pio --type json --file /usr/share/nginx/html/getrti-frontend/collection.json --jsonArray
```

Index all fields in the collection using the following command in your mongo terminal. To start a mongo terminal type 'mongod' and then 'mongo'

```
	db.pio.ensureIndex({
		"$**" : "text"
	}, {
		name : "PIO"
	})
```
Test if everything went smooth using the following query.
```
db.pio.aggregate([{
	$match : {
		$text : {
			$search : "Urban Development Chennai"
		}
	}
}, {
	$project : {
		name : 1,
		_id : 0,
		score : {
			$meta : "textScore"
		}
	}
}, {
	$match : {
		score : {
			$gt : 1.0
		}
	}
}])
```


# API Usage

Check if the server has been installed correctly

```
http://domain/hello
```

You will get a Hello, World! output.

For a single keyword search

```
http://domain/search/keyword
```

For multiple keyword search

```
http://domain/search/keyword1+keyword2
```


### getRTI UI Repositiory
https://github.com/GetRTI/getrti-ui
