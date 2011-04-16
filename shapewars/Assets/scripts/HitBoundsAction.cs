using System;
using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Level)]
	[Tooltip("Returns true if the gameObject has passed outside the level bounds")]
	public class HitBounds : FsmStateAction
	{
		[UIHint(UIHint.Variable)]
		[Tooltip("Which gameobject are we tracking?")]
		public FsmOwnerDefault gameObject;
		
		[UIHint(UIHint.Variable)]
		[Tooltip("Event to send on boundary hit")]
		public FsmEvent hitEvent;
		
		[UIHint(UIHint.Variable)]
		[Tooltip("Vector in which to store the normal of the collision")]
		public FsmVector3 collisionNormal;
		
		public override void Reset() {
			gameObject = null;
			hitEvent = null;
			collisionNormal = new FsmVector3();
		}
		
		public override void OnEnter() {
			CheckBounds();
		}
		
		public override void OnUpdate() {
			CheckBounds();
		}
		
		public void CheckBounds() {
			bool hit = false;
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			collisionNormal.Value = Vector3.zero;			
			
			LevelAttributes level = LevelAttributes.Instance;
	
			float xMax = level.transform.position.x + (level.Width / 2.0f);
			float xMin = level.transform.position.x - (level.Width / 2.0f);
			float zMax = level.transform.position.z + (level.Height / 2.0f);
			float zMin = level.transform.position.z - (level.Height / 2.0f);
		
		
			if (go.transform.position.x > xMax) {
				collisionNormal.Value += Vector3.left;
				hit = true;
			}
			if (go.transform.position.x < xMin) {
				collisionNormal.Value += Vector3.right;
				hit = true;
			}
			if (go.transform.position.z > zMax) {
				collisionNormal.Value += Vector3.back;
				hit = true;
			}
			if (go.transform.position.z < zMin) {
				collisionNormal.Value += Vector3.forward;
				hit = true;
			}
			
			if(hit) {
				Fsm.Event(hitEvent);	
			}
		}
	}
}