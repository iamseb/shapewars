var rotateSpeed = 20.0;
var moveSpeed = 5.0;
var fireDelay = 3.0;
var shell : GameObject;
var raycastFrequency = .1;
var engineAudio : AudioSource;
var miscAudio : AudioSource;
var blockedSound : AudioClip;
var collideSound : AudioClip;

private var myTransform : Transform;
private var myRigidbody : Rigidbody;
private var canFire = true;
private var hit : RaycastHit;
private var enemyInSights = false;
private var mountainTransform : Transform;
private var originalY : float;
private var playerFieldSize : float;
private var raycastDistance = 400.0;
private var blockedAudioPlaying = false;
private var collisionCount = 0;

function Awake () {
	myTransform = transform;
	myRigidbody = rigidbody;
	name = "Player";
	Vector.SetCamera(GetComponentInChildren(Camera));
	Manager.use.ShiftVanishingPoint (GetComponentInChildren(Camera), Vector2(0.0, -0.015));
	
	originalY = myTransform.position.y;
	playerFieldSize = Manager.use.fieldSize/4;
	raycastDistance = Manager.use.playerViewDistance - 25.0;
		
	mountainTransform = Manager.mountainLine.vectorObject.transform;
	mountainTransform.position = Vector3(0.0, Screen.height * -.08, 0.0);
	Manager.use.SetVolcanoParent(GetComponentInChildren(Camera).transform);
	
	UI.use.SetReticlePositions(0.0);
	UI.targetReticleNormal.vectorObject.renderer.enabled = true;
	UI.targetReticleActive.vectorObject.renderer.enabled = false;
			
	InvokeRepeating("CheckForTarget", .1, raycastFrequency);
}

function OnCollisionEnter () {
	collisionCount++;
	ShakeViewport();
	
	blockedAudioPlaying = false;
	miscAudio.clip = collideSound;
	miscAudio.loop = false;
	miscAudio.Play();
	
	yield WaitForSeconds(.5);
	
	// Don't play blocked sound if player already exited collision
	if (collisionCount == 0) return;
	UI.use.ShowLine(1, true);
	blockedAudioPlaying = true;
	miscAudio.clip = blockedSound;
	miscAudio.loop = true;
	miscAudio.Play();
}

function ShakeViewport () {
	var t = 0.0;
	while (t < 1.0) {
		t += Time.deltaTime * 4.0;
		myTransform.position.y = originalY + Mathf.PingPong(t, .5);
		yield;
	}
	myTransform.position.y = originalY;
}

function OnCollisionExit () {
	if (--collisionCount == 0) {
		UI.use.ShowLine(1, false);
		// Don't interrupt the collide sound, only the blocked sound
		if (blockedAudioPlaying) {
			miscAudio.Stop();
		}
	}
}

function CheckForTarget () {
	if (Physics.Raycast(myTransform.position + Vector3.up*2, myTransform.forward, hit, raycastDistance) &&
			(hit.collider.gameObject.name == "Enemy" || hit.collider.gameObject.name == "SuperEnemy")) {
		if (!enemyInSights) {
			UI.targetReticleActive.vectorObject.renderer.enabled = true;
			UI.targetReticleNormal.vectorObject.renderer.enabled = false;
			enemyInSights = true;
		}
	}
	else if (enemyInSights) {
		UI.targetReticleActive.vectorObject.renderer.enabled = false;
		UI.targetReticleNormal.vectorObject.renderer.enabled = true;
		enemyInSights = false;
	}
}

private var moveAmount = 0.0;

