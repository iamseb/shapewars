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
	
	[SerializeField]
	private Color boxColor = Color.green;
	
	[SerializeField]
	private float boxWidth = 8.0f;
	
	[SerializeField]
	private Material boxMat = null;
	
	private Transform _player;
	
	[SerializeField]
	private int playerLives = 3;
	
	[SerializeField]
	private int playerScore = 0;
	
	[SerializeField]
	private int playerScoreMult = 1;
	
	[SerializeField]
	private SpriteText scoreGui;
	[SerializeField]
	private SpriteText livesGui;
	[SerializeField]
	private SpriteText multiplierGui;
	
	
	private static LevelAttributes _instance;
	
	private VectorLine box;
	
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
	
	void Awake() {
		Physics.IgnoreLayerCollision(8, 8);
		Vector3[] points = new Vector3[8];
		float minX = -(width+1)/2;
		float maxX = +(width+1)/2;
		float minZ = -(height+1)/2;
		float maxZ = +(height+1)/2;
		
		points[0] = new Vector3(minX, 0, minZ);
		points[1] = new Vector3(maxX, 0, minZ);
		
		points[2] = new Vector3(maxX, 0, minZ);
		points[3] = new Vector3(maxX, 0, maxZ);
		
		points[4] = new Vector3(maxX, 0, maxZ);
		points[5] = new Vector3(minX, 0, maxZ);
		
		points[6] = new Vector3(minX, 0, maxZ);
		points[7] = new Vector3(minX, 0, minZ);
		
		box = new VectorLine("outline", points, boxColor, boxMat, boxWidth);
		
	}
	
	// Update is called once per frame
	void Update () {
		Vector.DrawLine3D(box, transform);
		if(scoreGui != null){
			scoreGui.Text = "Score: " + playerScore;
		}
		if(livesGui != null){
			livesGui.Text = "Lives: " + playerLives;
		}
		if(multiplierGui != null){
			multiplierGui.Text = "x" + playerScoreMult;
		}
	}
	
	void OnDrawGizmos() {
		Gizmos.DrawWireCube(transform.position, new Vector3(width, 20.0f, height));
	}
	
	public void Score(int val) {
		playerScore += (val * playerScoreMult);
	}
	
	public int ScoreMultiplier {
		get { return playerScoreMult; }
		set { playerScoreMult = value; }
	}
	
	public void MultiplyScore(int mult){
		playerScoreMult += mult;
	}
}
