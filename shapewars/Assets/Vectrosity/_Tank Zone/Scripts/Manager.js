import System.Collections.Generic;

var normalColor = Color.green;
var uiColor = Color.red;
var lineMaterial : Material;
var dotMaterial : Material;
var lineWidth = 12.0;
@HideInInspector
var capLength : float;

var playerViewDistance = 500.0;
var fieldSize = 1000;
var cellSize = 125;
var obstacle : GameObject;
var playerTank : Transform;
var enemyTank : GameObject;
var saucer : GameObject;
var explosionParticles : GameObject;
var tankPart : Transform;
var explodeForce = 45.0;
var volcanoParticles : GameObject;
var blocker : Transform;
var explosionSound : AudioClip;
var explosionSound2 : AudioClip;
var demoCam : Transform;
var mountainScale = 12.26;
var enemyLimit = 5;
var extraLifeLimit = 6;

static var mountainLine : VectorLine;
private var gameOverLine : VectorLine;
private var crackLine : VectorLine;
private var crackPoints : Vector2[];
private var gameOverPoints : Vector2[];
static var playerTransform : Transform;
private var playerCam : Camera;
static var playerCollider : Collider;
@HideInInspector
var volcano : GameObject;
@HideInInspector
var objects : List.<Transform>;
@HideInInspector
var enemies : List.<Transform>;
private var obstacles : List.<GameObject>;
static var gameRunning = false;
var playerLives = 3;
static var lives : int;
var title : TitleObject;
static var enemyCount : int;
static var currentNumberOfEnemies : int;
static var minimumEnemies : int;
static var enemySpeedMod = 0.0;
static var enemyRotationMod = 0.0;
private var myTransform : Transform;
private var lastCheck = -99;
private var locationStrings = ["enemy to left", "enemy to right", "enemy to rear"];
static var bonusLifeScores = [25000, 100000, 500000, int.MaxValue];
static var bonusCounter = 0;
static var groundCollider : Collider;
static var playerHit : boolean;
private var playerScript : PlayerMove;
private var originalWidth : int;
private var originalHeight : int;
private var shortEnemyDelay : boolean;
private var oldScreenWidth : int;
private var oldScreenHeight : int;
var uiDepth = 5;

static var use : Manager;

function Awake () {
	use = this;
	Application.targetFrameRate = 120;	// Otherwise this runs at an absurdly high framerate
	
	capLength = lineWidth*.05;
	Vector.SetLineParameters (normalColor, lineMaterial, lineWidth, capLength, 0, LineType.Discrete, Joins.Open);
	VectorManager.SetBrightnessParameters (playerViewDistance, playerViewDistance/2, 32, .2, Color.black);
	Vector.SetCamera (demoCam.camera);
	SetBlockerPosition();
	
	// Some Vector2 objects were designed originally with coordinates of this size (this is so ScalePointsToScreen can scale these objects properly)
	originalWidth = 64;
	originalHeight = 48;
	
	enemies = new List.<Transform>(enemyLimit);
	objects = new List.<Transform>(enemyLimit * 4 + 2);
	myTransform = transform;
	groundCollider = GameObject.Find("Ground").collider;
	if (Screen.fullScreen) Screen.showCursor = false;
	oldScreenWidth = Screen.width;
	oldScreenHeight = Screen.height;
}

// Sets position of plane that blocks off the top part of the screen.  It's set to depth 1, regular stuff (green) is set to depth 0,
// and UI stuff (red) is set to depth 2.  This way UI stuff is drawn on top, and the regular stuff is blocked from drawing in the UI area.
function SetBlockerPosition () {
	blocker.localScale = Vector3(Screen.width, 1.0, Screen.height*.1);
	blocker.position = Vector3(Screen.width/2, Screen.height/2 + Screen.height*.805, 0.0);
	blocker.gameObject.layer = Vector.vectorLayer;
	Vector.SetDepth (blocker, 1.0);
}

function Update () {
	if (Screen.height != oldScreenHeight) {
		ChangeRes();
	}
}

