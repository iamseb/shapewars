// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.String)]
	[Tooltip("Builds a String from other Strings.")]
	public class BuildString : FsmStateAction
	{
		[RequiredField]
		public FsmString[] stringParts;
		public FsmString seperator;
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmString storeResult;
		public bool everyFrame;

		public override void Reset()
		{
			stringParts = new FsmString[3];
			seperator = null;
			storeResult = null;
			everyFrame = false;
		}

		public override void OnEnter()
		{
			DoBuildString();
			
			if (!everyFrame)
				Finish();
		}

		public override void OnUpdate()
		{
			DoBuildString();
		}
		
		void DoBuildString()
		{
			if (storeResult == null) return;
			
			storeResult.Value = "";
			
			foreach (var stringPart in stringParts)
			{
				storeResult.Value += stringPart;
				storeResult.Value += seperator.Value;
			}
		}
		
	}
}