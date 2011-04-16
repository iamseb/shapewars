var speed = 10.0;
private var line : VectorLine;
private var timer = 0.0;

function Start () {
	line = Vector.MakeLine ("Title", LineData.use.titlePoints);
}

function Update () {
	transform.Translate(Vector3.forward * Time.deltaTime * -speed);	
}

function LateUpdate () {
	Vector.DrawLine(line, transform);
}

function Activate (isActive : boolean) {
	enabled = isActive;
	line.vectorObject.renderer.enabled = isActive;
	if (isActive) {
		timer = 0.0;
		Vector.SetColor (line, Manager.use.normalColor);
		InvokeRepeating("FadeOut", 6.0, .2);
	}
	else {
		CancelInvoke("FadeOut");
	}
}

function FadeOut () {
	timer += .015;
	Vector.SetColor (line, MathS.ColorLerp (Manager.use.normalColor, Color.black, timer));
}