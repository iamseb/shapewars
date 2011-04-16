using UnityEngine;
using System.Collections;

public class LevelAttributes : MonoBehaviour {
	
	[SerializeField]
	private float width = 40.0f;
	
	[SerializeField]
	private float height = 20.0f;
	
	private static LevelAttributes _instance;
	
	public static LevelAttributes Instance {
		get {
			if (!_instance) {
				_instance = (LevelAttributes)GameObject.FindObjectOfType(typeof(LevelAttributes));
				if (!_instance) {
					GameObject container = new GameObject();
					container.name = "LevelAttributes";
					_instance = container.AddComponent(typeof(LevelAttributes)) as LevelAttributes;
				}
			}
			return _instance;
		}		
	}
	
	public float Width {
		get { return width; }
	}

	public float Height {
		get { return height; }
	}

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnDrawGizmos() {
		Gizmos.DrawWireCube(transform.position, new Vector3(width, 20.0f, height));
	}
}
