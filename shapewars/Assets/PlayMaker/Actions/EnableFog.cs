// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.RenderSettings)]
	[Tooltip("Enables/Disables Fog in the scene.")]
	public class EnableFog : FsmStateAction
	{
		public FsmBool enableFog;

		public override void Reset()
		{
			enableFog = true;
		}

		public override void OnEnter()
		{
			RenderSettings.fog = enableFog.Value;
			Finish();
		}
	}
}