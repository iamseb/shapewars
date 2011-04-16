@HideInInspector
var shapeNumber : int;
private var line : VectorLine;

function Start () {
	name = "Obstacle";
	// Create line and adjust collider size depending on the shape number
	line = Vector.MakeLine ("Obstacle", LineData.use.shapePoints[shapeNumber]);
	VectorManager.ObjectSetup (gameObject, line, Visibility.Static, Brightness.Fog);
	collider.size.y *= LineData.use.shapeSizeY[shapeNumber];
	collider.center.y *= LineData.use.shapeSizeY[shapeNumber];	
}