function ChangeRes () {
	originalWidth = oldScreenWidth;
	originalHeight = oldScreenHeight;

	Vector.SetCamera();
		
	FindObjectOfType(PlayerRadar).SetLine();
	UI.use.SetLines();
	UI.use.SetReticleLines();
	UI.use.SetAllText();
	if (gameRunning) {
		FindObjectOfType(PlayerMove).SetBackgroundPosition();
	}
	ScalePointsToScreen (LineData.use.mountainPoints);
	mountainLine.vectorObject.transform.position.y = Screen.height * -.08;
	Vector.DrawLine(mountainLine);
	volcano.GetComponent(ParticleRenderer).maxParticleSize = (1.0/Screen.width) * lineWidth * 2;
	ScalePointsToScreen (gameOverPoints);
	Vector.DrawLine(gameOverLine);	
	
	Camera.main.ResetProjectionMatrix();	// Since setting the camera projection matrix makes it not update anymore if screen aspect changes
	ShiftVanishingPoint (Camera.main, Vector2(0.0, -0.015));
	
	SetBlockerPosition();
	
	oldScreenWidth = Screen.width;
	oldScreenHeight = Screen.height;
	Screen.showCursor = Screen.fullScreen? false : true;
}

function Start () {
	// Position mountain points at middle of the screen, and scale them so they wrap around exactly once when rotating 360º
	// The scale is dependent on the camera's near clip plane, since vector lines are drawn just slightly past that point on the Z axis,
	// which affects how big the vectorline object actually ends up being.
	for (p in LineData.use.mountainPoints) {
		p.y += 24/mountainScale;	// 24 = midpoint, since 48 = total vertical space (originalHeight = 48)
		p *= mountainScale;
	}
	// Make most of the line segments have normalColor*.6
	var mountainColors = new Color[LineData.use.mountainPoints.Length/2];
	for (c in mountainColors) {
		c = normalColor*.6;
	}
	// But make the line segments for the lit part of the moon brighter
	for (i = 101; i < 122; i++) {
		mountainColors[i] = normalColor*.9;
	}
	ScalePointsToScreen (LineData.use.mountainPoints);
	mountainLine = Vector.MakeLine("Mountains", LineData.use.mountainPoints, mountainColors);
	Vector.DrawLine(mountainLine);
	
	volcano = Instantiate(volcanoParticles);
	volcano.GetComponent(ParticleRenderer).material.SetColor("_TintColor", normalColor * .45);
	// Make particles the same size as the vector lines
	volcano.GetComponent(ParticleRenderer).maxParticleSize = (1.0/Screen.width) * lineWidth * 2;
	
	gameOverLine = Vector.MakeLine ("GameOver", new Vector2[2]);
	Vector.MakeTextInLine (gameOverLine, "game over", Vector2(Screen.width/2 - Screen.height*.2, Screen.height/2 + Screen.height*.22), Screen.height*.05);
	gameOverPoints = gameOverLine.points2;
	Vector.DrawLine (gameOverLine);
	
	crackPoints = new Vector2[200];
	crackLine = new Vector.MakeLine ("Crack", crackPoints);
	
	UI.use.StartUp();
	UI.use.score = 0;
	UI.use.AddToScore(0);

	ShiftVanishingPoint (demoCam.camera, Vector2(0.0, -0.015));
			
	while (true) {
		demoCam.gameObject.active = true;
		Vector.SetCamera (demoCam.camera);
		mountainLine.vectorObject.transform.position = Vector3(0.0, Screen.height * -.08, 0.0);
		demoCam.position = demoCam.eulerAngles = Vector3.zero;
		demoCam.position = Vector3(-90.0, 4.0, 0.0);
		demoCam.eulerAngles.y = 0.0;
		SetVolcanoParent(demoCam);

		// Do title screen
		MakeObstacles(2);
		StartCoroutine("RotateDemoCam");
		StartCoroutine("ShowTitle");
		InvokeRepeating("BlinkGameOver", .5, .5);
		yield;	// Make sure other scripts' Start functions are done
		UI.use.SetText(1, "click mouse button to start");
		UI.use.ShowLine(1, true);
		UI.use.SetText(0, "enemy in range");
		UI.use.ShowLine(0, false);
		UI.use.ShowLine(2, false);
		UI.use.PrintHighScore();

		// Only start when clicked in the game screen (so webplayers get focus)
		var canStart = false;
		while (!canStart) {
			var mousePos = Input.mousePosition;
			if (Input.GetMouseButtonDown(0) && mousePos.x > 0 && mousePos.y > 0 && mousePos.x < Screen.width && mousePos.y < Screen.height) {
				canStart = true;
			}
			yield;
		}
		
		// Stop title screen stuff and start game
		MakeObstacles(0);
		StopCoroutine("RotateDemoCam");
		StopCoroutine("ShowTitle");
		CancelInvoke("BlinkGameOver");
		gameOverLine.vectorObject.renderer.enabled = false;
		UI.use.SetText(1, "motion blocked by object");
		UI.use.ShowLine(1, false);
		title.Activate(false);		
		mountainLine.vectorObject.transform.position = mountainLine.vectorObject.transform.eulerAngles = Vector3.zero;
		demoCam.gameObject.active = false;
		playerTransform = Instantiate(playerTank, Vector3.up*2.3, Quaternion.identity);
		playerCam = playerTransform.GetComponentInChildren(Camera);
		SetVolcanoParent(playerCam.transform);
		playerCollider = playerTransform.collider;
		playerScript = playerTransform.GetComponent(PlayerMove);
		playerCam.farClipPlane = playerViewDistance;
		PlacePlayer();
		playerHit = false;
		shortEnemyDelay = false;
		StartCoroutine("MakeSaucer");
		InvokeRepeating("CheckEnemies", .2, .2);
		
		UI.use.score = 0;
		UI.use.AddToScore(0);
		lives = playerLives;
		UI.use.SetLives(lives);
		enemyCount = 0;
		currentNumberOfEnemies = 0;
		minimumEnemies = 1;
		bonusCounter = 0;
		enemySpeedMod = 0.0;
		enemyRotationMod = 0.0;
		gameRunning = true;
		var makeEnemyTimer = 0.0;
		
		while (gameRunning) {
			if (Input.GetKeyDown(KeyCode.P)) {
				Time.timeScale = 1-Time.timeScale;
			}
			if (currentNumberOfEnemies < minimumEnemies && makeEnemyTimer == 0.0) {
				MakeEnemy();
				makeEnemyTimer = 4.0;
			}
			// Ensure that there's a delay between making enemies, so more than one won't appear simultaneously
			makeEnemyTimer = Mathf.Max(0.0, makeEnemyTimer - Time.deltaTime);
			
			yield;
		}
		
		StopCoroutine("MakeSaucer");
		CancelInvoke("CheckEnemies");
		playerScript.DestroySelf();
		for (object in objects) {
			if (object) {
				if (object.name == "Saucer" || object.name == "Enemy" || object.name == "SuperEnemy") {
					object.SendMessage("DestroySelf", true);
				}
			}
		}
	}
}

