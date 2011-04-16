// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory("PlayerPrefs")]
	[Tooltip("Returns true if key exists in the preferences.")]
	public class PlayerPrefsHasKey : FsmStateAction
	{
		public FsmString key;
		[UIHint(UIHint.Variable)]
		public FsmBool variable;
		
		public override void Reset()
		{
			key = "";
		}

		public override void OnEnter()
		{
			if(!variable.IsNone && !key.IsNone && !key.Value.Equals("")) variable.Value = PlayerPrefs.HasKey(key.Value);
			Finish();
		}
	}
}