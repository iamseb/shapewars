using UnityEngine;
using System.Collections;

public class ShipControl : MonoBehaviour {
	
	// Use this for initialization
	void Start () {
	
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
}
