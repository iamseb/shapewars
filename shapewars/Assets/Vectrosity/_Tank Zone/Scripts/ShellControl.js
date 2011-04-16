var shellForce = 120.0;
var lifeTime = 5.0;
@HideInInspector
var firedBy : String;
private var line : VectorLine;
private var objectNumber : int;
private var collided = false;

function Start () {
	line = Vector.MakeLine ("Shell", LineData.use.shellPoints);
	VectorManager.ObjectSetup (gameObject, line, Visibility.Dynamic, Brightness.Fog);
	objectNumber = Manager.use.ArrayAdd (transform, Manager.use.objects);
	
	rigidbody.AddRelativeForce (Vector3.forward * shellForce, ForceMode.VelocityChange);
	Invoke("TimeUp", lifeTime);
}

function OnCollisionEnter (collisionInfo : Collision) {
	// Make 100% sure that only one collision registers
	if (collided) return;
	collided = true;
	
	Manager.use.MakeParticleExplosion(transform);
	
	var collisionName = collisionInfo.gameObject.name;
	if (collisionName == "Enemy" || collisionName == "SuperEnemy") {
		var colliderTransform = collisionInfo.gameObject.transform;
		Manager.use.MakeTankExplosion (colliderTransform.position, colliderTransform.rotation);
		collisionInfo.gameObject.GetComponent(EnemyTankControl).DestroySelf(false);
		// Only add to score if the player was the one to make the kill
		if (firedBy == "Player") {
			UI.use.AddToScore( (collisionName == "Enemy"? 1000 : 2000) * Manager.currentNumberOfEnemies);
		}
		DestroySelf(false);
	}
	else if (collisionName == "Saucer") {
		collisionInfo.collider.GetComponent(SaucerControl).Disintegrate();
		if (firedBy == "Player") {
			UI.use.AddToScore(5000);
		}
		DestroySelf(false);
	}
	else if (collisionName == "Player") {
		Manager.use.PlayerHit(collisionInfo.contacts[0].point);
		DestroySelf(true);
	}
	else {
		DestroySelf(false);
	}
}

function OnTriggerEnter () {
	audio.Play();
}

function TimeUp () {
	DestroySelf(false);	// We can't Invoke DestroySelf since it's a coroutine (although Unity doesn't generate any errors, which is unfortunate)
}

function DestroySelf (wait : boolean) {
	if (wait) {
		rigidbody.AddForce(Vector3.up*100000);	// Make sure OnCollisionExit on player script fires
		yield WaitForSeconds(.1);
	}
	Destroy (gameObject);
	Manager.use.ArrayRemove (objectNumber, Manager.use.objects);
}