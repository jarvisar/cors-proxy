
# CORS Proxy

This is a simple proxy server that adds the necessary headers to allow Cross-Origin Resource Sharing (CORS) for a specified website.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You will need to have Node.js and npm installed on your machine. You can download them from the [https://nodejs.org/en/](official website) or use a package manager like [https://brew.sh/](Homebrew) (for macOS) or [https://chocolatey.org/](Chocolatey) (for Windows).

### Installation
1. Clone or download this repository.
2. Open a terminal and navigate to the root directory of the project.
3. Run npm install to install the required dependencies.

### Running the Server

Run the following command to start the proxy server:

``` node index ```

The server will listen on port 3000 by default. To change the port, edit line 36 in index.js.

## Usage
To use the proxy, simply make a request to the server with the target URL as a 'Target-URL' header. For example, to make a GET request to https://example.com/api/users, you can use the following URL:

```http://localhost:3000/api/users ```


```{ 'Target-URL': 'https://example.com' } ```

## Limitations
* The proxy only supports HTTP and HTTPS requests.
* The proxy does not support websockets.
* The proxy does not support server-side rendering of client-side applications.

## Contributing

If you find a bug or have an idea for a new feature, please open an issue or submit a pull request.
