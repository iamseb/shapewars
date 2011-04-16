// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Input)]
	[Tooltip("Gets the pressed state of the specified Button and stores it in a Bool Variable. See Unity Input Manager doc.")]
	public class GetButton : FsmStateAction
	{
		[RequiredField]
		public FsmString buttonName;		
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;

		public override void Reset()
		{
			buttonName = "Fire1";
			storeResult = null;
		}

		public override void OnUpdate()
		{
			if (storeResult != null)
				storeResult.Value = Input.GetButton(buttonName.Value);
		}
	}
}

