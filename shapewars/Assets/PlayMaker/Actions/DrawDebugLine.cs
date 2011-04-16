// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Debug)]
	[Tooltip("Draws a line from a Start point to an End point. Specify the points as Game Objects or Vector3 world positions. If both are specified, position is used as a local offset from the Object's position.")]
	public class DrawDebugLine : FsmStateAction
	{
		public FsmGameObject fromObject;
		public FsmVector3 fromPosition;
		public FsmGameObject toObject;
		public FsmVector3 toPosition;
		public FsmColor color;

		public override void Reset()
		{
			fromObject = new FsmGameObject { UseVariable = true} ;
			fromPosition = new FsmVector3 { UseVariable = true};
			toObject = new FsmGameObject { UseVariable = true} ;
			toPosition = new FsmVector3 { UseVariable = true};
			color = Color.white;
		}

		public override void OnUpdate()
		{
			Vector3 startPos = ActionHelpers.GetPosition(fromObject, fromPosition);
			Vector3 endPos = ActionHelpers.GetPosition(toObject, toPosition);
			
			Debug.DrawLine(startPos, endPos, color.Value);
		}
	}
}