function SetVolcanoParent (thisTransform : Transform) {
	volcano.transform.parent = thisTransform;
	volcano.transform.localPosition = Vector3(0.0, .04, .21);
	volcano.transform.localEulerAngles = Vector3.zero;
}

function BlinkGameOver () {
	gameOverLine.vectorObject.renderer.enabled = !gameOverLine.vectorObject.renderer.enabled;
}

// Do "Enemy to left" etc. for whichever enemy is closest
function CheckEnemies () {
	var sqrDistance = playerViewDistance*playerViewDistance;	// Used in sqrMagnitude comparison
	var enemiesInRange = false;
	var closestDistance = sqrDistance;
	var closestEnemy = -1;
	// See which enemy is closest, if any are in range
	for (i = 0; i < enemies.Count; i++) {
		if (enemies[i] != null) {
			var thisDistance = (enemies[i].position - playerTransform.position).sqrMagnitude;
			if (thisDistance < sqrDistance) {
				enemiesInRange = true;
				if (thisDistance < closestDistance) {
					closestDistance = thisDistance;
					closestEnemy = i;
				}
			}
		}
	}
	if (enemiesInRange) {
		UI.use.ShowLine(0, true);
		var screenPoint = playerCam.WorldToScreenPoint(enemies[closestEnemy].position);
		// If not on screen, see if it's to left, right, or rear
		if (screenPoint.z < 0.0 || screenPoint.x < 0.0 || screenPoint.x > Screen.width) {
			UI.use.ShowLine(2, true);
			var relativePos = playerTransform.InverseTransformPoint(enemies[closestEnemy].position);
			if (Mathf.Abs(relativePos.x) > -relativePos.z) {
				if (relativePos.x < 0.0) {
					var thisCheck = 0;	// Enemy to left
				}
				else {
					thisCheck = 1;	// Enemy to right
				}
			}
			else {
				thisCheck = 2;	// Enemy to rear
			}
			// Only set the text if it's different from what it was set to before, so we only re-compute the text if necessary
			if (thisCheck != lastCheck) {
				lastCheck = thisCheck;
				UI.use.SetText(2, locationStrings[thisCheck]);
			}
		}
		// It is on screen, so don't show "enemy to left" etc.
		else {
			UI.use.ShowLine(2, false);
		}
	}
	// Not in range, so don't show "enemy in range" or "enemy to left" etc.
	else {
		UI.use.ShowLine(0, false);
		UI.use.ShowLine(2, false);
	}
}

