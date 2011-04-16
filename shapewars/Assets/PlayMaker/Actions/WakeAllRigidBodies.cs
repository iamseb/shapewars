// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Physics)]
	[Tooltip("Rigid bodies start sleeping when they come to rest. This action wakes up all rigid bodies in the scene. E.g., if you Set Gravity and want objects at rest to respond.")]
	public class WakeAllRigidBodies : FsmStateAction
	{
		public bool everyFrame;
		
		private Rigidbody[] bodies;
		
		public override void Reset()
		{
			everyFrame = false;
		}

		public override void OnEnter()
		{
			bodies = GameObject.FindObjectsOfType(typeof(Rigidbody)) as Rigidbody[];
			
			DoWakeAll();
			
			if (!everyFrame)
				Finish();		
		}
		
		public override void OnUpdate()
		{
			DoWakeAll();
		}
		
		void DoWakeAll()
		{
			bodies = GameObject.FindObjectsOfType(typeof(Rigidbody)) as Rigidbody[];
			foreach (var body in bodies)
			{
				body.WakeUp();
			}
		}
	}
}