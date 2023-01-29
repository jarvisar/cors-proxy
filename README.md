# CORS Proxy

This is a simple proxy server that adds the necessary headers to allow Cross-Origin Resource Sharing (CORS) for a specified website.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You will need to have Node.js and npm installed on your machine. You can download them from the [official website](https://nodejs.org/en/) or use a package manager like [Homebrew](https://brew.sh/) (for macOS) or [Chocolatey](https://chocolatey.org/) (for Windows).

### Installation
1. Clone or download this repository.
2. Open a terminal and navigate to the root directory of the project.
3. Run ```npm install``` to install the required dependencies.

### Running the Server

Run the following command to start the proxy server:

``` node index ```

The server will listen on port 3000 by default. To use a different port, pass the port as a parameter.

For example, to run the proxy server on port 3333, run the following command:

``` node index 3333 ```

## Usage
To use the proxy, simply make a request to `localhost:<port>/proxy` with the target URL as a header named 'Target-URL'. For example, to make a GET request to https://example.com/api/users, you can use the following URL:

```http://localhost:3000/proxy/api/users ```

With the following header:

```{ 'Target-URL': 'https://example.com' } ```

If using during development, a default URL can be set to avoid having to pass the Target-URL header for every request. 

For example, to set https://example.com/ as the default URL, pass the target URL as a parameter in the terminal:

``` node index 3000 https://example.com/ ```

Note: if a Target-URL header is present in the request, it will override the default URL.

## Limitations
* The proxy only supports HTTP and HTTPS requests.
* The proxy does not support websockets.
* The proxy does not support server-side rendering of client-side applications.

## Contributing

If you find a bug or have an idea for a new feature, please open an issue or submit a pull request.
