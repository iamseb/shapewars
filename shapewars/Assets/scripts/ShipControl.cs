using UnityEngine;
using System.Collections;

[AddComponentMenu("ShapeWars/ShipControl")] 
public class ShipControl : MonoBehaviour {
	
	[SerializeField]
	private bool isInvulnerable = true;
	
	[SerializeField]
	private float invulnerableFadeSpeed = 1.0f;
	
	// Use this for initialization
	void Start () {
		iTween.Init(gameObject);
		StartCoroutine(MakeInvulnerable(5.0f));
	}
	
	public IEnumerator MakeInvulnerable(float forSecs){
		iTween.FadeFrom(gameObject, iTween.Hash(
		    "name", "Ship Invulnerable", "alpha", 0.3f, "time", invulnerableFadeSpeed, "loopType", "pingPong", "easeType", "easeInOutQuad"
		));
		yield return new WaitForSeconds(forSecs);
		isInvulnerable = false;
		iTween.StopByName("Ship Invulnerable");
	}
	
	
	// Update is called once per frame
	void LateUpdate () {
		LevelAttributes level = LevelAttributes.Instance;
		float xMax = level.transform.position.x + (level.Width / 2.0f);
		float xMin = level.transform.position.x - (level.Width / 2.0f);
		float zMax = level.transform.position.z + (level.Height / 2.0f);
		float zMin = level.transform.position.z - (level.Height / 2.0f);
		
		Vector3 newPos = transform.position;
		
		if (transform.position.x > xMax) {
			newPos.x = xMax;
		}
		if (transform.position.x < xMin) {
			newPos.x = xMin;
		}
		if (transform.position.z > zMax) {
			newPos.z = zMax;
		}
		if (transform.position.z < zMin) {
			newPos.z = zMin;
		}
		
		transform.position = newPos;
	}
	
	void OnCollisionEnter(Collision collision){
		if(collision.gameObject.CompareTag("baddie")){
			if(!isInvulnerable){
				KillMe(collision.gameObject);
			}
			collision.gameObject.GetComponent<Baddie>().KillMe();
		}
	}
	
	public void KillMe(GameObject killedBy){
		LevelAttributes.Instance.KillPlayer();
	}
}