function ShowTitle () {
	yield;
	while (true) {
		title.Activate(false);
		title.transform.localPosition = Vector3(-31.0, -30.0, 0.0);
		yield WaitForSeconds(4.0);
		title.Activate(true);
		yield WaitForSeconds(18.5);		
	}
}

function RotateDemoCam () {
	while (true) {
		demoCam.RotateAround(Vector3.zero, Vector3.up, Time.deltaTime * 8.0);
		mountainLine.vectorObject.transform.position.x = MathS.SuperLerp(Screen.height*.85, Screen.height*-4.26, 0.0, 360.0, demoCam.eulerAngles.y);
		volcano.transform.localPosition.x = MathS.SuperLerp(.297, -.703, 0.0, 360.0, demoCam.eulerAngles.y);
		yield;
	}
}

function MakeEnemy () {
	if (currentNumberOfEnemies == enemyLimit) return;
	
	currentNumberOfEnemies++;
	enemyCount++;
	// Make the first enemy appear almost immediately; for the rest you get a few seconds, unless you were destroyed, in which case you only get one
	if (!shortEnemyDelay) {
		yield WaitForSeconds(enemyCount == 1? .5 : 4.0);
	}
	else {
		yield WaitForSeconds(1.0);
		shortEnemyDelay = false;
	}
	if (!playerTransform) return;
	
	var placed = false;
	// Find a position for the enemy
	while (!placed) {
		// Normally enemies are rotated to any angle
		var enemyRotation = Quaternion.Euler(0.0, Random.Range(0, 360), 0.0);
		// The first couple enemies point straight left or right and appear in front of the player somewhere
		if (enemyCount < 3) {
			enemyRotation = Quaternion.Euler(0.0, playerTransform.eulerAngles.y + (Random.value < .5? 90.0 : -90.0), 0.0);
			var rotateRange = 25.0;
			var minDist = .3;
			var maxDist = .35;
		}
		// The next few just appear more or less in front of the player somewhere
		else if (enemyCount < 6) {
			rotateRange = 65.0;
			minDist = .3;
			maxDist = .45;
		}
		// The next bunch appear ±100º in front of the player
		else if (enemyCount < 15) {
			rotateRange = 100.0;
			minDist = .25;
			maxDist = .6;
		}
		// The rest appear at any point around the player
		else {
			rotateRange = 180.0;
			minDist = .2;
			maxDist = .75;
		}
		// Just use this transform because using Rotate/Translate makes the math easy
		myTransform.position = playerTransform.position;
		myTransform.eulerAngles = playerTransform.eulerAngles;
		myTransform.Rotate(Vector3.up * Random.Range(-rotateRange, rotateRange));
		myTransform.Translate(Vector3.forward * Random.Range(minDist * playerViewDistance, maxDist * playerViewDistance));
		myTransform.position.y = 2.0;
		// If there's no obstacle at the intended placement point, end the loop (only check using the default layer so we ignore the ground)
		if (!Physics.CheckSphere(myTransform.position, 3.5, 1)) {
			placed = true;
		}
	}
	Instantiate(enemyTank, myTransform.position, enemyRotation);
	// Every 10 enemies, increase the minimum by one, up to enemyLimit
	if (enemyCount % 10 == 0) {
		minimumEnemies = Mathf.Min(minimumEnemies+1, enemyLimit);
	}
}

