// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Transform)]
	[Tooltip("Sets the Rotation of a Game Object. To leave any axis unchanged, set variable to 'None'.")]
	public class SetRotation : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[UIHint(UIHint.Variable)]
		public FsmVector3 vector;
		public FsmFloat xAngle;
		public FsmFloat yAngle;
		public FsmFloat zAngle;
		public Space space;
		public bool everyFrame;

		public override void Reset()
		{
			gameObject = null;
			vector = null;
			// default axis to variable dropdown with None selected.
			xAngle = new FsmFloat { UseVariable = true };
			yAngle = new FsmFloat { UseVariable = true };
			zAngle = new FsmFloat { UseVariable = true };
			space = Space.World;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoSetRotation();
			
			if (!everyFrame)
				Finish();		
		}

		public override void OnUpdate()
		{
			DoSetRotation();
		}

		void DoSetRotation()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go == null) return;

			Vector3 rotation;
			
			if (vector.IsNone)
			{
				if (space == Space.Self)
					rotation = go.transform.localEulerAngles;
				else
					rotation = go.transform.eulerAngles;
			}	
			else
				rotation = vector.Value;
			
			// get current values if variable set to none
			
			if (!xAngle.IsNone) rotation.x = xAngle.Value;
			if (!yAngle.IsNone) rotation.y = yAngle.Value;
			if (!zAngle.IsNone) rotation.z = zAngle.Value;

			if (space == Space.Self)
				go.transform.localEulerAngles = rotation;
			else
				go.transform.eulerAngles = rotation;
		}
	}
}