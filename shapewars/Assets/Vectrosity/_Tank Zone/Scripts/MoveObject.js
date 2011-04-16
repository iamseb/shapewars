static var use : MoveObject;

function Awake () {
	use = this;
}

function Rotation (thisTransform : Transform, rotateAmount : float, speed : float) {
	var start = thisTransform.rotation;
	var end = start * Quaternion.Euler(0.0, rotateAmount, 0.0);
	var rate = 1.0/Mathf.Abs(rotateAmount) * speed;
	var t = 0.0;
	while (t < 1.0) {
		t += Time.deltaTime * rate;
		if (!thisTransform) break;	// In case it was destroyed while turning
		thisTransform.rotation = Quaternion.Slerp(start, end, MathS.SmoothStep(0.0, 1.0, t));
		yield;
	}
}