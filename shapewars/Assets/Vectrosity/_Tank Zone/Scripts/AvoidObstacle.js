private var myTransform : Transform;
var raycastDistance = 30.0;
var raycastHeight = 1.0;		// This many units above transform.position.y
var turnDegrees = 10.0;			// Degrees to turn when a raycast check is true
var turnTime = .2;				// Seconds it takes to complete turnDegrees (this means turning to avoid obstacles can be faster/slower than normal)
var raycastCheckFrequency = .2;	// In seconds
var accelerationTime = 2.0;		// How fast to speed up from 0 to full speed, in seconds
var decelerationTime = 2.0;		// How fast to slow down from full speed to 0, in seconds
private var hit : RaycastHit;
private var hitDistanceRight : float;
private var turnDir : int;
private var obstacleDetected = false;
@HideInInspector
var modSpeed = 1.0;
private var boundDist : float;
private var checkPos : Vector3;
private var speedupRate : float;
private var slowdownRate : float;
@HideInInspector
var raycastDir = 1;	// 1 = forward, -1 = backward
@HideInInspector
var dontCheck = false;

function Awake () {
	boundDist = collider.bounds.extents.x;
	speedupRate = 1.0 / accelerationTime;
	slowdownRate = 1.0 / decelerationTime;

	myTransform = transform;
	InvokeRepeating("RaycastCheck", .01, raycastCheckFrequency);
}

//function Update () {
//	Debug.DrawRay(checkPos, myTransform.forward * raycastDir * raycastDistance, Color.green);
//	Debug.DrawRay(checkPos + myTransform.right*boundDist, myTransform.forward * raycastDir * raycastDistance, Color.green);
//}

function ThisRaycast () : boolean {
	if (Physics.Raycast(checkPos + myTransform.right*boundDist, myTransform.forward * raycastDir, hit, raycastDistance) ||
		Physics.Raycast(checkPos, 								myTransform.forward * raycastDir, hit, raycastDistance)) {
		return true;
	}
	else {
		return false;
	}
}

function RaycastCheck () {
	checkPos = myTransform.position + Vector3.up * raycastHeight;
	boundDist = -boundDist;	// Alternate sides for additional raycast (in order to account for width of object but still save on some raycasting)
	if (dontCheck || isTurning) return;
	
	// If there's an obstacle in the way, turn as much as allowed by turnDegrees
	if (ThisRaycast()) {
		// Choose a direction for turning if there was no hit last check (if there was, then we just keep turning in the previously chosen direction)
		if (!obstacleDetected) {
			// Lengthen distance temporarily in order to compensate for turning when facing walls straight on, since the diagonal distance is longer
			raycastDistance *= 1.414;
			turnDir = 0;
			// Turn left if there's an obstacle to the right
			if (Physics.Raycast(checkPos, myTransform.right, hit, raycastDistance)) {
				turnDir = -raycastDir;
			}
			hitDistanceRight = (hit.point - myTransform.position).sqrMagnitude;
			if (Physics.Raycast(checkPos, -myTransform.right, hit, raycastDistance)) {
				// Turn right if there wasn't any obstacle to the right
				if (turnDir == 0) {
					turnDir = raycastDir;
				}
				// If obstacles exist on both left and right, turn in direction where hit distance was longest
				else {
					if (hitDistanceRight > (hit.point - myTransform.position).sqrMagnitude) {
						turnDir = raycastDir;
					}
					else {
						turnDir = -raycastDir;
					}
				}
			}
			// Otherwise turn right or left randomly if there were no obstacles to left or right
			if (turnDir == 0) {
				turnDir = (Random.value < .5? -1 : 1);
			}
			// Slow down to stop if we're not already stopped
			if (modSpeed != 0.0) {
				StopCoroutine("ChangeSpeed");	// In case it was already running
				StartCoroutine("ChangeSpeed", -1);
			}
		}
		obstacleDetected = true;
		RotateSelf();
	}
	else {
		// Speed up if we previously detected an obstacle (and were therefore slowing down/stopped)
		if (obstacleDetected) {
			raycastDistance /= 1.414;
			// Speed up to full if we're not already at full
			if (modSpeed != 1.0) {
				StopCoroutine("ChangeSpeed");
				StartCoroutine("ChangeSpeed", 1);
			}
		}
		obstacleDetected = false;
	}
}

@HideInInspector
var isTurning = false;
function RotateSelf () {
	if (isTurning) return;
	isTurning = true;
	
	while (ThisRaycast()) {
		var start = myTransform.rotation;
		var end = myTransform.rotation * Quaternion.Euler(0.0, turnDegrees * turnDir, 0.0);
		var rate = 1.0 / turnTime;
		for (t = 0.0; t < 1.0; t += Time.deltaTime * rate) {
			myTransform.rotation = Quaternion.Slerp(start, end, t);
			yield;
		}
	}
	isTurning = false;
}

function ChangeSpeed (dir : int) {
	if (dir == -1) {
		while (modSpeed > 0.0) {
			yield;
			modSpeed -= Time.deltaTime * slowdownRate;
		}
		modSpeed = 0.0;
	}
	else {
		while (modSpeed < 1.0) {
			yield;
			modSpeed += Time.deltaTime * speedupRate;
		}
		modSpeed = 1.0;
	}
}