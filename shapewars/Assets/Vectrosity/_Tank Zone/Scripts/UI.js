var demoCam : Camera;
@HideInInspector
var score = 0;
@HideInInspector
var highscore = 0;

private var uiLine : VectorLine;
private var charLines : VectorLine[];
private var livesLine : VectorLine;
private var uiPoints : Vector2[];
private var lifePoints : Vector2[];
private var lineRenderer1 : Renderer;
private var lineRenderer2 : Renderer;
private var lineRenderer3 : Renderer;
private var myCam : Camera;
private var scoreString = "score    ";
private var scoreString2 = "high score    ";
private var currentStrings : String[];
static var targetReticleNormal : VectorLine;
static var targetReticleActive : VectorLine;

static var use : UI;

function Awake () {
	use = this;
}

function StartUp () {
	highscore = PlayerPrefs.GetInt("HighScore", 0);
	myCam = camera;

	uiPoints = new Vector2[20];
	charLines = new VectorLine[5];
	currentStrings = new String[5];
	Vector.SetLineParameters (Manager.use.uiColor, Manager.use.lineMaterial, Manager.use.lineWidth, Manager.use.capLength, Manager.use.uiDepth,
							  LineType.Discrete, Joins.Open);
	
	uiLine = Vector.MakeLine("UI", uiPoints);
	
	// Make line for "enemy in range"
	charLines[0] = Vector.MakeLine("Chars1", new Vector2[2]);
	lineRenderer1 = charLines[0].vectorObject.renderer;

	// Make line for "motion blocked by object" (or "press any key to start" when not playing)
	charLines[1] = Vector.MakeLine("Chars2", new Vector2[2]);
	lineRenderer2 = charLines[1].vectorObject.renderer;
	
	// Make line for "enemy to left" etc.
	charLines[2] = Vector.MakeLine("Chars3", new Vector2[2]);
	lineRenderer3 = charLines[2].vectorObject.renderer;
	
	// Line for extra life icons
	lifePoints = new Vector2[LineData.use.lifePoints.Length * Manager.use.extraLifeLimit];
	livesLine = Vector.MakeLine("Lives", lifePoints);
	
	// Line for score
	charLines[3] = Vector.MakeLine("Score", new Vector2[2]);
	
	// Line for high score
	charLines[4] = Vector.MakeLine("Highscore", new Vector2[2]);
	
	SetLines();
	FlashLines();
	FlashLine2();
	ShowLine (0, false);
	ShowLine (2, false);
	Vector.SetLineParameters (Manager.use.normalColor, Manager.use.lineMaterial, Manager.use.lineWidth, Manager.use.capLength, 0,
							  LineType.Discrete, Joins.Open);
							  
	// Set up target reticle lines and colors...
	// since we shifted the vanishing point down, we have to move the reticle points down too (they were set up for the middle of the screen originally)
	for (point in LineData.use.reticleNormalPoints) point.y -= 3.8;
	for (point in LineData.use.reticleActivePoints) point.y -= 3.8;
	
	var reticleActiveColors = new Color[10];
	for (color in reticleActiveColors) color = Manager.use.normalColor;
	reticleActiveColors[8] = reticleActiveColors[9] = Manager.use.normalColor*.7;

	targetReticleNormal = Vector.MakeLine("ReticleNormal", LineData.use.reticleNormalPoints, Manager.use.normalColor*.75);
	targetReticleActive = Vector.MakeLine("ReticleActive", LineData.use.reticleActivePoints, reticleActiveColors);
	SetReticleLines();
	targetReticleNormal.vectorObject.renderer.enabled = false;
	targetReticleActive.vectorObject.renderer.enabled = false;
	SetLines();
}

function SetLines () {
	var sh = Screen.height;
	var sw = Screen.width;
	var originalPos = demoCam.transform.position;
	var originalRot = demoCam.transform.rotation;
	demoCam.transform.position = Vector3.zero;	// The field of view indicator is easier to compute if the camera is here
	demoCam.transform.rotation = Quaternion.identity;	
	
	// Field of view indicator
	var radarScript : PlayerRadar = GetComponent(PlayerRadar);
	uiPoints[16] = uiPoints[18] = radarScript.radarPosition;
	// Points in player's field of view at far left and right, translated into "radarspace"
	var relativePos = demoCam.ScreenToWorldPoint(Vector3(0, sh/2, Manager.use.playerViewDistance)).normalized *
												(sh * radarScript.radarSize);
	relativePos.y = relativePos.z;
	uiPoints[17] = radarScript.radarPosition + relativePos;
	relativePos.x = -relativePos.x;
	uiPoints[19] = radarScript.radarPosition + relativePos;
	
	// Add two rectangles that the text appears in
	Vector.MakeRectInLine (uiLine, Vector2(sh*.02, sh-sh*.02), Vector2(sh*.5, sh-sh*.18), 0);
	Vector.MakeRectInLine (uiLine, Vector2(sw-sh*.02, sh-sh*.02), Vector2(sw-sh*.5, sh-sh*.18), 8);
		
	Vector.DrawLine(uiLine);
	Vector.DrawLine(charLines[0]);
	Vector.DrawLine(charLines[1]);
	Vector.DrawLine(charLines[2]);
	demoCam.transform.position = originalPos;
	demoCam.transform.rotation = originalRot;
}

