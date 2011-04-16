// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Debug)]
	[Tooltip("Draws a line from a Start point in a direction. Specify the start point as Game Objects or Vector3 world positions. If both are specified, position is used as a local offset from the Object's position.")]
	public class DrawDebugRay : FsmStateAction
	{
		public FsmGameObject fromObject;
		public FsmVector3 fromPosition;
		public FsmVector3 direction;
		public FsmColor color;

		public override void Reset()
		{
			fromObject = new FsmGameObject { UseVariable = true} ;
			fromPosition = new FsmVector3 { UseVariable = true};
			direction = new FsmVector3 { UseVariable = true};
			color = Color.white;
		}

		public override void OnUpdate()
		{
			Vector3 startPos = ActionHelpers.GetPosition(fromObject, fromPosition);

			Debug.DrawRay(startPos, direction.Value, color.Value);
		}
	}
}