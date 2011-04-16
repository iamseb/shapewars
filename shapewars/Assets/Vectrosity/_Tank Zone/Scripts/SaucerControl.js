var moveSpeed = 20.0;
private var myRigidbody : Rigidbody;
private var myTransform : Transform;
private var objectNumber : int;
private var rotateScript : ObjectRotate;
private var destroyDistance : float;
private var isDestroyed = false;
private var originalY : float;
private var avoidScript : AvoidObstacle;

function Start () {
	if (!Manager.playerTransform) {
		Destroy(gameObject);
		return;
	}
	
	name = "Saucer";
	avoidScript = GetComponent(AvoidObstacle);
	destroyDistance = Manager.use.playerViewDistance * 1.025;
	destroyDistance *= destroyDistance;	// Since it's a sqrMagnitude compare
	myTransform = transform;
	myRigidbody = rigidbody;
	originalY = myTransform.position.y;
	objectNumber = Manager.use.ArrayAdd (myTransform, Manager.use.objects);
	
	// The child draws the mesh and rotates for effect, but the parent doesn't so we can control direction properly
	rotateScript = GetComponentInChildren(ObjectRotate);
	rotateScript.line = Vector.MakeLine ("Saucer", LineData.use.saucerPoints);
	rotateScript.Startup();
	
	var timer = Time.time + Random.Range(15.0, 30.0);
	var playerCam = Manager.playerTransform.GetComponentInChildren(Camera);
	// Randomly change direction at random intervals, until too much time passes
	// (Then the saucer gets bored and leaves, as long as the player isn't looking directly at it)
	while (Time.time < timer && !isDestroyed) {
		yield WaitForSeconds(Random.Range(5.0, 10.0));
		
		if (!isDestroyed && !avoidScript.isTurning) {
			avoidScript.dontCheck = true;	// Prevent rotations from interfering with each other
			yield MoveObject.use.Rotation (myTransform, Random.Range(-179.0, 179.0), 180.0);
			avoidScript.dontCheck = false;
		}
		// If time is up, stick around if currently in view of the player
		if (playerCam) {
			var screenPoint = playerCam.WorldToScreenPoint(myTransform.position);
			if (Time.time >= timer && screenPoint.z > 0.0 && screenPoint.x >= 0 && screenPoint.x <= Screen.width) {
				timer = Time.time + 1.0;
			}
		}
	}
	if (isDestroyed) return;
	yield FadeVolume();
	DestroySelf(false);
}

function FadeVolume () {
	for (i = 1.0; i > 0.0; i -= Time.deltaTime) {
		audio.volume = i;
		yield;
	}
}

function Update () {
	if (isDestroyed || !Manager.playerTransform) return;
	
	// If out of range of the player, the saucer goes away
	if ((myTransform.position - Manager.playerTransform.position).sqrMagnitude > destroyDistance) {
		DestroySelf(false);
	}
	myTransform.position.y = originalY;	// So collisions don't potentially move it off the ground
}

function FixedUpdate () {	
	myRigidbody.velocity = Vector3.zero;
	myRigidbody.MovePosition (myRigidbody.position + myTransform.forward * moveSpeed * Time.deltaTime * avoidScript.modSpeed);	
}

function Disintegrate () {
	isDestroyed = true;
	gameObject.name = "Destroyed";	// So no more hits can register, just in case
	avoidScript.enabled = false;
	moveSpeed = 0.0;
	
	rotateScript.rotateSpeed = 0.0;
	// Make brightness control think we're invisible (if we're not anyway), since we're going to fade the color ourselves now
	GetComponentInChildren(BrightnessControl).OnBecameInvisible();
	audio.pitch = 1.8;
	InvokeRepeating("FadeOut", .01, .1);
	yield WaitForSeconds(1.0);
	FadeVolume();
}

private var timer = 0.0;
function FadeOut () {
	timer += .05;
	Vector.SetColor (rotateScript.line, MathS.ColorLerp (Manager.use.normalColor, Color.black, timer));
	if (timer > 1.0) {
		DestroySelf(false);
	}
}

function DestroySelf (immediate : boolean) {
	// See EnemyTankControl for why we're moving the saucer instead of destroying it immediately
	myTransform.Translate(Vector3.up * -999.0);
	if (!immediate) yield WaitForSeconds(.1);
	Destroy (gameObject);
	Manager.use.ArrayRemove (objectNumber, Manager.use.objects);
}