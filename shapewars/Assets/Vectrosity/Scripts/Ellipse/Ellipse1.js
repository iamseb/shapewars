// This script draws an ellipse using a continuous line

var lineMaterial : Material;
var xRadius = 120.0;
var yRadius = 120.0;
var segments = 60;
var pointRotation = 0.0;

function Start () {
	// Make Vector2 array where the size is the number of segments plus one (since the first and last points must be the same)
	var linePoints = new Vector2[segments+1];
	
	// Make a VectorLine object using the above points and a material as defined in the inspector,
	// with a width of 3 pixels, an end cap of 0 pixels, and depth 0
	var line = new VectorLine("Line", linePoints, lineMaterial, 3.0, 0.0, 0, LineType.Continuous, Joins.Open);
	// Create an ellipse in the VectorLine object, where the origin is the center of the screen
	// If xRadius and yRadius are the same, you can use MakeCircleInLine instead, which needs just one radius value instead of two
	Vector.MakeEllipseInLine(line, Vector2(Screen.width/2, Screen.height/2), xRadius, yRadius, segments, pointRotation);
	
	// Draw the line
	Vector.DrawLine(line);
}