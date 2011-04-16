// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Transform)]
	[Tooltip("Gets the Rotation of a Game Object and stores it in a Vector3 Variable or each Axis in a Float Variable")]
	public class GetRotation : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[UIHint(UIHint.Variable)]
		public FsmVector3 vector;
		[UIHint(UIHint.Variable)]
		public FsmFloat xAngle;
		[UIHint(UIHint.Variable)]
		public FsmFloat yAngle;
		[UIHint(UIHint.Variable)]
		public FsmFloat zAngle;
		public Space space;
		public bool everyFrame;

		public override void Reset()
		{
			gameObject = null;
			vector = null;
			xAngle = null;
			yAngle = null;
			zAngle = null;
			space = Space.World;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoGetRotation();
			
			if (!everyFrame)
				Finish();		
		}

		public override void OnUpdate()
		{
			DoGetRotation();
		}

		void DoGetRotation()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go == null) return;

			if (space == Space.World)
			{
				Vector3 rotation = go.transform.eulerAngles;
				
				vector.Value = rotation;
				if (xAngle != null) xAngle.Value = rotation.x;
				if (yAngle != null) yAngle.Value = rotation.y;
				if (zAngle != null) zAngle.Value = rotation.z;
			}
			else
			{
				Vector3 rotation = go.transform.localEulerAngles;
				
				vector.Value = rotation;
				xAngle.Value = rotation.x;
				yAngle.Value = rotation.y;
				zAngle.Value = rotation.z;
			}
		}


	}
}