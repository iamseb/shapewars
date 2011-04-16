// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.
using UnityEngine;
namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory("PlayerPrefs")]
	[Tooltip("Returns the value corresponding to key in the preference file if it exists.")]
	public class PlayerPrefsGetFloat : FsmStateAction
	{
		[CompoundArray("Count", "Key", "Variable")]
		[Tooltip("Case sensitive key.")]
		public FsmString[] keys;
		[UIHint(UIHint.Variable)]
		public FsmFloat[] variables;

		public override void Reset()
		{
			keys = new FsmString[0];
			variables = new FsmFloat[0];
		}

		public override void OnEnter()
		{
			for(int i = 0; i<keys.Length;i++){
				if(!keys[i].IsNone || !keys[i].Value.Equals(""))  variables[i].Value = PlayerPrefs.GetFloat(keys[i].Value, variables[i].IsNone ? 0f : variables[i].Value);
			}
			Finish();
		}

	}
}