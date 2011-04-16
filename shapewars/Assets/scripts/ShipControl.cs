using UnityEngine;
using System.Collections;

public class ShipControl : MonoBehaviour {
	
	private float xMax;
	private float xMin;
	private float yMax;
	private float yMin;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		LevelAttributes level = LevelAttributes.Instance;
		xMax = level.transform.position.x + (level.Width / 2.0f);
		xMin = level.transform.position.x + (level.Width / 2.0f);
		yMax = level.transform.position.y + (level.Height / 2.0f);
		yMin = level.transform.position.y + (level.Height / 2.0f);
		
		if (transform.position.x > xMax) {
			transform.position.x = xMax;
		}
		if (transform.position.x < xMin) {
			transform.position.x = xMin;
		}
		if (transform.position.y > yMax) {
			transform.position.y = yMax;
		}
		if (transform.position.y < yMin) {
			transform.position.y = yMin;
		}
	}
}
