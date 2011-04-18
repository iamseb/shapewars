using UnityEngine;
using System.Collections;
using HutongGames.PlayMaker;

public class LevelAttributes : MonoBehaviour {
	
	[SerializeField]
	private float width = 40.0f;
	
	[SerializeField]
	private float height = 20.0f;
	
	[SerializeField]
	private Transform playerType;
	
	private Transform _player;
	
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
	
	public Transform Player {
		get { return _player; }
	}	
	
	void SpawnPlayer() {
		_player = (Transform)Instantiate(playerType, Vector3.zero, Quaternion.LookRotation(Vector3.forward)) as Transform;
		
		GameObject mc = GameObject.FindGameObjectWithTag("MainCamera");
		PlayMakerFSM camFSM = (PlayMakerFSM)mc.GetComponent("PlayMakerFSM");
		camFSM.FsmVariables.GetFsmGameObject("target").Value = _player.gameObject;
	}

	// Use this for initialization
	void Start () {
		SpawnPlayer();
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnDrawGizmos() {
		Gizmos.DrawWireCube(transform.position, new Vector3(width, 20.0f, height));
	}
}