function MakeSaucer () {
	while (true) {
		yield WaitForSeconds(15.0 + Random.Range(0.0, 15.0));
		if (!playerTransform) return;
		
		var placed = false;
		while (!placed) {
			myTransform.position = playerTransform.position;
			myTransform.eulerAngles = playerTransform.eulerAngles;
			myTransform.Rotate(Vector3.up * Random.Range(40.0, 70.0) * (Random.value < .5? -1.0 : 1.0));
			myTransform.Translate(Vector3.forward * Random.Range(.6*playerViewDistance, .95*playerViewDistance));
			myTransform.position.y = 0.0;

			if (!Physics.CheckSphere(myTransform.position, 5.5, 1)) {
				placed = true;
			}
		}
		Instantiate(saucer, myTransform.position, Quaternion.Euler(0.0, Random.Range(0, 360), 0.0));		
	}
}

function MakeObstacles (useSeed : int) {
	if (obstacles) {
		for (obstacle in obstacles) Destroy (obstacle);
	}
	obstacles = new List.<GameObject>();
	
	var realTime = System.Math.Round(Time.realtimeSinceStartup, 6);
	// This way the layout is always the same for the title screen and random otherwise
	// i.e, if useSeed is 0, then use a random seed, otherwise use the seed passed in
	// Since we're setting the random seed, we have to use something (in this case the time) to set a "random" random seed
	var thisSeed : int = (useSeed == 0? (realTime - parseInt(realTime)) * 1000000 : useSeed);
	var unitSize = (fieldSize/2) / cellSize;
	var idx = 0;
	// Distribute obstacles over a grid
	var xSeed = unitSize/2;
	for (x = -fieldSize/2; x < fieldSize/2; x += cellSize) {
		var zSeed = unitSize/2;
		for (z = -fieldSize/2; z < fieldSize/2; z += cellSize) {
			Random.seed = thisSeed + zSeed*unitSize + xSeed;
			if (Random.value > .2) {
				// Make random seed values repeat over fieldSize/2 area, so player can be teleported fieldSize units,
				// and the repeated obstacles make this visually undetectable (giving the appearance of having an infinitely-sized playing field)
				var randomCellPos = Vector3(Random.Range(3.0, cellSize-3.0) + x, 0.0, Random.Range(3.0, cellSize-3.0) + z);
				var obstacle = Instantiate(obstacle, randomCellPos, Quaternion.identity);
				obstacle.GetComponent(ObstacleControl).shapeNumber = Random.Range(0, LineData.use.shapePoints.Length);
				obstacles.Add(obstacle);
			}
			zSeed = (zSeed + 1) % unitSize;
		}
		xSeed = (xSeed + 1) % unitSize;
	}
}

function MakeTankExplosion (pos : Vector3, rot : Quaternion) {
	PlayAudioClip (explosionSound, pos);
	// Make a temporary object that the exploded tank parts will be attached to temporarily, so we can set their positions easily with localPosition
	var temp = new GameObject().transform;
	temp.position = pos;
	// Make every explosion a little different by changing the position of the explosion force
	var randomize = Vector3(Random.Range(-1.0, 1.0), Random.Range(-.5, .5), Random.Range(-1.0, 1.0));
	// Instantiate all tank parts at their corresponding locations and add explosion force to each
	for (i = 0; i < LineData.use.partLocations.Length; i++) {
		var part : Transform = Instantiate(tankPart);
		part.parent = temp;
		part.localPosition = LineData.use.partLocations[i];
		part.GetComponent(TankPart).line = Vector.MakeLine("TankPart", LineData.use.partPoints[i]);
		var modify = (i == 0)? 1.4 : 1.0;	// Make radar (which is the first part) go farther because it's supposedly lighter
		part.rigidbody.AddExplosionForce(explodeForce * modify + Random.Range(-4.0, 4.0), pos + randomize, 10.0, 5.0, ForceMode.VelocityChange);
	}
	// Rotate all parts
	temp.rotation = rot;
	temp.DetachChildren();
	Destroy(temp.gameObject);
}

