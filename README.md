# About the program

This program is developed for a technical interview. It's a RESTFul application that provides three routes.

1.  `POST /login` expects a username and a password, and returns a `JWT` token for future requests.
2.  `POST /thumbnails` protected route that expects a json payload `{"url":"http://link"}`, and return the relative path to the resized image. Example of a response

```json
{
  "path": "/images/ff61ab0b-74c7-4144-a173-22935256d6d7"
}
```

3. `POST /jsonpatch` protected route that expects a json payload containing a document and a patch, and returns the result of applying the patch on the document. An example of request

```json
{
  "doc": {
    "baz": "qux",
    "foo": "bar"
  },
  "patch": [{ "op": "replace", "path": "/baz", "value": "boo" }]
}
```

the answer will be

```json
{
  "baz": "boo",
  "foo": "bar"
}
```

# Installation

To install the application, you'll need to have node.js in your computer.

```bash
$ git clone git@github.com:abdellani/interview-backend-task.git
$ npm install
```

The application is also available in docker

```
docker pull abdellani/interview-backend-task
```

# Configuration

You'll need to adapt the configurations file in `config/`

- `developement.js`

```json
{
  "PORT": "3000",
  "JWT_LIFE_TIME": "JWT Life time",
  "JWT_SECRET": "SUPER SUCRET KEY",
  "IMAGE_DIR": "ABSOLUTE PATH TO THE RESIZE IMAGES "
}
```

After an image is resized, it'll be store in "IMAGE_DIR".

- `test.js`

```json
{
  "PORT": "3001",
  "JWT_LIFE_TIME": "JWT Life time",
  "JWT_SECRET": "SUPER SUCRET KEY",
  "IMAGE_DIR": "should be different from the value in developement.json ",
  "IMAGE_SERVER_PORT": "8080",
  "HASH_RESIZE_IMAGE":"7a700bc715eda72d192b1c934547424e8ab69815026f24ead81a27122cf042f511df22b840c0e5438db0cb60d03e35d14d9289cd822ce0646068574438ec5fe0"
}
```
* `IMAGE_SERVER_PORT` is the port number for the server used in the integration tests. That server will send a valid images to the application.
* `HASH_RESIZE_IMAGE` after an image is resized, its hash will be compared to this value.

# Run the code
```bash
npm start
```
# Run in development mode
```
npm run dev
```
# Run tests
```bash
npm run test:unit # will run  unit tests
npm run test:integration # will run  integration tests
npm run test # will run both unit and integration tests
```
# Run linter
```bash
npm run linter
```
# Author

Mohamed ABDELLANI
