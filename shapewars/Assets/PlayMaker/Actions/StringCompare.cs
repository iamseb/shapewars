// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Logic)]
	[Tooltip("Compares 2 Strings and sends Events based on the result.")]
	public class StringCompare : FsmStateAction
	{
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmString stringVariable;
		public FsmString compareTo;
		public FsmEvent equalEvent;
		public FsmEvent notEqualEvent;
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;
		public bool everyFrame;

		public override void Reset()
		{
			stringVariable = null;
			compareTo = "";
			equalEvent = null;
			notEqualEvent = null;
			storeResult = null;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoStringCompare();
			
			if (!everyFrame)
				Finish();
		}

		public override void OnUpdate()
		{
			DoStringCompare();
		}
		
		void DoStringCompare()
		{
			if (stringVariable == null || compareTo == null) return;
			
			bool equal = stringVariable.Value == compareTo.Value;

			if (storeResult != null)
				storeResult.Value = equal;
			
			if (equal && equalEvent != null)
				Fsm.Event(equalEvent);
			else if (notEqualEvent != null)
				Fsm.Event(notEqualEvent);
			
		}
		
	}
}