function MakeParticleExplosion (thisTransform : Transform) {
	PlayAudioClip (explosionSound2, thisTransform.position);
	var particleRenderer : ParticleRenderer = Instantiate(explosionParticles, thisTransform.position + thisTransform.forward*.5, Quaternion.identity).
												GetComponent(ParticleRenderer);
	// Make particles the same size as the vector lines
	particleRenderer.maxParticleSize = (1.0/Screen.width) * lineWidth * 2;
	// The alpha blended particle shader has doubled color, so use half, and make it darker depending on the distance from the camera
	particleRenderer.material.SetColor("_TintColor", normalColor * .5 * VectorManager.GetBrightnessValue(thisTransform.position));
	// Since touching the material makes a new scene instance, get rid of it after a bit
	Destroy(particleRenderer.material, 1.1);	
}

function PlayAudioClip (clip : AudioClip, position : Vector3) {
	if (!playerTransform) return;
	
    var source = new GameObject("audio", AudioSource).audio;
    source.transform.position = position;
    source.clip = clip;
    // Sets volume directly based on distance, with 1 as max and .1 as min
    // (This could be done better now that Unity 3 has better audio control, but it's just a quick conversion from the Unity 2.6 functionality)
    source.volume = MathS.SuperLerp(1.0, .1, 0.0, playerViewDistance, Vector3.Distance(playerTransform.position, position));
    source.minDistance = 990.0;
    source.maxDistance = 1000.0;
    Destroy(source.gameObject, clip.length);
}

// Move all items in objects array by a given amount
function MoveObjects (movePosition : Vector3) {	
	for (i = 0; i < objects.Count; i++) {
		if (objects[i] == null) continue;
		objects[i].position += movePosition;
	}
}

function PlayerHit (pos : Vector3) {
	if (playerHit) return;	// In case player gets hit more than once while being blown up
	playerHit = true;
	shortEnemyDelay = true;
	playerTransform.rigidbody.isKinematic = true;

	UI.use.SetLives(--lives);
	UI.use.SetReticlePositions(10000.0);
	CrackScreen();
	AudioSource.PlayClipAtPoint(explosionSound, pos, 2.0);
	yield WaitForSeconds(.75);
	AudioSource.PlayClipAtPoint(explosionSound, pos + Vector3(Random.Range(-1.0, 1.0), 0.0, Random.Range(-1.0, 1.0)), 1.75);
	yield WaitForSeconds(3.0);
	crackLine.vectorObject.renderer.enabled = false;

	if (lives == 0) {
		gameRunning = false;
	}
	else {
		for (enemy in enemies) {
			if (enemy) enemy.GetComponent(EnemyTankControl).DestroySelf(false);
		}
		PlacePlayer();
		UI.use.SetReticlePositions(0.0);
		minimumEnemies = Mathf.Max(1, minimumEnemies-1);
	}
	
	playerHit = false;
	playerTransform.rigidbody.isKinematic = false;
}

function CrackScreen () {
	crackLine.vectorObject.renderer.enabled = true;
	Vector.ZeroPointsInLine (crackLine);
	var moveDistance = Screen.height*.12;
	var moveVariation = Screen.height*.04;
	var crackPos = new Vector3[10];
	var crackRot = new Quaternion[10];
	var crackNum = Random.Range(3, 6);
	var rotAmount = 360.0/crackNum;

	// Set up initial crack line positions
	myTransform.eulerAngles = Vector3(-90.0, 0.0, 0.0);
	myTransform.Rotate(Vector3.up * Random.Range(0.0, 360.0));	
	var offsetLimit = Screen.height*.15;
	var startPos = Vector3(Screen.width/2 + Random.Range(-offsetLimit, offsetLimit),
						   Screen.height/2-Screen.height*.1 + Random.Range(-offsetLimit, offsetLimit), 0.0);
	for (i = 0; i < crackNum; i++) {
		crackPos[i] = startPos;
		crackRot[i] = myTransform.rotation;	
		myTransform.Rotate(Vector3.up * Random.Range(rotAmount-35.0, rotAmount+35.0));
	}

	var idx = 0;
	// Make each line extend by 7 segments
	for (i = 0; i < 7; i++) {
		// Extend each crack line
		for (j = 0; j < crackNum; j++) {
			myTransform.position = crackPos[j];
			myTransform.rotation = crackRot[j];
			crackPoints[idx++] = crackPos[j];
			myTransform.Rotate(Vector3.up * Random.Range(-25.0, 25.0));
			myTransform.Translate(Vector3.forward * (moveDistance + Random.Range(-moveVariation, moveVariation)));
			crackPoints[idx++] = crackPos[j] = myTransform.position;
			crackRot[j] = myTransform.rotation;
			if (idx == crackPoints.Length) break;
			// Sometimes branch off with a new crack line
			if (Random.value < .33 && crackNum < crackPos.Length && i > 0) {
				crackPos[crackNum] = myTransform.position;
				myTransform.Rotate(Vector3.up * Random.Range(45.0, 65.0) * (Random.value < .5? -1.0 : 1.0));
				crackRot[crackNum++] = myTransform.rotation;
			}
		}
		yield DrawCrack(.1);
		if (idx == crackPoints.Length) break;
	}
	
	myTransform.eulerAngles = Vector3.zero;
}

