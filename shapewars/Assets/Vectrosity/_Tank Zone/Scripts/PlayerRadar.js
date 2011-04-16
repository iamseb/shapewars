var radarSpeed = 225.0;	// 225 degrees/second sweep	
var radarSize = .1;	// 10% of screen height
var radarInterval = .05;	// 20 times per second
var dotFadeRate = .98;	// 98% of previous value per update
var refreshThreshold = .25;	// Radar dot must be 25% of full brightness to be refreshed

private var line : VectorLine;
private var dots : VectorPoints;
var myTransform : Transform;
private var myAudio : AudioSource;
private var myCam : Camera;

private var tank : Transform;
private var radarDotPoints : Vector2[];
private var radarDotColors : Color[];
@HideInInspector
var radarPosition : Vector2;
private var sqrViewDistance : float;
private var radarLinePoints : Vector2[];

function Awake () {
	// I ended up doing the field of view indicators in UI, which needs to know the radarPosition, so it's in Awake to make sure it's available
	radarPosition = Vector2(Screen.width/2, Screen.height - Screen.height * (radarSize + .015));
}

function Start () {
	myAudio = audio;
	myCam = camera;
	sqrViewDistance = Manager.use.playerViewDistance * Manager.use.playerViewDistance;
	
	radarLinePoints = new Vector2[2];
	SetLine();	// Used when screen changes resolution, which is why it's a separate function
	line = Vector.MakeLine("RadarLine", radarLinePoints, Manager.use.uiColor);
	Vector.SetDepth (line, Manager.use.uiDepth);
	
	radarDotPoints = new Vector2[Manager.use.enemyLimit];
	radarDotColors = new Color[Manager.use.enemyLimit];
	dots = new VectorPoints("RadarDots", radarDotPoints, radarDotColors, Manager.use.dotMaterial, Manager.use.lineWidth*2, Manager.use.uiDepth);
	
	InvokeRepeating("RadarCheck", .01, radarInterval);
}

function SetLine () {
	radarPosition = Vector2(Screen.width/2, Screen.height - Screen.height * (radarSize + .015));
	radarLinePoints[0] = Vector2.zero;
	radarLinePoints[1] = Vector2(0, Screen.height * radarSize);
	myTransform.position = radarPosition;
}

function Update () {
	myTransform.Rotate(-Vector3.forward * radarSpeed * Time.deltaTime);
}

function LateUpdate () {
	Vector.DrawLine(line, myTransform);
	Vector.DrawPoints(dots);
}

function RadarCheck () {
	// Fade radar dots
	for (i = 0; i < radarDotColors.Length; i++) {
		radarDotColors[i] *= dotFadeRate;
	}
	
	if (Manager.use.playerTransform == null) {
		Vector.SetColors(dots, radarDotColors);
		return;
	}

	for (i = 0; i < Manager.use.enemies.Count; i++) {
		if (Manager.use.enemies[i] == null) continue;
		// Check if enemy is within range of player
		if ((Manager.use.enemies[i].position - Manager.use.playerTransform.position).sqrMagnitude < sqrViewDistance) {
			// Get position of enemy tanks relative to player's forward direction
			var relativePos = Manager.use.playerTransform.InverseTransformPoint(Manager.use.enemies[i].position);
			var tankAngle = Vector3.Angle(Manager.use.enemies[i].position - Manager.use.playerTransform.position, Manager.use.playerTransform.forward);
			// Make the angle go from 0..360 (otherwise it goes 0..180..0)
			if (relativePos.x < 0.0) {
				tankAngle = 360.0 - tankAngle;
			}
			// Check to see if tank is within a 45º wedge of radar line's current rotation
			var thisAngle = 360.0 - myTransform.eulerAngles.z;	// Make radar line angle go clockwise like the tank angle
			// ...dealing with the 359 -> 0 wraparound
			if (thisAngle <= 45.0) {
				thisAngle += 360.0;
				if (tankAngle <= 45.0) {
					tankAngle += 360.0;
				}
			}
			// ... and if the dot has faded enough (prevents any more pings until the line has swept around again)
			if (tankAngle <= thisAngle && tankAngle > thisAngle-45.0 && radarDotColors[i].grayscale < refreshThreshold) {
				radarDotColors[i] = Manager.use.uiColor;
				myAudio.Play();
			}
		
			radarDotPoints[i] = Vector2((relativePos.x / Manager.use.playerViewDistance) * (Screen.height * radarSize),
										(relativePos.z / Manager.use.playerViewDistance) * (Screen.height * radarSize)) + radarPosition;
		}
	}
	Vector.SetColors(dots, radarDotColors);
}