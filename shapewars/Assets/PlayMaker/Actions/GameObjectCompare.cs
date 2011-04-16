// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Logic)]
	[Tooltip("Compares 2 Game Objects and sends Events based on the result.")]
	public class GameObjectCompare : FsmStateAction
	{
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmGameObject gameObjectVariable;
		[RequiredField]
		public FsmGameObject compareTo;
		public FsmEvent equalEvent;
		public FsmEvent notEqualEvent;
		[UIHint(UIHint.Variable)]
		public FsmBool storeResult;
		public bool everyFrame;

		public override void Reset()
		{
			gameObjectVariable = null;
			compareTo = null;
			equalEvent = null;
			notEqualEvent = null;
			storeResult = null;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoGameObjectCompare();
			
			if (!everyFrame)
				Finish();
		}

		public override void OnUpdate()
		{
			DoGameObjectCompare();
		}
		
		void DoGameObjectCompare()
		{
			if (gameObjectVariable == null || compareTo == null) return;
			
			bool equal = gameObjectVariable.Value == compareTo.Value;

			if (storeResult != null)
				storeResult.Value = equal;
			
			if (equal && equalEvent != null)
				Fsm.Event(equalEvent);
			else if (notEqualEvent != null)
				Fsm.Event(notEqualEvent);
			
		}
		
	}
}