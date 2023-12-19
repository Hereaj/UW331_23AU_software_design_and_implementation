"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var routes_1 = require("./routes");
// Configure and start the HTTP server.
var port = 8080;
var app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.json());
app.get("/chat", routes_1.chat);
// TODO(6d): add routes for /load (GET) and /save (POST)
app.get("/load", routes_1.load);
app.post("/save", routes_1.save);
app.listen(port, function () { return console.log("Server listening on ".concat(port)); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBMkM7QUFDM0MsNERBQXFDO0FBQ3JDLG1DQUE0QztBQUc1Qyx1Q0FBdUM7QUFDdkMsSUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDO0FBQzFCLElBQU0sR0FBRyxHQUFZLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNsQyxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzQixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxhQUFJLENBQUMsQ0FBQztBQUN2Qix3REFBd0Q7QUFDeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsYUFBSSxDQUFDLENBQUM7QUFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBSSxDQUFDLENBQUM7QUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQXVCLElBQUksQ0FBRSxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQyJ9