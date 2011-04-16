var moveSpeed = 20.0;
var rotateSpeed = 30.0;
var accelerateSpeed = 1.0;
var fireRate = 3.0;	// Seconds between shots
var shell : Transform;
var fireSound : AudioClip;
private var currentSpeed = 0.0;
private var line : VectorLine;
private var myRigidbody : Rigidbody;
private var myTransform : Transform;
private var enemyNumber : int;
private var objectNumber : int;
private var sqrDistance : float;
private var avoidScript : AvoidObstacle;
private var rangeLimit : float;
private var hit : RaycastHit;
private var inaccuracyLimit : float;
private var stopChance : float;
private var rotateChance : float;
private var distanceTimer = 0.0;
private var breakoffTime : float;

function Start () {
	if (Manager.enemyCount < 3) {
		inaccuracyLimit = 20.0;
		stopChance = .9;
		var attackChance = 0.0;
		var attackAgainChance = 0.0;
		breakoffTime = 0.0;
		var supertankChance = 0.0;
	}
	else if (Manager.enemyCount < 6) {
		inaccuracyLimit = 12.0;
		stopChance = .7;
		attackChance = .3;
		attackAgainChance = .1;
		breakoffTime = 0.0;
		supertankChance = 0.0;
	}
	else if (Manager.enemyCount < 20) {
		inaccuracyLimit = 7.0;
		stopChance = .4;
		attackChance = .6;
		attackAgainChance = .3;
		breakoffTime = 1.0;
		supertankChance = .1;
	}
	else if (Manager.enemyCount < 40) {
		inaccuracyLimit = 4.0;
		stopChance = .2;
		attackChance = .75;
		attackAgainChance = .6;
		breakoffTime = 2.0;
		supertankChance = .15;
	}
	else {
		inaccuracyLimit = 2.0;
		stopChance = .15;
		attackChance = .9;
		attackAgainChance = .7;
		breakoffTime = 3.0;
		supertankChance = .2;
	}

	moveSpeed += Manager.enemySpeedMod;
	rotateSpeed += Manager.enemyRotationMod;
	avoidScript = GetComponent(AvoidObstacle);
	myTransform = transform;
	myRigidbody = rigidbody;
	rangeLimit = Manager.use.playerViewDistance * Manager.use.playerViewDistance;	// Since distance calcs are done with sqrMagnitude
	Physics.IgnoreCollision(collider, Manager.groundCollider);	// Otherwise the collider hits the ground when scaled up during the warp-in effect

	var rotateScript = GetComponentInChildren(ObjectRotate);
	rotateScript.line = Vector.MakeLine ("Radar", LineData.use.radarPoints);
	rotateScript.Startup();

	if (Random.value < supertankChance) {
		name = "SuperEnemy";
		line = Vector.MakeLine ("EnemyTank", LineData.use.supertankPoints);
		moveSpeed *= 1.6;
		rotateSpeed *= 1.6;
		accelerateSpeed *= .75;
		fireRate *= .65;
		rotateScript.transform.localPosition.z = -1.71;
		audio.pitch = .75;
	}
	else {
		name = "Enemy";
		line = Vector.MakeLine ("EnemyTank", LineData.use.tankPoints);
	}	
	VectorManager.ObjectSetup (gameObject, line, Visibility.Dynamic, Brightness.Normal);
	objectNumber = Manager.use.ArrayAdd (myTransform, Manager.use.objects);
	enemyNumber = Manager.use.ArrayAdd (myTransform, Manager.use.enemies);

	// Make an extra enemy if the player has been faffing about for too long (a minute to start with, then every 45 seconds)
	InvokeRepeating("ReinforcementTimer", 60.0, 45.0);
	// Check distance to player every second
	InvokeRepeating("DistanceCheck", 1.0, 1.0);
	
	// Do the "warp in" effect
	var t = 0.0;
	while (t < 1.0) {
		t += Time.deltaTime * 2.0;
		myTransform.localScale = Vector3.Lerp(Vector3(.1, 30, .1), Vector3.one, t);
		Vector.SetColor(line, Color.Lerp(Color.black, Manager.use.normalColor, t));
		yield;
	}
	// We add brightness control now that the color lerping is done
	var bc : BrightnessControl = gameObject.AddComponent(BrightnessControl);
	bc.Setup(line);
	
	yield WaitForSeconds(Random.Range(0.5, 1.2));
	rotateChance = .4;

	// Repeat Attack/Rotate/Move sequence (the chances of each depending on how many enemies have been made so far; see above)
	while (true) {
		var attacked = false;
		if (Random.value < attackChance) {
			yield AttackPlayer();
			attacked = true;
		}
		// Sometimes skip this stuff and do AttackPlayer routine again immediately, but only if we did attack
		if (Random.value > attackAgainChance || attacked == false) {
			// Sometimes rotate first and then move, otherwise move first
			if (Random.value < rotateChance) {
				yield RotateSelf();
			}
			yield MoveSelf();
			rotateChance = 1.0;
			attackChance += .1;
		}
	}
}

function RotateSelf () {
	if (avoidScript.isTurning) return;	// Don't bother with this routine if the obstacle avoidance script is already turning us
	
	var rotateAmount = Random.Range(45.0, 179.0) * (Random.value < .5? 1.0 : -1.0);
	avoidScript.dontCheck = true;	// Turn off raycasting temporarily; otherwise there's a chance of two rotation routines interfering with each other
	yield MoveObject.use.Rotation (myTransform, rotateAmount, rotateSpeed);
	avoidScript.dontCheck = false;
}

