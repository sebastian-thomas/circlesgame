var colors = ['#669BF2', '#EA4335', '#FBBC05', '#34A853'];
var Shape;
(function (Shape) {
    Shape[Shape["Circle"] = 0] = "Circle";
    Shape[Shape["Square"] = 1] = "Square";
})(Shape || (Shape = {}));
;
var gameSettings = {
    maxObjs: 50,
    tChange: 5,
    tColorUpdate: 200
};