function SetLives (numberOfLives : int) {
	var idx = 0;
	var screenPosition = Vector2(Screen.width-Screen.height*.485, Screen.height-Screen.height*.065);
	var scaleVector = Vector2(Screen.height*.025, Screen.height*.025);
	for (i = 0; i < numberOfLives; i++) {
		for (j = 0; j < LineData.use.lifePoints.Length; j++) {
			lifePoints[idx] = LineData.use.lifePoints[j];
			lifePoints[idx] = Vector2.Scale(lifePoints[idx], scaleVector);
			lifePoints[idx++] += Vector2(screenPosition.x + (Screen.height*.07) * i, screenPosition.y);
		}
	}
	for (i = idx; i < lifePoints.Length; i++) {
		lifePoints[i] = Vector2(0.0, 0.0);
	}
	Vector.DrawLine(livesLine);
}

function SetText (lineNumber : int, text : String) {
	currentStrings[lineNumber] = text;
	Vector.MakeTextInLine(charLines[lineNumber], text, Vector2(Screen.height*.05, Screen.height - Screen.height*(.05 + .04*lineNumber)), Screen.height*.016);
	Vector.DrawLine(charLines[lineNumber]);
}

// Used to redraw all text lines if the resolution changes
function SetAllText () {
	for (i = 0; i < 3; i++) {
		if (currentStrings[i] != null) {
			SetText(i, currentStrings[i]);
		}
	}
	Vector.MakeTextInLine(charLines[3], currentStrings[3], Vector2(Screen.width-Screen.height*.485, Screen.height - Screen.height*.08), Screen.height*.034);
	Vector.MakeTextInLine(charLines[4], currentStrings[4], Vector2(Screen.width-Screen.height*.485, Screen.height - Screen.height*.141), Screen.height*.017);
	Vector.DrawLine(charLines[3]);
	Vector.DrawLine(charLines[4]);
	SetLives (Manager.lives);
}

// Moving the line to Y position 10000.0 makes it off-screen, so it's "disabled" without interfering with the FlashLines routines, which run all the time 
function ShowLine (lineNumber : int, active : boolean) {
	charLines[lineNumber].vectorObject.transform.position.y = (active? 0.0 : 10000.0);
}

function FlashLines () {
	while (true) {
		lineRenderer1.enabled = false;
		lineRenderer3.enabled = false;
		yield WaitForSeconds(.1);
		lineRenderer1.enabled = true;
		lineRenderer3.enabled = true;
		yield WaitForSeconds(.15);
	}
}

function FlashLine2 () {
	while (true) {
		lineRenderer2.enabled = false;
		yield WaitForSeconds(.15);
		lineRenderer2.enabled = true;
		yield WaitForSeconds(.35);
	}
}

function AddToScore (points : int) {
	score += points;
	var thisScore = score.ToString("0000");	// Always use 4 digits even when score is 0
	// Format score using a substring from scoreString, depending on thisScore's length, so it's right-justified
	currentStrings[3] = scoreString.Substring(0, 13-thisScore.Length) + thisScore;
	Vector.MakeTextInLine(charLines[3], currentStrings[3], Vector2(Screen.width-Screen.height*.485, Screen.height - Screen.height*.08), Screen.height*.034);
	// Bonus life
	if (score >= Manager.bonusLifeScores[Manager.bonusCounter]) {
		if (Manager.lives < Manager.use.extraLifeLimit) {
			Manager.lives++;			
		}
		Manager.bonusCounter++;
		SetLives (Manager.lives);
	}
	// Roll score over if high enough (surely nobody would play that long?!)
	if (score > 9999999) {
		score = 0;
	}
	// High score?
	if (score > highscore) {
		highscore = score;
		PrintHighScore();	
	}
	
	Vector.DrawLine(charLines[3]);
}

function PrintHighScore () {
	var thisScore = highscore.ToString("0000");
	currentStrings[4] = scoreString2.Substring(0, 18-thisScore.Length) + thisScore;
	Vector.MakeTextInLine(charLines[4], currentStrings[4], Vector2(Screen.width-Screen.height*.485, Screen.height - Screen.height*.141), Screen.height*.017);
	Vector.DrawLine(charLines[4]);
}

function SetReticleLines () {
	Manager.use.ScalePointsToScreen (LineData.use.reticleNormalPoints);
	Manager.use.ScalePointsToScreen (LineData.use.reticleActivePoints);
	Vector.DrawLine(targetReticleNormal);
	Vector.DrawLine(targetReticleActive);
}

function BlinkReticle () {
	// Make it blink on and off by moving it up and down instead of messing with the renderers, which might interfere with CheckForTarget
	while (true) {
		SetReticlePositions (10000.0);
		yield WaitForSeconds(.15);
		if (Manager.playerHit) break;
		SetReticlePositions (0.0);
		yield WaitForSeconds(.15);
	}
}

function SetReticlePositions (pos : float) {
	targetReticleActive.vectorObject.transform.position.y = pos;
	targetReticleNormal.vectorObject.transform.position.y = pos;	
}

function OnApplicationQuit () {
	PlayerPrefs.SetInt("HighScore", highscore);
}