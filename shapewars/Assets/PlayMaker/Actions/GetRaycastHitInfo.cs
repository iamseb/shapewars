// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Physics)]
	[Tooltip("Gets info on the last Raycast and store in variables.")]
	public class GetRaycastHitInfo : FsmStateAction
	{
		[UIHint(UIHint.Variable)]
		public FsmGameObject gameObjectHit;
		[UIHint(UIHint.Variable)]
		public FsmVector3 point;
		[UIHint(UIHint.Variable)]
		public FsmVector3 normal;
		[UIHint(UIHint.Variable)]
		public FsmFloat distance;

		public override void Reset()
		{
			gameObjectHit = null;
			point = null;
			normal = null;
			distance = null;
		}

		void StoreRaycastInfo()
		{
			gameObjectHit.Value = Fsm.RaycastHitInfo.collider.gameObject;
			point.Value = Fsm.RaycastHitInfo.point;
			normal.Value = Fsm.RaycastHitInfo.normal;
			distance.Value = Fsm.RaycastHitInfo.distance;
		}

		public override void OnEnter()
		{
			StoreRaycastInfo();
			
			Finish();
		}
	}
}