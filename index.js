const express = require("express"),
http = require("http"),
port = 80,
app = require("express")(),
server = http.createServer(app),
bodyParser = require("body-parser"),
io = require("socket.io")(server),
liveCart;

console.log("POS App running");
console.log("Server Started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", (req, res, next) => {
    //CORS Headers
    res.header("Access-Control-Allow-Origin", "*"); //restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");

    //Set Custom Headers for CORS
    res.header (
        "Access-Control-Allow-Headers",
        "Content-type, Access, X-Access-Token, X-Key"
    );

    if (req.method === "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});

app.get("/", (req, res) => {
    res.send("POS App runnng.");
});

app.use("/api/inventory", require("./api/inventory"));
app.use("/api/transactions", require("./api/transactions"));

//Websocket logic for Live Cart
io.on("connection", (socket) => {
	socket.on("cart-transaction-complete", () => {
		socket.broadcast.emit("update-live-cart-display", {});
	});

	//on-page load, show user current cart
	socket.on("live-cart-page-loaded", () => {
		socket.emit("update-live-cart-display", liveCart);
	});

	//when client connected, make client update live cart
	socket.emit("make-live-cart-display", liveCart);

	//when the cart data is updated by the POS
	socket.on("update-live-cart", (cartData) => {
		//keep track of it
		liveCart = cartData;

		//broadcast updated live cart to all websocket clients
		socket.broadcast.emit("update-live-cart-display", liveCart);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
