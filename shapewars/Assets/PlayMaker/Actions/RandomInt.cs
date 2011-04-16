// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Math)]
	[Tooltip("Sets an Integer Variable to a random value between Min/Max.")]
	public class RandomInt : FsmStateAction
	{
		[RequiredField]
		public FsmInt min;
		[RequiredField]
		public FsmInt max;
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmInt storeResult;

		public override void Reset()
		{
			min = 0;
			max = 100;
			storeResult = null;
		}

		public override void OnEnter()
		{
			storeResult.Value = Random.Range(min.Value, max.Value);
			
			Finish();
		}
	}
}