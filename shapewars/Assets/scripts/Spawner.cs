using UnityEngine;
using System.Collections;

public class Spawner : MonoBehaviour
{
	
	[SerializeField]
	private float width = 5.0f;
	[SerializeField]
	private float height = 5.0f;
	
	
	[SerializeField]
	private Transform[] baddieTypes;
	
	[SerializeField]
	private int[] baddieRatios;
	
	[SerializeField]
	private float spawnDelay;
	
	private bool spawned = false;
	
	[SerializeField]
	private float startTime = 3.0f;
	
	[SerializeField]
	private int aliveCount = 0;
				

	// Use this for initialization
	IEnumerator Start ()
	{
		yield return new WaitForSeconds(startTime);
		StartCoroutine("Spawn");
	}

	// Update is called once per frame
	void Update ()
	{
		
	}
	
	public IEnumerator Spawn() {
		spawned = true;
		for(int idx=0; idx<baddieTypes.Length; idx++){
			int count = baddieRatios[idx];
			while(count > 0){
				Vector3 pos = new Vector3(Random.Range(-width/2, width/2), 0, Random.Range(-height/2, height/2));
				Transform spawned = (Transform)Instantiate(baddieTypes[idx], pos, transform.rotation);
				spawned.GetComponent<Baddie>().Spawner = this;
				aliveCount++;
				count --;
				yield return new WaitForSeconds(spawnDelay);
			}
		}
	}
	
	void OnDrawGizmos(){
		Gizmos.color = Color.red;
		Gizmos.DrawWireCube(transform.position, new Vector3(width, 1, height));
	}
	
	public void Decr() {
		aliveCount--;
	}
}

