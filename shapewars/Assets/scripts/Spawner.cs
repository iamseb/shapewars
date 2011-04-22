using UnityEngine;
using System.Collections;

public class Spawner : MonoBehaviour
{
	
	[SerializeField]
	private float width = 5.0f;
	[SerializeField]
	private float height = 5.0f;
		
	[SerializeField]
	private int aliveCount = 0;
	
	[SerializeField]
	private bool preventOverlap = false;
				

	public void Run(BaddieGroup bg){
		StartCoroutine(Spawn(bg));
	}
	

	public IEnumerator Spawn(BaddieGroup bg) {
		for(int idx=0; idx<bg.amount; idx++){
			bool overlapping = true;
			Vector3 pos = new Vector3(Random.Range(-width/2, width/2), 0, Random.Range(-height/2, height/2));
			pos += transform.position;
			while(preventOverlap && overlapping){
				pos = new Vector3(Random.Range(-width/2, width/2), 0, Random.Range(-height/2, height/2));
				pos += transform.position;
				if(!Physics.CheckSphere(pos, 1.0f)){
					overlapping = false;
				}
			}
			Transform spawned = (Transform)Instantiate(bg.baddieType, pos, transform.rotation);
			spawned.GetComponent<Baddie>().Spawner = this;
			aliveCount++;
			yield return new WaitForSeconds(bg.spawnDelay);
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

