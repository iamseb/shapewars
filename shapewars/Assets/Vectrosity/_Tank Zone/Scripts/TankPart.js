private var line : VectorLine;
private var timer = 0.0;
private var initialColor : Color;
private var objectNumber : int;
private var collided = false;

function Start () {
	// Set the initial brightness based on distance from player...we're not using fog since that interferes with the fading we do in FadeOut
	initialColor = Manager.use.normalColor * VectorManager.GetBrightnessValue(transform.position);
	Vector.SetColor (line, initialColor);
	VectorManager.ObjectSetup (gameObject, line, Visibility.Dynamic, Brightness.Normal);
	objectNumber = Manager.use.ArrayAdd (transform, Manager.use.objects);
	Physics.IgnoreCollision(collider, Manager.playerCollider);
	InvokeRepeating("FadeOut", .2, .2);
}

function OnCollisionEnter (collisionInfo : Collision) {
	if (!collided && collisionInfo.collider.gameObject.name == "Ground" || collisionInfo.collider.gameObject.name == "Obstacle") {
		collided = true;
		DestroySelf();
	}
}

function DestroySelf () {
	Destroy (gameObject);
	Manager.use.ArrayRemove (objectNumber, Manager.use.objects);
}

function FadeOut () {
	timer += .05;
	Vector.SetColor (line, MathS.ColorLerp (initialColor, Color.black, timer));
	if (timer > 1.0) {
		DestroySelf();
	}
}