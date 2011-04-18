using UnityEngine;
using System.Collections;

public class Baddie : MonoBehaviour {
	
	[SerializeField]
	private float speed = 1.0f;
	
	[SerializeField]
	private float health = 1.0f;
	
	[SerializeField]
	private Color baddieColor = Color.grey;
	
	[SerializeField]
	private bool bouncesOffWalls = true;
	
	[SerializeField]
	private Vector3 initialDir = Vector3.forward;
	
	[SerializeField]
	private float turnSpeed = 5.0f;
	
	[SerializeField]
	private bool followsTarget;
	
	public Vector3 InitialDir {
		get {
			return initialDir;
		}
		set {
			initialDir = value;
		}
	}

	// Use this for initialization
	void Start () {
		transform.LookAt(transform.position + initialDir);
		foreach(Transform t in transform){
			t.renderer.materials[0].color = baddieColor;
		}
		
	}
	
	// Update is called once per frame
	void Update () {
		
		transform.Translate(Vector3.forward * Time.deltaTime * speed);
		
		Vector3 bounceDir = Vector3.zero;
		
		if (followsTarget && LevelAttributes.Instance.Player){
			Transform target = LevelAttributes.Instance.Player;
			Debug.Log("Following " + target.GetInstanceID());
			transform.rotation = Quaternion.RotateTowards(
				transform.rotation, 
			    Quaternion.LookRotation(target.position - transform.position, transform.up), 
			    turnSpeed
            );
		}
			
	
		LevelAttributes level = LevelAttributes.Instance;
		float xMax = level.transform.position.x + (level.Width / 2.0f);
		float xMin = level.transform.position.x - (level.Width / 2.0f);
		float zMax = level.transform.position.z + (level.Height / 2.0f);
		float zMin = level.transform.position.z - (level.Height / 2.0f);
		
		Vector3 newPos = transform.position;
		
		if (transform.position.x > xMax) {
			newPos.x = xMax;
			bounceDir += Vector3.left;
		}
		if (transform.position.x < xMin) {
			newPos.x = xMin;
			bounceDir += Vector3.right;
		}
		if (transform.position.z > zMax) {
			newPos.z = zMax;
			bounceDir += Vector3.back;
		}
		if (transform.position.z < zMin) {
			newPos.z = zMin;
			bounceDir += Vector3.forward;
		}
		
		transform.position = newPos;
		
		if(bouncesOffWalls && bounceDir != Vector3.zero){
			Debug.Log("Bouncing off wall in direction " + bounceDir);
			BounceOffWalls(bounceDir);
		}
		
		Debug.DrawRay(transform.position, transform.forward);
	}
	
	
	public void BounceOffWalls(Vector3 bounceDir) {
		Vector3 reflection = transform.forward - ((2*bounceDir) * Vector3.Dot(transform.forward, bounceDir));
		transform.LookAt(transform.position + reflection);
		Debug.Log("Reflection vector is " + reflection);
		// Debug.DrawRay(transform.position, reflection);
	}
	
	
	void OnCollisionEnter(Collision collision){
		if(collision.gameObject.CompareTag("bullet")){
			Destroy(collision.gameObject);
			Destroy(gameObject);
		}
	}
	
}
