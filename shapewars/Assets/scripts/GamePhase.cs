using UnityEngine;
using System.Collections;

[AddComponentMenu("ShapeWars/GamePhase")] 
public class GamePhase : MonoBehaviour
{
	
	[SerializeField]
	private Transform[] baddies;
	
	[SerializeField]
	private float[] startDelays;
	
	// Use this for initialization
	void Start ()
	{
		Debug.Log("Entering phase: " + name);
		for(int idx=0; idx<baddies.Length; idx++){
			StartCoroutine(RunSpawner(baddies[idx].GetComponent<BaddieGroup>(), startDelays[idx]));
		}
	}
	
	public IEnumerator RunSpawner(BaddieGroup bg, float startDelay){
		yield return new WaitForSeconds(startDelay);
		GameObject.Find(bg.spawner).GetComponent<Spawner>().Run(bg);
	}
	
	void OnDestroy() {
		StopCoroutine("Spawn");
	}

}

