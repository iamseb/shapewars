// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Input)]
	[Tooltip("Gets the pressed state of a Key.")]
	public class GetKey : FsmStateAction
	{
		[RequiredField]
		public KeyCode key;
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;
		public bool everyFrame;
		
		public override void Reset()
		{
			key = KeyCode.None;
			storeResult = null;
			everyFrame = false;
		}
		
		public override void OnEnter()
		{
			DoGetKey();
			
			if (!everyFrame)
				Finish();
		}
		

		public override void OnUpdate()
		{
			DoGetKey();
		}
		
		void DoGetKey()
		{
			storeResult.Value = Input.GetKey(key);
		}
		
	}
}