function FixedUpdate () {
	if (Manager.playerHit) return;	// Don't allow movement after the player has been hit

	myRigidbody.velocity = Vector3.zero;
	if (moveAmount != 0.0) {
		if (collisionCount > 0) {
			moveAmount *= .05;
		}
		myRigidbody.MovePosition(myRigidbody.position + myTransform.forward * moveSpeed * Time.deltaTime * moveAmount);
		
		// Make player wrap around playing field if moving too far, and move other dynamic objects with the player so this isn't apparent
		if (myTransform.position.x > playerFieldSize) {
			myTransform.position.x -= playerFieldSize*2;
			Manager.use.MoveObjects(Vector3.right * (-playerFieldSize*2));
		}
		else if (myTransform.position.x < -playerFieldSize) {
			myTransform.position.x += playerFieldSize*2;
			Manager.use.MoveObjects(Vector3.right * (playerFieldSize*2));
		}
		if (myTransform.position.z > playerFieldSize) {
			myTransform.position.z -= playerFieldSize*2;
			Manager.use.MoveObjects(Vector3.forward * (-playerFieldSize*2));
		}
		else if (myTransform.position.z < -playerFieldSize) {
			myTransform.position.z += playerFieldSize*2;
			Manager.use.MoveObjects(Vector3.forward * (playerFieldSize*2));
		}
	}
}

function Update () {
	if (Manager.playerHit) return;

	var rotateAmount = Input.GetAxis("Horizontal");
	var thisMove = Input.GetAxis("Vertical");
	moveAmount = thisMove;
	// Restrict movement/rotation so that you can't have full amounts for both at the same time, since that's not possible with the dual stick controls
	moveAmount *= Mathf.Lerp(1.0, .5, Mathf.Abs(rotateAmount));
	rotateAmount *= Mathf.Lerp(1.0, .5, Mathf.Abs(thisMove));

	// Clamp value so you can't cheat by using keyboard + gamepad at the same time to go twice as fast
	var rightStick = Mathf.Clamp(Input.GetAxis("KeyRight") + Input.GetAxis("RightStick"), -1.0, 1.0) * .5;
	var leftStick = Mathf.Clamp(Input.GetAxis("KeyLeft") + Input.GetAxis("LeftStick"), -1.0, 1.0) * .5;
	if (rightStick != 0.0 || leftStick != 0.0) {
		rotateAmount = -rightStick + leftStick;
		moveAmount = rightStick + leftStick;
	}
	
	// Change engine pitch/volume based on movement
	var audioFactor = Mathf.Abs(rotateAmount) + Mathf.Abs(moveAmount);
	engineAudio.pitch = Mathf.Lerp(1.0, 1.35, audioFactor);
	engineAudio.volume = Mathf.Lerp(.55, .8, audioFactor);

	if (rotateAmount != 0.0) {
		myTransform.Rotate(Vector3.up * rotateSpeed * Time.deltaTime * rotateAmount);
		SetBackgroundPosition();
	}

	var joystickButtonPressed = false;
	if (Input.anyKeyDown) {
		// Go through all joystick buttons (first 10 anyway) and see if one was pressed, since we don't care which button is used for firing
		for (var i : int = KeyCode.JoystickButton0; i <= KeyCode.Joystick1Button9; i++) {
			if (Input.GetKeyDown(i)) {
				joystickButtonPressed = true;
				break;
			}
		}
	}
	if (canFire && (Input.GetButtonDown("Fire") || joystickButtonPressed) ) {
		FireShell();
	}
}

function SetBackgroundPosition () {
	// Scroll the mountains from .85 to -4.26 as the Y rotation goes from 0 to 360
	// (Offset like this so you don't see the edge; could also be fixed by moving the points in the Vector2 data over)
	mountainTransform.localPosition.x = MathS.SuperLerp(Screen.height*.85, Screen.height*-4.26, 0.0, 360.0, myTransform.eulerAngles.y);
	Manager.use.volcano.transform.localPosition.x = MathS.SuperLerp(.297, -.703, 0.0, 360.0, myTransform.eulerAngles.y);
}

function FireShell () {
	audio.Play();
	var shell = Instantiate(shell, myTransform.position + myTransform.forward*8.0 + myTransform.up, myTransform.rotation);
	Physics.IgnoreCollision(shell.collider, collider);
	shell.GetComponent(ShellControl).firedBy = "Player";
	canFire = false;
	UI.use.StartCoroutine("BlinkReticle");
	yield WaitForSeconds(fireDelay);
	canFire = true;
	UI.use.StopCoroutine("BlinkReticle");
	if (!Manager.playerHit) UI.use.SetReticlePositions (0.0);
}

function DestroySelf () {
	Destroy(gameObject);
}