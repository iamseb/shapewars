// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Logic)]
	[Tooltip("Tests if a String contains another String.")]
	public class StringContains : FsmStateAction
	{
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmString stringVariable;
		[RequiredField]
		public FsmString containsString;
		public FsmEvent trueEvent;
		public FsmEvent falseEvent;
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;
		public bool everyFrame;

		public override void Reset()
		{
			stringVariable = null;
			containsString = "";
			trueEvent = null;
			falseEvent = null;
			storeResult = null;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoStringContains();
			
			if (!everyFrame)
				Finish();
		}

		public override void OnUpdate()
		{
			DoStringContains();
		}
		
		void DoStringContains()
		{
			if (stringVariable.IsNone || containsString.IsNone) return;
			
			bool contains =  stringVariable.Value.Contains(containsString.Value);

			if (storeResult != null)
				storeResult.Value = contains;
			
			if (contains && trueEvent != null)
				Fsm.Event(trueEvent);
			else if (falseEvent != null)
				Fsm.Event(falseEvent);
			
		}
		
	}
}