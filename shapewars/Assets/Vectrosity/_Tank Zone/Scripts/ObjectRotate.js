var rotateSpeed = 90.0;
private var myTransform : Transform;
@HideInInspector
var line : VectorLine;

function Startup () {
	VectorManager.ObjectSetup (gameObject, line, Visibility.Dynamic, Brightness.Fog);
	myTransform = transform;
}

function Update () {
	if (myTransform) {
		myTransform.Rotate (Vector3.up * rotateSpeed * Time.deltaTime);
	}
}