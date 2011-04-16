// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Transform)]
	[Tooltip("Rotates a Game Object so its forward vector points at a Target. The Target can be specified as a Game Object or a world Position. If you specify both, then the Position is used as a local offset from the Object's Position.")]
	public class LookAt : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		public FsmGameObject targetObject;
		public FsmVector3 targetPosition;
		public FsmVector3 upVector;
		public FsmBool keepVertical;
		//[Tooltip("Draw a line in the Scene View to the look at position.")]
		public FsmBool debug;
		
		public override void Reset()
		{
			gameObject = null;
			targetObject = null;
			targetPosition = new FsmVector3 { UseVariable = true};
			upVector = new FsmVector3 { UseVariable = true};
			keepVertical = true;
			debug = false;
		}

		public override void OnLateUpdate()
		{
			DoLookAt();
		}

		void DoLookAt()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go == null) return;
			
			GameObject goTarget = targetObject.Value;
			if (goTarget == null && targetPosition.IsNone) return;

			Vector3 lookAtPos;
			if (goTarget != null)
			{
				if (!targetPosition.IsNone)
					lookAtPos = goTarget.transform.TransformPoint(targetPosition.Value);
				else
					lookAtPos = goTarget.transform.position;
			}
			else
			{
				lookAtPos = targetPosition.Value;
			}

			if (keepVertical.Value)
			{
				lookAtPos.y = go.transform.position.y;
			}
			
			go.transform.LookAt(lookAtPos, upVector.IsNone ? Vector3.up : upVector.Value);
			
			
			if (debug.Value)
				Debug.DrawLine(go.transform.position, lookAtPos, Fsm.DebugLookAtColor);
		}

	}
}