function MoveSelf () {
	while (avoidScript.isTurning) yield;

	// Change speed (sometimes backing up), cruise for a bit, then stop again (sometimes, depending on stopChance)
	var dir = (Random.value < .15? -1.0 : 1.0);
	avoidScript.raycastDir = dir;
	yield ChangeSpeed (currentSpeed, moveSpeed * Random.Range(.75, 1.0) * dir);
	yield WaitForSeconds(Random.Range(3.0, 6.0) * (dir == -1? .3 : 1.0));	// When backing up, only do this for about 1/3 the normal time
	if (Random.value < stopChance || dir == -1) {	// Always stop if we just backed up
		yield ChangeSpeed (currentSpeed, 0.0);
	}
	avoidScript.raycastDir = 1;	
}

function ChangeSpeed (start : float, end : float) {
	var t = 0.0;
	while (t < 1.0) {
		t += Time.deltaTime * accelerateSpeed;
		currentSpeed = Mathf.Lerp(start, end, t);
		yield;
	}
}

function AttackPlayer () {
	var angleModify = 1.0;
	var attackTimer = 0.0;
	var timerEnd = Random.Range(12.0, 18.0) - breakoffTime;	// As defined in Start...tanks become a little less persistent when there are more of them 
	// Take a few seconds to start moving, depending on stopChance
	var moveTime = (Random.value < stopChance? Random.Range(2.0, 4.0) : 0.0);
	var isFiring = false;
	var isMoving = false;
	// Keep attacking for a while, then break off attack when the time's up
	while (attackTimer < timerEnd) {	
		var angle = Vector3.Angle(Manager.playerTransform.position - myTransform.position, myTransform.forward);
		// Rotate to face player if not aimed well enough, as long as the AvoidObstacle script isn't currently avoiding stuff
		if (angle > inaccuracyLimit * angleModify && !avoidScript.isTurning) {
			myTransform.Rotate(Vector3.up * Time.deltaTime * rotateSpeed *	// Rotate right or left depending on relative position of player
							   Mathf.Sign(myTransform.InverseTransformPoint(Manager.playerTransform.position).x));
		}
		// Start firing if aimed toward player enough
		if (angle <= inaccuracyLimit && !isFiring) {
			InvokeRepeating("Fire", .01, fireRate);
			isFiring = true;
		}
		// Increase accuracy over several seconds, so inaccuracyLimit becomes 10% of what it was to start with
		angleModify = Mathf.Max(0.1, angleModify - Time.deltaTime*.15);
		
		// Start moving at a certain time, or if AvoidObstacle is trying to avoid things
		attackTimer += Time.deltaTime;
		if (!isMoving && (attackTimer >= moveTime || avoidScript.isTurning)) {
			ChangeSpeed (currentSpeed, moveSpeed * Random.Range(.75, 1.0));
			isMoving = true;
		}
		// Break off attack if we're not facing the player enough (after 6 seconds, so we have a chance to face the player first)
		if (angle > 45.0 && attackTimer > 6.0) break;
		
		yield;
	}

	CancelInvoke("Fire");
	if (attackTimer >= timerEnd) {	// If we broke off attack because of the time limit, always swerve off by doing the RotateSelf routine while moving
		rotateChance = 1.0;
	}
	else {
		// If we broke off because the angle was too great, sometimes stop and sometimes just slow down
		if (Random.value < stopChance) {	
			yield ChangeSpeed (currentSpeed, 0.0);
		}
		else {
			yield ChangeSpeed (currentSpeed, currentSpeed * .5);
		}
	}
	if (avoidScript.isTurning) {	// If already turning because of AvoidObstacle, always use the MoveSelf routine and not RotateSelf
		rotateChance = 0.0;
	}
}

function Fire () {
	if (Manager.playerHit) return;
	
	audio.clip = fireSound;
	audio.Play();
	var shell = Instantiate(shell, myTransform.position + myTransform.forward*2.0 + myTransform.up*1.9, myTransform.rotation);
	Physics.IgnoreCollision(shell.collider, collider);
	shell.GetComponent(ShellControl).firedBy = "Enemy";
}

function ReinforcementTimer () {
	Manager.use.MakeEnemy();
}

function DistanceCheck () {
	if (!Manager.playerTransform) return;
	
	// If player tries running away, make an extra enemy if possible and increase enemy speed a little every 10 seconds, until the running away stops
	if ((myTransform.position - Manager.playerTransform.position).sqrMagnitude > rangeLimit*1.2) {
		distanceTimer += 1.0;
		if (distanceTimer >= 10.0) {
			distanceTimer = 0.0;
			Manager.use.MakeEnemy();
			Manager.enemySpeedMod += 1.0;
			Manager.enemyRotationMod += 2.0;
		}
	}
	else {
		distanceTimer = 0.0;
	}
}

function FixedUpdate () {
	myRigidbody.velocity = Vector3.zero;
	myRigidbody.MovePosition (myRigidbody.position + myTransform.forward * currentSpeed * Time.deltaTime * avoidScript.modSpeed);
}

function DestroySelf (immediate : boolean) {
	// Instead of destroying self immediately, move down and wait a bit so that OnCollisionExit can fire
	// Otherwise, OnCollisionExit would never fire if the rigidbody is simply destroyed, which can mess up PlayerMove,
	// if the player happens to be collided with a tank when it's destroyed
	// (Although we override this when the game ends since we want the enemies gone immediately)
	myTransform.Translate (Vector3.up * -999.0);
	if (!immediate) yield WaitForSeconds(.1);
	Destroy (gameObject);
	Manager.use.ArrayRemove (objectNumber, Manager.use.objects);
	Manager.use.ArrayRemove (enemyNumber, Manager.use.enemies);
	Manager.use.currentNumberOfEnemies--;
}