function DrawCrack (delay : float) {
	var timer = 0.0;
	while (timer < delay) {
		Vector.DrawLine(crackLine);
		timer += Time.deltaTime;
		yield;
	}
}

function PlacePlayer () {
	var placed = false;
	while (!placed) {
		var pos = Vector3(Random.Range(-playerViewDistance*.5, playerViewDistance*.5), 2.3, Random.Range(-playerViewDistance*.5, playerViewDistance*.5));
		if (!Physics.CheckSphere(pos, 5.0, 1)) {
			placed = true;
		}
	}
	playerTransform.position = pos;
	playerTransform.eulerAngles = Vector3(0.0, Random.Range(0.0, 360.0), 0.0);
	playerScript.SetBackgroundPosition();
}

function ArrayAdd (thisTransform : Transform, list : List.<Transform>) : int {
	// If there are any unused slots in the array, use the first one found for this transform
	var i : int;
	for (i = 0; i < list.Count; i++) {
		if (list[i] == null) {
			list[i] = thisTransform;
			return i;
		}
	}
	// Otherwise, if the array is full, make it bigger
	list.Add(thisTransform);
	return i;
}

function ArrayRemove (objectNumber : int, list : List.<Transform>) {
	list[objectNumber] = null;
}

// Rescale screen points to any resolution, while keeping the original aspect intact
function ScalePointsToScreen (points : Vector2[]) {
	// (Scale) * (aspect ratio)
	var newX = ((Screen.width+0.0) / originalWidth) * ((originalWidth+0.0) / originalHeight) / ((Screen.width+0.0) / Screen.height);
	var newY = (Screen.height+0.0) / originalHeight;
	var halfOriginalWidth = originalWidth/2;
	var halfScreenWidth = Screen.width/2;
	for (i = 0; i < points.Length; i++) {
		points[i].x = (points[i].x - halfOriginalWidth) * newX + halfScreenWidth;
		points[i].y *= newY;
	}
}

function ShiftVanishingPoint (cam : Camera, perspectiveOffset : Vector2) {
	var m = cam.projectionMatrix;
	var w = 2*cam.nearClipPlane/m.m00;
	var h = 2*cam.nearClipPlane/m.m11;

	var left = -w/2 - perspectiveOffset.x;
	var right = left+w;
	var bottom = -h/2 - perspectiveOffset.y;
	var top = bottom+h;

	cam.projectionMatrix = PerspectiveOffCenter(left, right, bottom, top, cam.nearClipPlane, cam.farClipPlane);
}

static function PerspectiveOffCenter (
	left : float, right : float,
	bottom : float, top : float,
	near : float, far : float ) : Matrix4x4 {
	
	var x =  (2.0 * near)		/ (right - left);
	var y =  (2.0 * near)		/ (top - bottom);
	var a =  (right + left)		/ (right - left);
	var b =  (top + bottom)		/ (top - bottom);
	var c = -(far + near)		/ (far - near);
	var d = -(2.0 * far * near) / (far - near);
	var e = -1.0;

	var m : Matrix4x4;
	m[0,0] =   x;  m[0,1] = 0.0;  m[0,2] = a;   m[0,3] = 0.0;
	m[1,0] = 0.0;  m[1,1] =   y;  m[1,2] = b;   m[1,3] = 0.0;
	m[2,0] = 0.0;  m[2,1] = 0.0;  m[2,2] = c;   m[2,3] =   d;
	m[3,0] = 0.0;  m[3,1] = 0.0;  m[3,2] = e;   m[3,3] = 0.0;
	return m;
}