// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.RenderSettings)]
	[Tooltip("Sets the global Skybox.")]
	public class SetSkybox : FsmStateAction
	{
		public Material skybox;

		public override void Reset()
		{
			skybox = null;
		}

		public override void OnEnter()
		{
			RenderSettings.skybox = skybox;
			Finish();
		}
	}
}